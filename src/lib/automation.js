/* ============================================================
   Simulated machine feed -> the rest of the platform.

   Watches the machine cup counters. When a machine passes a
   multiple of AUTO_BATCH_CUPS cups, a "Collected" batch for the
   grounds it left is logged against that machine, and every
   FEED_EVERY_CUPS cups an entry is added to the activity feed.
   The grounds log, the machine's story page, the funnel and the
   feed then move on their own.

   Nothing here touches the baseline figures. It only adds batches
   and feed lines on top of them, and Reports -> Demo data -> Reset
   puts the seed batches and feed back.

   Every open browser runs this, so each addition carries a fixed
   key (machine + cup count) and is skipped if it is already there.
   ============================================================ */
import { MACHINES, LIVE_KEY, GROUNDS_PER_CUP, AUTO_BATCH_CUPS, FEED_EVERY_CUPS } from '../data/seed';

const FEED_LIMIT = 40;
const today = () => new Date().toISOString().slice(0, 10);
const cupsOf = (s, m) => s[LIVE_KEY(m.id)]?.cups || 0;

const SIM_EVERY_MS = 250;

/** The auto-simulate switch. The timer lives here, not in a page, so it survives navigation
    and runs until the switch is turned off (or the tab is closed or refreshed). */
function startSimulator(useStore) {
  let timer = null;
  const stop = () => { clearInterval(timer); timer = null; };
  const unsub = useStore.subscribe((state, prev) => {
    if (state.autoSim === prev.autoSim) return;
    stop();
    if (!state.autoSim) return;
    timer = setInterval(() => {
      const s = useStore.getState();
      s.brew(MACHINES[Math.floor(Math.random() * MACHINES.length)].id);
    }, SIM_EVERY_MS);
  });
  return () => { unsub(); stop(); };
}

export function startAutomation(useStore) {
  const stopSimulator = startSimulator(useStore);
  const unsubscribe = useStore.subscribe((state, prev) => {
    // wait until the shared data has loaded, or a stale local copy could be written over it
    if (state.sync.status !== 'local' && state.sync.status !== 'live') return;

    const batches = [];
    const lines = [];
    MACHINES.forEach((m) => {
      const from = cupsOf(prev, m);
      const to = cupsOf(state, m);
      if (to <= from) return; // a reset (or no change) is not a brew
      for (let c = Math.floor(from / FEED_EVERY_CUPS) + 1; c <= Math.floor(to / FEED_EVERY_CUPS); c++) {
        lines.push(`${m.name} machine has brewed ${c * FEED_EVERY_CUPS} cups`);
      }
      for (let c = Math.floor(from / AUTO_BATCH_CUPS) + 1; c <= Math.floor(to / AUTO_BATCH_CUPS); c++) {
        batches.push({ auto: `${m.id}-${c}`, source: m.source, name: m.name, kg: Math.round(AUTO_BATCH_CUPS * GROUNDS_PER_CUP * 10) / 10 });
      }
    });

    const fresh = batches.filter((b) => !state.batches.some((x) => x.auto === b.auto));
    const newLines = lines.filter((l) => !state.feed.includes(l));
    if (!fresh.length && !newLines.length) return;

    useStore.setState((s) => {
      let nextId = s.nextId;
      const added = fresh.map((b) => ({
        id: nextId++, auto: b.auto, date: today(), source: b.source, kg: b.kg, partner: '',
        use: 'Unassigned', status: 'Collected', notes: 'Auto-logged from the simulated machine feed',
      }));
      const feed = [
        ...fresh.map((b) => `Logged ${b.kg} kg from ${b.name} (machine feed)`),
        ...newLines,
        ...s.feed,
      ].slice(0, FEED_LIMIT);
      return { batches: [...added, ...s.batches], feed, nextId };
    });
  });
  return () => { stopSimulator(); unsubscribe(); };
}
