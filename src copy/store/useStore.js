/* ============================================================
   Global state (Zustand). Holds the auth session, the shared
   operational data (bookings / partners / requests / reach),
   and the toast queue. All mutations live here so the closed
   loop — a school's booking or quiz feeding the staff reach —
   is visible across every view.
   ============================================================ */
import { create } from 'zustand';
import { SEED, ACTS, WEEKS, MISSIONS } from '../data/seed';
import { kgFor } from '../lib/calc';

const ORG_NAMES = { greenridge: 'Greenridge Secondary', hartwell: 'Hartwell Logistics' };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const useStore = create((set, get) => ({
  // --- session ---
  user: null,
  toast: null,

  // --- operational data ---
  ...structuredClone(SEED),

  showToast(text) {
    set({ toast: { text, id: Date.now() } });
  },

  /** email-domain auth. Returns { ok, error } */
  signIn(email) {
    const m = email.trim().toLowerCase().match(/^([^@\s]+)@([^@\s]+\.[^@\s]+)$/);
    if (!m) return { ok: false, error: 'Enter a full email address, like name@school.edu.sg.' };
    const staff = m[2] === 'coffeebot.com';
    const first = cap(m[1].split(/[._-]/)[0]);
    const orgWord = m[2].split('.')[0];
    const org = staff ? 'CoffeeBot' : (ORG_NAMES[orgWord] || cap(orgWord));
    set({ user: { email: m[0], name: first, org, staff } });
    get().showToast(staff ? `Signed in as CoffeeBot staff` : `Signed in as ${org}`);
    return { ok: true, staff };
  },

  signOut() {
    set({ user: null });
  },

  /** book a coffee activity; feeds staff reach + feed (the closed loop) */
  addBooking({ act, week, people }) {
    const { user, nextId } = get();
    const kg = kgFor(people);
    set((s) => ({
      bookings: [...s.bookings, { id: nextId, org: user.org, act, kg, week, people }],
      reach: { ...s.reach, people: s.reach.people + people },
      feed: [`${user.org} booked ${ACTS[act].name.toLowerCase()} for ${WEEKS[week].w}`, ...s.feed],
      nextId: nextId + 1,
    }));
    get().showToast(`Booked for the week of ${WEEKS[week].w}. CoffeeBot's drying plan is updated.`);
    return kg;
  },

  cancelBooking(id) {
    const b = get().bookings.find((x) => x.id === id);
    if (!b) return;
    set((s) => ({
      bookings: s.bookings.filter((x) => x.id !== id),
      reach: { ...s.reach, people: Math.max(0, s.reach.people - b.people) },
    }));
    get().showToast('Booking cancelled. The drying plan has freed up that capacity.');
  },

  /** assign a home mission to your group */
  assignMission(i) {
    const { user } = get();
    set((s) => ({
      missionsAssigned: s.missionsAssigned + 1,
      feed: [`${user.org} assigned "${MISSIONS[i].t}"`, ...s.feed],
    }));
    get().showToast('Assigned. Your group sees it in their app.');
  },

  /** record a mission reported complete — adds families to reach */
  completeMission() {
    set((s) => ({
      missionsCompleted: s.missionsCompleted + 1,
      reach: { ...s.reach, families: s.reach.families + 1 },
      feed: [`A family completed a home mission`, ...s.feed],
    }));
    get().showToast('Logged. That counts towards CoffeeBot’s family reach.');
  },

  /** record a finished quiz — feeds the staff reach counter */
  recordQuiz(title, score, total) {
    const { user } = get();
    set((s) => ({
      quizzesDone: s.quizzesDone + 1,
      reach: { ...s.reach, people: s.reach.people + 1 },
      feed: [`${user.org} completed the quiz “${title}” (${score}/${total})`, ...s.feed],
    }));
  },

  /** public partner request */
  addPartnerRequest({ name, kind, cap: c, wet }) {
    const { user, nextId } = get();
    set((s) => ({
      requests: [...s.requests, { id: nextId, name, kind, cap: c, wet, by: user ? user.email : 'Public partner form' }],
      feed: [`New partner request from ${name}`, ...s.feed],
      nextId: nextId + 1,
    }));
  },

  /** staff approves a partner request → capacity joins the drying plan */
  approveRequest(id) {
    const req = get().requests.find((r) => r.id === id);
    if (!req) return;
    set((s) => ({
      requests: s.requests.filter((r) => r.id !== id),
      partners: [...s.partners, req],
      feed: [`${req.name} joined as a partner`, ...s.feed],
    }));
    get().showToast(`${req.name} approved. ${req.cap} kg a week now has a destination.`);
  },

  /** contact / message into the staff inbox */
  addMessage({ topic, text }) {
    const { user } = get();
    set((s) => ({ inbox: [{ from: user ? user.org : 'Website visitor', topic, text }, ...s.inbox] }));
  },
}));
