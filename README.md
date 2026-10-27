# CoffeeBot · Grounds Up

A digital **Circular Sustainability Hub** for CoffeeBot — one platform, three account
types. The dashboard a user reaches is decided by their account's organisation
(see `src/data/orgs.js`), never chosen by hand:

- **CoffeeBot staff** (`@coffeebot.com`) — measure the whole loop (consumption, grounds,
  reuse destinations, drying plan, partner approvals).
- **Schools & workplaces** — learn by doing (book coffee-ground activities, run quizzes
  and home missions). Participation feeds back into the staff impact figures.

Rebuilt from a single-file HTML prototype into React + Vite, with a few deliberate
"showpiece" moments and a restructured information architecture.

## Stack
- **React 18 + Vite** — app shell
- **react-router-dom** — public / org / staff routes, role-gated
- **zustand** — single store; all mutations live here so the *closed loop* (a booking or
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
| CoffeeBot staff | `/staff` overview · `/staff/plan` · `/staff/partners` · `/staff/impact` |

### Key IA decisions (vs the prototype)
1. Role-aware landing — staff land on Overview, orgs on Dashboard (not a shared carousel).
2. Products merged into **Learn & Do** — every activity (incl. the two wet ones) is now discoverable.
3. **About + metrics are public** — fulfils the "communicated to the public" promise.
4. **Partner with us** is a public page for cafés/farms/makers — out of a teacher's learning nav.
5. The **closed loop is wired** — quizzes, missions and bookings all feed `reach`, visible on
   both the org dashboard and staff Overview.
6. Booking gained a **review-before-confirm** step and cancel.

## Structure
```
src/
  data/seed.js       products, activities, weeks, quizzes, missions, stories, seed state
  data/art.jsx       SVG artwork (products, cup, grounds pile, beans, logo)
  lib/calc.js        weather → drying-capacity math (shared by org + staff)
  store/useStore.js  zustand store + all mutations
  components/hero/   ScrollJourney (landing showpiece) + Hero carousel
  components/layout/ header (role-aware nav) + footer
  components/ui/     Page transition, Counter, ToastHost
  pages/public|org|staff/
```

## Shared data (Supabase)
Operational data — batches, bookings, partners, requests, inbox, feed, reach, course orders —
lives in the zustand store and is mirrored through `src/lib/sync.js`:

- **No configuration**: everything persists in this browser's localStorage. The footer shows
  *This browser only*.
- **With Supabase**: every browser reads and writes the same slices and sees changes live, so a
  booking on one laptop appears on the staff Overview on another within a second. The footer
  shows *Live · shared data*.

Setup (about five minutes):
1. Create a free project at supabase.com.
2. SQL editor → paste and run the whole of `supabase/schema.sql` (the `shared_state` table, open
   prototype policies, realtime, and the `brew` function). It is safe to run again after updates.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon key from
   Project Settings → API. Restart `npm run dev`.
4. The first browser to open the app seeds the table from `src/data/seed.js`. Staff can put
   everything back to the seed figures with **Reports → Demo data → Reset**.

### Simulated IoT feed
Four simulated machines live on the staff Overview under **Live from the machines**. A brew
can come from three places, and every open dashboard updates within about a second:

- the **Brew a cup** button on each machine card, or the **Auto-simulate** switch;
- `node scripts/emit-brews.mjs [--every 3] [--count 20] [--machine m2]`, which plays a
  machine from outside the browser using the values in `.env.local`;
- anything else that calls the `brew(machine)` database function
  (`POST /rest/v1/rpc/brew` with `{"machine": "m1"}`), which is what a real machine's gateway would do.

The function locks the machine's row, adds one and returns the new value in a single
transaction, so reports that arrive at the same instant all count. Brews feed cups served and
grounds generated, so the Circularity rate's denominator moves live. The counters reset with
the rest of the demo data. Machines are listed in `src/data/seed.js` (`MACHINES`).

Design notes: one JSON row per slice, last write wins per slice (except the machine counters,
which only change through `brew`), and the anon key can write everything. That is deliberate for a booth demo and must change (per-row tables, role policies,
server-side auth) before any real deployment. Accounts and organisations stay in the browser
because the table is publicly readable.

## Accounts and routing
There is no backend for accounts yet. Organisations and accounts are seeded in `src/data/orgs.js` and
kept in the browser's localStorage (`coffeebot-auth-v1`); passwords are salted and hashed
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
