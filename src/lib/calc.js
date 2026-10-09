/* ============================================================
   Domain calculations — the weather → drying-capacity logic.
   Pure functions so both org and staff views share one source
   of truth.
   ============================================================ */
import { ACTS, WEEKS, COLLECTED } from '../data/seed';

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
