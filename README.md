# CoffeeBot · Grounds Up

A digital **Circular Sustainability Hub** for CoffeeBot — one platform, three account
types. The dashboard a user reaches is decided by their account's organisation
(see `src/data/orgs.js`), never chosen by hand:

- **CoffeeBot staff** (`@coffeebot.com`) — measure the whole loop (consumption, grounds log,
  reuse destinations, drying plan, partner approvals, downloadable reports and public visibility).
- **Schools & workplaces** — learn through the Education Hub, buy courses, then book
  coffee-ground activities, run quizzes and home missions. Participation feeds back into the
  staff impact figures.

Rebuilt from a single-file HTML prototype into React + Vite, with a few deliberate
"showpiece" moments and a restructured information architecture.

## Stack
- **React 18 + Vite** — app shell
- **react-router-dom** — public / org / staff routes, role-gated
- **zustand** (+ `persist`) — single store; all mutations live here so the *closed loop* (a booking or
  quiz feeding staff reach) is visible across every view
- **framer-motion** — page transitions, scroll reveals, animated counters, toast
- **GSAP + ScrollTrigger** — the scrubbed scroll journey + hero bean choreography
- **@shadergradient/react + three** — living gradient hero backdrop (lazy-loaded, with a
  CSS-gradient fallback and reduced-motion opt-out)

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
```

## Showpiece: the scroll landing
`/` is an Apple-style **scrubbed scrollytelling** narrative — *the life of a coffee ground*:
brew → collect → transform → impact. Pinned GSAP ScrollTrigger timeline on desktop;
degrades to clean stacked, reveal-on-view sections on mobile and for
`prefers-reduced-motion`.

## Information architecture
| Audience | Routes |
|----------|--------|
| Public | `/` landing · `/about` (live metrics + grounds carousel) · `/partner` · `/contact` · `/signin` · `/signup` |
| Teacher / corporate | `/app` dashboard · `/app/hub` Education Hub · `/app/learn` (paid courses) · `/app/cart` · `/app/play` · `/app/book` · `/app/bookings` |
| CoffeeBot staff | `/staff` overview · `/staff/plan` bookings & drying plan · `/staff/partners` · `/staff/grounds` grounds log · `/staff/reports` reports |

Unknown URLs redirect to `/`. Signed-in users are redirected away from `/signin` and `/signup`,
and anyone on the wrong side of the teacher/staff split is sent to their own dashboard.

### Key IA decisions (vs the prototype)
1. Role-aware landing — staff land on Overview, orgs on Dashboard (not a shared carousel).
2. Products merged into **Learn & Do** — every activity (incl. the two wet ones) is now discoverable.
3. **About + metrics are public** — fulfils the "communicated to the public" promise.
4. **Partner with us** is a public page for cafés/farms/makers — out of a teacher's learning nav.
5. The **closed loop is wired** — quizzes, missions and bookings all feed `reach`, visible on
   both the org dashboard and staff Overview.
6. Booking gained a **review-before-confirm** step and cancel.
7. The **Education Hub** (`/app/hub`) teaches sustainability, the circular economy and the coffee
   lifecycle, with content tailored to the account role (teacher or workplace). Content lives in
   `src/data/education.js`; it deliberately contains no statistics.
8. Staff get a **Grounds log** (log and edit batches, filter by status, export CSV) and
   **Reports** (CSV downloads, a printable sustainability impact report, and toggles for which
   figures appear publicly on the About page).

## Structure
```
src/
  data/seed.js       products, activities, weeks, quizzes, missions, stories, batches, seed state
  data/orgs.js       seeded organisations, accounts, roles, password rules
  data/pricing.js    course prices (placeholders)
  data/company.js    company contact details
  data/education.js  Education Hub learning content
  data/art.jsx       SVG artwork (products, cup, grounds pile, beans, logo)
  data/hubArt.js     Education Hub illustrations
  lib/calc.js        weather → drying-capacity and batch/usage maths (shared by org + staff)
  lib/download.js    client-side CSV and text-file downloads
  store/useStore.js  zustand store + all mutations
  components/hero/   ScrollJourney (landing showpiece), Hero, GroundsShowcase, ShaderBackdrop
  components/layout/ header (role-aware nav, cart) + footer
  components/ui/     Page transition, Counter, ToastHost, charts, ClosedLoop, Marquee, Confetti, Icon
  pages/public|org|staff/
```

## Accounts and routing
There is no backend yet. Organisations and accounts are seeded in `src/data/orgs.js` and
kept in the browser's localStorage (`coffeebot-auth-v1`) along with the signed-in user, carts,
purchases and orders. Everything else (bookings, batches, quiz/mission progress) is seed data that
resets on reload. Passwords are salted and hashed
but this is **not** real security — move accounts and the role check to a server before launch.

- Organisation type decides the role: `staff` → `/staff`, `school` → teacher, `company` → corporate (both `/app`).
- Sign-up creates an account instantly. A registered email domain joins that organisation; a new
  domain registers a new one (education domains become schools, the rest companies).
- Staff accounts cannot be self-created, and personal email domains are refused.
- Passwords need 8+ characters, a number and a special character.
- Company contact details live in `src/data/company.js`.

## Paid courses and cart
Courses (`/app/learn`) are paid and bought once per organisation. Add to Cart → `/app/cart` →
Confirm order. **No payment provider is connected**: confirming records the order and unlocks the
lesson plan and session booking for that course, and nothing is charged. Prices live in
`src/data/pricing.js` and are **placeholders** — replace them and set `PRICES_ARE_PLACEHOLDERS`
to `false`.

## Demo accounts
Opened from the buttons on the log-in page (no password):
- Teacher — `aisha.rahman@greenridge.edu.sg`
- Workplace — `daniel.tan@hartwell.com.sg`
- CoffeeBot staff — `meiling@coffeebot.com`
