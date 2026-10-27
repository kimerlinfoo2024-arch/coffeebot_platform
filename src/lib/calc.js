/* ============================================================
   Domain calculations — the weather → drying-capacity logic.
   Pure functions so both org and staff views share one source
   of truth.
   ============================================================ */
import { ACTS, WEEKS, COLLECTED, GROUNDS_PER_CUP, MACHINES, LIVE_KEY } from '../data/seed';

export const fmt = (n) => (Math.round(n * 10) / 10).toLocaleString();

/** kg of dried grounds already booked for week i */
export const dryUsed = (bookings, i) =>
  bookings.filter((b) => b.week === i && !ACTS[b.act].wet).reduce((a, b) => a + b.kg, 0);

/** kg of wet (no-drying) grounds booked for week i */
export const wetUsed = (bookings, i) =>
  bookings.filter((b) => b.week === i && ACTS[b.act].wet).reduce((a, b) => a + b.kg, 0);

/** dried-grounds capacity still free in week i */
export const dryLeft = (bookings, i) => WEEKS[i].dryCap - dryUsed(bookings, i);

/** total weekly partner capacity (kg) */
export const capTotal = (partners) => partners.reduce((a, p) => a + p.cap, 0);

/** kit size (kg) for a group of n people — min 2 kg, rounded to .5 */
export const kgFor = (n) => Math.max(2, Math.ceil(n * 0.1 * 2) / 2);

/** can a group of `people` do activity `act` in week `i`? */
export const weekAvailable = (bookings, act, i, people) =>
  ACTS[act].wet || dryLeft(bookings, i) >= kgFor(people);

/** per-week breakdown used by the staff drying table */
export function weekRow(bookings, partners, i) {
  const dry = dryUsed(bookings, i);
  const wet = wetUsed(bookings, i);
  const left = COLLECTED - dry - wet;
  const part = Math.min(capTotal(partners), left);
  const risk = Math.max(0, left - capTotal(partners));
  return { dry, wet, part, risk };
}

/** totals across all four weeks */
export function groundsTotals(bookings, partners) {
  let act = 0, part = 0, risk = 0;
  WEEKS.forEach((_, i) => {
    const x = weekRow(bookings, partners, i);
    act += x.dry + x.wet;
    part += x.part;
    risk += x.risk;
  });
  return { act, part, risk, collected: COLLECTED * WEEKS.length };
}

/* ---- traceability + usage ---- */

/** colour per reuse pathway, shared by every chart that shows them */
export const USE_COLOR = {
  'Compost': 'var(--leaf)', 'Mushroom growing': 'var(--teal)', 'Activity kits': 'var(--brew)',
  'Skincare': 'var(--amber)', 'Unassigned': 'var(--muted)', 'Landfill': 'var(--bad)',
};

/** kg logged per reuse pathway → [{ name, value, color }] */
export function pathways(batches) {
  const by = {};
  batches.forEach((b) => { by[b.use] = (by[b.use] || 0) + b.kg; });
  return Object.entries(by).map(([name, value]) => ({ name, value, color: USE_COLOR[name] || 'var(--ink)' }));
}

/** headline traceability figures from the batch log */
export function batchTotals(batches) {
  const sum = (f) => batches.filter(f).reduce((a, b) => a + b.kg, 0);
  const logged = sum(() => true);
  const reused = sum((b) => b.status === 'Reused');
  const disposed = sum((b) => b.status === 'Disposed');
  const inProgress = logged - reused - disposed;
  const closed = reused + disposed;
  return { logged, reused, disposed, inProgress, reuseRate: closed ? Math.round((reused / closed) * 100) : 0 };
}

/** coffee usage → grounds generated */
export function usageTotals(usage) {
  const cups = usage.reduce((a, u) => a + u.cups, 0);
  return { cups, kg: cups * GROUNDS_PER_CUP, perWeek: usage.length ? cups / usage.length : 0 };
}

/** simulated machine feed → per-machine counters, total, and the latest brews across machines */
export function liveSummary(state) {
  const machines = MACHINES.map((m) => {
    const v = state[LIVE_KEY(m.id)] || { cups: 0, recent: [] };
    return { ...m, cups: v.cups || 0, last: v.recent?.[0] ?? null, recent: v.recent || [] };
  });
  const recent = machines.flatMap((m) => m.recent.map((t) => ({ t, name: m.name }))).sort((a, b) => b.t - a.t).slice(0, 6);
  return { machines, cups: machines.reduce((a, m) => a + m.cups, 0), recent };
}

/** usage history plus the live feed as one extra period, so grounds generated keeps up with brewing */
export const withLive = (usage, liveCups) => (liveCups > 0 ? [...usage, { w: 'Live', cups: liveCups }] : usage);

/** Circularity Rate — the one headline reuse figure.
    rate = confirmed-reused kg / grounds generated (estimated from cups served).
    Only batches marked Reused count, reuse is capped at what was generated, and the
    unrecovered residual is always reported (never rounded up to 100%). */
export function circularity(batches, usage) {
  const generated = usageTotals(usage).kg;
  const sum = (f) => batches.filter(f).reduce((a, b) => a + b.kg, 0);
  const logged = sum(() => true);
  const dispatched = sum((b) => b.status === 'Dispatched' || b.status === 'Reused');
  const reused = Math.min(sum((b) => b.status === 'Reused'), generated || Infinity);
  const disposed = sum((b) => b.status === 'Disposed');
  const inProgress = Math.max(0, logged - reused - disposed);
  const notCollected = Math.max(0, generated - logged);
  const residual = Math.max(0, generated - reused);
  const pct = (kg) => (generated ? Math.round((kg / generated) * 100) : 0);
  return {
    generated, logged, dispatched, reused, disposed, inProgress, notCollected, residual,
    rate: pct(reused), capture: pct(logged), residualPct: generated ? 100 - pct(reused) : 0,
    stages: [
      { key: 'generated',  label: 'Generated',        note: 'Estimated from cups served (about 20 g a cup)', kg: generated },
      { key: 'logged',     label: 'Collected',        note: 'Weighed and logged in the grounds log',         kg: logged },
      { key: 'dispatched', label: 'Dispatched',       note: 'Sent to a partner or activity (or already reused)', kg: dispatched },
      { key: 'reused',     label: 'Confirmed reused', note: 'Batch marked Reused. This is the Circularity Rate', kg: reused },
    ],
  };
}

/** per-organisation education summary from bookings */
export function educationByOrg(bookings) {
  const by = {};
  bookings.forEach((b) => {
    const o = (by[b.org] ||= { org: b.org, sessions: 0, people: 0, kg: 0, acts: new Set() });
    o.sessions += 1; o.people += b.people; o.kg += b.kg; o.acts.add(ACTS[b.act].name);
  });
  return Object.values(by).map((o) => ({ ...o, acts: [...o.acts].join(', ') }));
}
