/* ============================================================
   Store <-> Supabase sync for the shared operational slices.

   Model: one row per slice in `shared_state` (key, value jsonb).
   The zustand store stays the single place mutations happen; this
   module only mirrors changed slices up and applies remote rows
   down. Last write wins per slice, which is fine for a booth demo
   where two laptops mostly touch different slices.
   ============================================================ */
import { supabase, BACKEND, TABLE } from './backend';

/** slices every browser should agree on */
export const SHARED_KEYS = [
  'batches', 'usage', 'visibility', 'bookings', 'partners', 'requests', 'inbox', 'feed',
  'reach', 'reusedYear', 'quizzesDone', 'missionsAssigned', 'missionsCompleted', 'nextId',
  'purchases', 'orders',
];

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const DEBOUNCE_MS = 200;

export function startSync(useStore) {
  const setStatus = (patch) => useStore.setState((s) => ({ sync: { ...s.sync, ...patch } }));

  if (!supabase) {
    setStatus({ backend: BACKEND, status: 'local' });
    return () => {};
  }
  setStatus({ backend: BACKEND, status: 'connecting' });

  let applyingRemote = false;
  const timers = {};
  const pending = {};

  const applyRemote = (rows) => {
    const state = useStore.getState();
    const patch = {};
    rows.forEach((r) => {
      if (SHARED_KEYS.includes(r.key) && !same(state[r.key], r.value)) patch[r.key] = r.value;
    });
    if (!Object.keys(patch).length) return;
    applyingRemote = true;
    try { useStore.setState(patch); } finally { applyingRemote = false; }
  };

  const push = async (rows) => {
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

  // 1. local edits -> remote
  const unsubStore = useStore.subscribe((state, prev) => {
    if (applyingRemote) return;
    SHARED_KEYS.forEach((k) => { if (state[k] !== prev[k] && !same(state[k], prev[k])) queue(k, state[k]); });
  });

  // 2. initial load: remote wins; an empty table is seeded from this browser
  (async () => {
    const { data, error } = await supabase.from(TABLE).select('key,value');
    if (error) {
      console.error('[sync] load failed', error);
      setStatus({ status: 'error', error: error.message });
      return;
    }
    const have = new Set(data.map((r) => r.key));
    const missing = SHARED_KEYS.filter((k) => !have.has(k));
    applyRemote(data);
    if (missing.length) {
      const s = useStore.getState();
      await push(missing.map((key) => ({ key, value: s[key], updated_at: new Date().toISOString() })));
    } else {
      setStatus({ status: 'live', error: null, lastSync: Date.now() });
    }
  })();

  // 3. remote edits -> local
  const channel = supabase
    .channel(`shared_state_${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, (payload) => {
      if (payload.new?.key) applyRemote([payload.new]);
    })
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setStatus({ status: 'error', error: `realtime ${status.toLowerCase()}` });
    });

  return () => { unsubStore(); supabase.removeChannel(channel); };
}
