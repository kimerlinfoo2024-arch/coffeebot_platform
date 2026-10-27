/* ============================================================
   Global state (Zustand). Holds the auth session, the shared
   operational data (bookings / partners / requests / reach),
   and the toast queue. All mutations live here so the closed
   loop — a school's booking or quiz feeding the staff reach —
   is visible across every view.
   ============================================================ */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SEED, ACTS, WEEKS, MISSIONS } from '../data/seed';
import { SHARED_KEYS } from '../lib/sync';
import { kgFor } from '../lib/calc';
import { COURSE_PRICES } from '../data/pricing';
import {
  SEED_ORGS, SEED_ACCOUNTS, ROLE_BY_ORG_TYPE, ROLE_HOME, PERSONAL_DOMAINS,
  parseEmail, findOrgByDomain, orgTypeForDomain, passwordOk,
} from '../data/orgs';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* Passwords are salted and hashed before they are kept in the browser.
   This is a stand-in until there is a real backend: anything stored
   client-side can be read by the person using that browser. */
async function hashPassword(password, salt) {
  const text = `${salt}:${password}`;
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // crypto.subtle is unavailable on non-secure origins (e.g. http://192.168.x.x)
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return `fnv-${(h >>> 0).toString(16)}`;
}
const newSalt = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/** build the session object from a stored account + its organisation */
function sessionFor(account, orgs) {
  const org = orgs.find((o) => o.id === account.orgId);
  const role = org ? ROLE_BY_ORG_TYPE[org.type] : null;
  if (!org || !role || role !== account.role) return null;
  return { email: account.email, name: account.name, org: org.name, orgId: org.id, role, staff: role === 'staff' };
}

export const useStore = create(persist((set, get) => ({
  // --- session ---
  user: null,
  toast: null,

  // --- accounts + organisations (browser-stored until there is a database) ---
  orgs: structuredClone(SEED_ORGS),
  accounts: structuredClone(SEED_ACCOUNTS),

  // --- operational data (shared between browsers when Supabase is configured, see lib/sync.js) ---
  ...structuredClone(SEED),
  sync: { backend: 'local', status: 'local', lastSync: null, error: null },

  showToast(text) {
    set({ toast: { text, id: Date.now() } });
  },

  /** start a session for a stored account. Returns { ok, error, home } */
  openSession(account) {
    const user = sessionFor(account, get().orgs);
    if (!user) {
      return { ok: false, error: 'Your account is not assigned to a dashboard yet. Email us and we will sort it out.', next: 'contact' };
    }
    set({ user });
    get().showToast(user.staff ? 'Logged in as CoffeeBot staff' : `Logged in as ${user.org}`);
    return { ok: true, home: ROLE_HOME[user.role] };
  },

  /** email + password log-in. The dashboard comes from the account record, never from the form. */
  async signIn(email, password) {
    const e = parseEmail(email);
    if (!e) return { ok: false, error: 'Enter a full email address, like name@school.edu.sg.' };
    const account = get().accounts.find((a) => a.email === e.email);
    if (!account) {
      const known = findOrgByDomain(get().orgs, e.domain);
      return {
        ok: false, next: 'signup',
        error: known && known.type !== 'staff'
          ? `There is no account for that email yet. ${known.name} is already registered — sign up to join it.`
          : 'There is no account for that email. Check the address, or sign up first.',
      };
    }
    if (account.demo) return { ok: false, error: 'That is a demo account — open it with the demo buttons below.' };
    if (!password) return { ok: false, error: 'Enter your password.' };
    if ((await hashPassword(password, account.salt)) !== account.hash) {
      return { ok: false, error: 'That email and password do not match.' };
    }
    return get().openSession(account);
  },

  /** demo accounts only — no password */
  signInDemo(email) {
    const account = get().accounts.find((a) => a.email === email && a.demo);
    if (!account) return { ok: false, error: 'That demo account is not available.' };
    return get().openSession(account);
  },

  /** create an account instantly. The role is derived from the organisation, never chosen. */
  async signUp({ name, orgName, email, password }) {
    const e = parseEmail(email);
    if (!name.trim()) return { ok: false, error: 'Add your name.' };
    if (!e) return { ok: false, error: 'Enter a full email address, like name@school.edu.sg.' };
    if (PERSONAL_DOMAINS.includes(e.domain)) {
      return { ok: false, error: 'Use your school or work email. Personal addresses cannot be matched to an organisation.', next: 'contact' };
    }
    const { accounts, orgs } = get();
    if (accounts.some((a) => a.email === e.email)) {
      return { ok: false, error: 'There is already an account for that email. Log in instead.', next: 'signin' };
    }
    let org = findOrgByDomain(orgs, e.domain);
    if (org?.type === 'staff') {
      return { ok: false, error: 'Staff accounts are issued by CoffeeBot and cannot be created here. Email us if you need one.', next: 'contact' };
    }
    if (!passwordOk(password)) {
      return { ok: false, error: 'Your password needs at least 8 characters, with a number and a special character.' };
    }
    let nextOrgs = orgs;
    if (!org) {
      if (!orgName.trim()) return { ok: false, error: 'Add the name of your school or company.' };
      org = { id: `org-${Date.now().toString(36)}`, name: orgName.trim(), type: orgTypeForDomain(e.domain), domains: [e.domain] };
      nextOrgs = [...orgs, org];
    }
    const salt = newSalt();
    const account = {
      email: e.email, name: cap(name.trim()), orgId: org.id, role: ROLE_BY_ORG_TYPE[org.type],
      salt, hash: await hashPassword(password, salt),
    };
    set({ orgs: nextOrgs, accounts: [...accounts, account] });
    return get().openSession(account);
  },

  signOut() {
    set({ user: null });
  },

  // --- paid courses: cart per account, purchases per organisation ---
  carts: {},
  purchases: {},
  orders: [],

  addToCart(course) {
    const { user, carts, purchases } = get();
    if (!user || user.staff || !ACTS[course]) return;
    const mine = carts[user.email] || [];
    // a course is bought once per organisation, so it can't be added twice
    if (mine.includes(course) || (purchases[user.orgId] || []).includes(course)) return;
    set({ carts: { ...carts, [user.email]: [...mine, course] } });
    get().showToast(`${ACTS[course].name} added to your cart.`);
  },

  removeFromCart(course) {
    const { user, carts } = get();
    if (!user) return;
    set({ carts: { ...carts, [user.email]: (carts[user.email] || []).filter((k) => k !== course) } });
  },

  /** Confirm the order. No payment is taken — there is no payment provider yet.
      The order is recorded and the courses unlock for the whole organisation. */
  checkout() {
    const { user, carts, purchases, orders, nextId } = get();
    const items = (carts[user?.email] || []).filter((k) => !(purchases[user.orgId] || []).includes(k));
    if (!user || user.staff || !items.length) return null;
    const lines = items.map((k) => ({ course: k, name: ACTS[k].name, price: COURSE_PRICES[k] }));
    const order = {
      id: nextId, org: user.org, orgId: user.orgId, by: user.email, lines,
      total: lines.reduce((a, l) => a + l.price, 0), date: new Date().toISOString().slice(0, 10),
    };
    set((s) => ({
      orders: [order, ...orders],
      purchases: { ...purchases, [user.orgId]: [...(purchases[user.orgId] || []), ...items] },
      carts: { ...carts, [user.email]: [] },
      feed: [`${user.org} ordered ${items.length} course${items.length === 1 ? '' : 's'}`, ...s.feed],
      nextId: nextId + 1,
    }));
    return order;
  },

  /** book a coffee activity; feeds staff reach + feed (the closed loop) */
  addBooking({ act, week, people }) {
    const { user, nextId, purchases } = get();
    if (!(purchases[user.orgId] || []).includes(act)) return null;
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

  /** log a new grounds batch (traceability) */
  addBatch(batch) {
    const { nextId } = get();
    set((s) => ({
      batches: [{ id: nextId, ...batch }, ...s.batches],
      feed: [`Logged ${batch.kg} kg from ${batch.source}`, ...s.feed],
      nextId: nextId + 1,
    }));
    get().showToast(`Batch #${nextId} logged.`);
  },

  /** patch a batch — status, use, partner or notes */
  updateBatch(id, patch) {
    set((s) => ({ batches: s.batches.map((b) => (b.id === id ? { ...b, ...patch } : b)) }));
  },

  /** toggle what the public About page shows */
  setVisibility(key, on) {
    set((s) => ({ visibility: { ...s.visibility, [key]: on } }));
  },

  /** staff: put every shared slice back to the seed data (demo reset) */
  resetDemoData() {
    const fresh = structuredClone(SEED);
    set(Object.fromEntries(SHARED_KEYS.map((k) => [k, k in fresh ? fresh[k] : (k === 'purchases' ? {} : [])])));
    get().showToast('Demo data reset to the seed figures.');
  },

  /** contact / message into the staff inbox */
  addMessage({ topic, text }) {
    const { user } = get();
    set((s) => ({ inbox: [{ from: user ? user.org : 'Website visitor', topic, text }, ...s.inbox] }));
  },
}), {
  name: 'coffeebot-auth-v1',
  // the session, accounts, organisations, carts and every shared slice survive a refresh;
  // with Supabase configured the shared slices are overwritten by the remote copy on load
  partialize: (s) => ({
    user: s.user, accounts: s.accounts, orgs: s.orgs, carts: s.carts,
    ...Object.fromEntries(SHARED_KEYS.map((k) => [k, s[k]])),
  }),
  // the session is always rebuilt from the account record, so editing the
  // stored `user` (e.g. its role) cannot switch dashboards
  merge: (saved, current) => {
    const m = { ...current, ...saved };
    m.orgs = [...SEED_ORGS, ...(m.orgs || []).filter((o) => !SEED_ORGS.some((x) => x.id === o.id))];
    m.accounts = [...SEED_ACCOUNTS, ...(m.accounts || []).filter((a) => !SEED_ACCOUNTS.some((x) => x.email === a.email))];
    const account = m.user && m.accounts.find((a) => a.email === m.user.email);
    m.user = account ? sessionFor(account, m.orgs) : null;
    return m;
  },
}));
