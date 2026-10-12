/* ============================================================
   Organisations, roles and the rules that decide which dashboard
   an account reaches. This is the single place to configure
   email-domain mapping — nothing else hardcodes domains.

   There is no backend yet: organisations and accounts are seeded
   here and kept in the browser (see store/useStore.js). When a
   database arrives, these records are what it should hold.
   ============================================================ */

/** organisation type → account role */
export const ROLE_BY_ORG_TYPE = { staff: 'staff', school: 'teacher', company: 'corporate' };

/** role → where that role lands after logging in */
export const ROLE_HOME = { staff: '/staff', teacher: '/app', corporate: '/app' };

export const ROLE_LABEL = { staff: 'CoffeeBot staff', teacher: 'Teacher', corporate: 'Corporate' };

/** registered organisations and the email domains that belong to them */
export const SEED_ORGS = [
  { id: 'coffeebot',  name: 'CoffeeBot',            type: 'staff',   domains: ['coffeebot.com'] },
  { id: 'greenridge', name: 'Greenridge Secondary', type: 'school',  domains: ['greenridge.edu.sg'] },
  { id: 'hartwell',   name: 'Hartwell Logistics',   type: 'company', domains: ['hartwell.com.sg'] },
];

/** demo accounts — opened from the buttons on the log-in page, no password */
export const SEED_ACCOUNTS = [
  { email: 'aisha.rahman@greenridge.edu.sg', name: 'Aisha',   orgId: 'greenridge', role: 'teacher',   demo: true },
  { email: 'daniel.tan@hartwell.com.sg',     name: 'Daniel',  orgId: 'hartwell',   role: 'corporate', demo: true },
  { email: 'meiling@coffeebot.com',          name: 'Meiling', orgId: 'coffeebot',  role: 'staff',     demo: true },
];

/** personal mailboxes can't identify a school or company, so sign-up refuses them */
export const PERSONAL_DOMAINS = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.com.sg', 'hotmail.com', 'outlook.com', 'live.com',
  'icloud.com', 'me.com', 'msn.com', 'aol.com', 'proton.me', 'protonmail.com', 'gmx.com', 'mail.com',
];

/** a new, unregistered domain is treated as a school only if it is an education domain */
const EDU_DOMAIN = /(^|\.)(edu|ac|sch)(\.[a-z]{2,3})?$/;
export const orgTypeForDomain = (domain) => (EDU_DOMAIN.test(domain) ? 'school' : 'company');

export const parseEmail = (raw) => {
  const m = String(raw || '').trim().toLowerCase().match(/^([^@\s]+)@([^@\s]+\.[^@\s]+)$/);
  return m ? { email: m[0], local: m[1], domain: m[2] } : null;
};

export const findOrgByDomain = (orgs, domain) => orgs.find((o) => o.domains.includes(domain)) || null;

/** at least 8 characters, with a number and a special character */
export const PASSWORD_RULES = [
  ['At least 8 characters', (p) => p.length >= 8],
  ['At least one number', (p) => /\d/.test(p)],
  ['At least one special character (like ! @ # $)', (p) => /[^A-Za-z0-9\s]/.test(p)],
];
export const passwordOk = (p) => PASSWORD_RULES.every(([, test]) => test(p));
