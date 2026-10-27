/* ============================================================
   Store <-> Supabase sync for the shared operational slices.

   Model: one row per slice in `shared_state` (key, value jsonb).
   The zustand store stays the single place mutations happen; this
   module mirrors changed slices up and applies remote rows down.
   Last write wins per slice, which is fine for a booth demo where
   two laptops mostly touch different slices.

   Exception: the machine counters (`live_<id>`). Those are only ever
   written through the `brew` database function, which increments
   atomically, so simultaneous reports from several machines and
   browsers all count. In Supabase mode the browser never writes a
   live slice itself; it calls brew() and the row comes back.
   ============================================================ */
import { getClient, BACKEND, TABLE } from './backend';
import { MACHINES, LIVE_KEY } from '../data/seed';

/** slices every browser should agree on */
export const SHARED_KEYS = [
  'batches', 'usage', 'visibility', 'bookings', 'partners', 'requests', 'inbox', 'feed',
  'reach', 'quizzesDone', 'missionsAssigned', 'missionsCompleted', 'nextId',
  'purchases', 'orders',
  ...MACHINES.map((m) => LIVE_KEY(m.id)), // simulated machine brew counters
];

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const DEBOUNCE_MS = 200;

let store = null;            // the zustand store handed to startSync
let applyingRemote = false;  // true while server data is being written into the store

/** write server rows into the store without echoing them back up */
function applyRemote(rows) {
  if (!store) return;
  const state = store.getState();
  const patch = {};
  rows.forEach((r) => {
    if (SHARED_KEYS.includes(r.key) && !same(state[r.key], r.value)) patch[r.key] = r.value;
  });
  if (!Object.keys(patch).length) return;
  applyingRemote = true;
  try { store.setState(patch); } finally { applyingRemote = false; }
}

/** one machine reports one brewed cup */
export async function brew(machineId) {
  if (!store || !MACHINES.some((m) => m.id === machineId)) return { ok: false, error: 'Unknown machine.' };
  const key = LIVE_KEY(machineId);
  if (BACKEND !== 'supabase') {
    // browser-only mode: nobody else can write, so a local increment is exact
    store.setState((s) => {
      const cur = s[key] || { cups: 0, recent: [] };
      return { [key]: { cups: (cur.cups || 0) + 1, recent: [Date.now(), ...(cur.recent || [])].slice(0, 5) } };
    });
    return { ok: true };
  }
  const supabase = await getClient();
  const { data, error } = await supabase.rpc('brew', { machine: machineId });
  if (error) {
    const missing = /function .*brew/i.test(error.message) || error.code === 'PGRST202';
    const msg = missing ? 'the brew function is not installed — run supabase/schema.sql' : error.message;
    console.error('[sync] brew failed', error);
    return { ok: false, error: msg };
  }
  applyRemote([{ key, value: data }]); // realtime will echo the same row; applying now keeps the UI snappy
  return { ok: true };
}

export function startSync(useStore) {
  store = useStore;
  const setStatus = (patch) => useStore.setState((s) => ({ sync: { ...s.sync, ...patch } }));

  if (BACKEND !== 'supabase') {
    setStatus({ backend: BACKEND, status: 'local' });
    return () => {};
  }
  setStatus({ backend: BACKEND, status: 'connecting' });
  let channel = null;   // realtime subscription, once the client has loaded
  let stopped = false;

  const timers = {};
  const pending = {};

  const push = async (rows) => {
    const supabase = await getClient();
    const { error } = await supabase.from(TABLE).upsert(rows, { onConflict: 'key' });
    if (error) {
      console.error('[sync] upsert failed', error);
      setStatus({ status: 'error', error: error.message });
    } else {
      setStatus({ status: 'live', error: null, lastSync: Date.now() });
    }
  };

  const queue = (key, value) => {
    pending[key] = value;
    clearTimeout(timers[key]);
    timers[key] = setTimeout(() => {
      const v = pending[key];
      delete pending[key];
      push([{ key, value: v, updated_at: new Date().toISOString() }]);
    }, DEBOUNCE_MS);
  };

  // 1. local edits -> remote. Slices edited before the first load finishes are remembered so
  //    the load cannot overwrite them with older remote data.
  let loaded = false;
  const editedEarly = new Set();
  const unsubStore = useStore.subscribe((state, prev) => {
    if (applyingRemote) return;
    SHARED_KEYS.forEach((k) => {
      if (state[k] !== prev[k] && !same(state[k], prev[k])) {
        if (!loaded) editedEarly.add(k);
        queue(k, state[k]);
      }
    });
  });

  // 3. remote edits -> local
  const subscribe = (supabase) => {
    channel = supabase
      .channel(`shared_state_${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, (payload) => {
        if (payload.new?.key) applyRemote([payload.new]);
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setStatus({ status: 'error', error: `realtime ${status.toLowerCase()}` });
      });
  };

  // 2. initial load: remote wins; an empty table is seeded from this browser
  (async () => {
    const supabase = await getClient();
    if (stopped) return;
    subscribe(supabase); // 3. remote edits -> local
    const { data, error } = await supabase.from(TABLE).select('key,value');
    if (error) {
      console.error('[sync] load failed', error);
      setStatus({ status: 'error', error: error.message });
      return;
    }
    const have = new Set(data.map((r) => r.key));
    const missing = SHARED_KEYS.filter((k) => !have.has(k));
    applyRemote(data.filter((r) => !editedEarly.has(r.key)));
    loaded = true;
    if (missing.length) {
      const s = useStore.getState();
      await push(missing.map((key) => ({ key, value: s[key], updated_at: new Date().toISOString() })));
    } else {
      setStatus({ status: 'live', error: null, lastSync: Date.now() });
    }
  })();

  return () => {
    stopped = true;
    unsubStore();
    if (channel) getClient().then((supabase) => supabase.removeChannel(channel));
    store = null;
  };
}
