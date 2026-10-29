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
- **GSAP + ScrollTrigger** — the scrubbed scroll journey on the landing page (fetched on
  demand, desktop only)
- **@supabase/supabase-js** — shared state and the machine ingest function (loaded after first paint)
- **qrcode** — the printable booth card on each machine's story page

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
| Public | `/` landing · `/about` (live metrics + grounds carousel) · `/m/:machineId` (QR story per machine) · `/partner` · `/contact` · `/signin` · `/signup` |
| Teacher / corporate | `/app` dashboard · `/app/hub` Education Hub · `/app/learn` (paid courses) · `/app/cart` · `/app/play` · `/app/book` · `/app/bookings` |
| CoffeeBot staff | `/staff` overview · `/staff/plan` · `/staff/partners` · `/staff/grounds` · `/staff/reports` |

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
  components/hero/   ScrollJourney (landing showpiece) + GroundsShowcase (About)
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

### Joining an existing Supabase project (teammates)
The project owner has already run `supabase/schema.sql`, so teammates only need the keys:

1. Check out the branch and run `npm install`.
2. Copy the template: `cp .env.example .env.local`.
3. Fill in the two empty lines of `.env.local`, with no quotes and no spaces after the `=`:
   ```
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```
4. Get both values from the project owner, either privately by message or by being invited
   under Project Settings → Team, after which they are under Project Settings → API ("Project
   URL" and the "anon public" key).
5. Stop the dev server (Ctrl+C) and run `npm run dev` again. Vite only reads `.env.local` on start.
6. Check the footer of any page. It should say **Live · shared data**. If it says **This
   browser only**, the file is missing, misnamed, or the server was not restarted.

Never commit `.env.local` (`.gitignore` already excludes it). If someone skips this, the app
still runs, but they only see their own browser's data, so bookings and brews will not appear
on anyone else's screen. The anon key is meant to ship to browsers, but the prototype policies
let anyone holding it read and write every row, so share it only with the team and rotate it
(Project Settings → API) after the demo. A brand-new Supabase project needs `supabase/schema.sql`
run once in its SQL editor.

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

### QR story page per machine
Every machine has a public page, `/m/<machine id>` (for example `/m/m1`), meant to be reached by
scanning a code stuck on the machine. It shows that machine's live brews, the grounds they left
behind, every batch collected from it with its status, where those batches went, and any logged
session with the teacher's photo. Landfill and unassigned batches stay out of the public
pathway chart but disposed kg is still stated. The page ends with a **booth card**: a QR code
for its own address plus a one-line pitch; **Print** gives a card with nothing else on the page.
Machines are tied to grounds-log entries through `source` in `MACHINES` (`src/data/seed.js`).

The public **confirmed reused** figure on the landing page, About page and scroll hero is
`batchTotals(batches).reused` — the grounds log's own number. There is no separate headline figure.

Design notes: one JSON row per slice, last write wins per slice (except the machine counters,
which only change through `brew`), and the anon key can write everything. That is deliberate for a booth demo and must change (per-row tables, role policies,
server-side auth) before any real deployment. Accounts and organisations stay in the browser
because the table is publicly readable.

## Green computing
The question was whether the platform itself is lean enough to preach circularity. Measured
with Lighthouse 12 (performance category, simulated mobile, `vite preview` on localhost) and
`vite build` output, on 27 Oct 2026.

| | Before | After |
|---|---|---|
| JavaScript on first load, landing page (minified) | 866 kB in one file | 351 kB (phone) · 422 kB (desktop) |
| Same, gzipped over the wire | 272 kB | 116 kB (phone) · 144 kB (desktop) |
| Lighthouse performance, landing page | 84 | 96 |
| Largest contentful paint, landing page | 3.9 s | 2.4 s |
| Installed dependencies | three.js, react-three-fiber and shadergradient (34 MB) | removed |

What changed:
1. **Dead hero removed.** The three.js shader backdrop (`Hero.jsx`, `ShaderBackdrop.jsx`) was no
   longer rendered anywhere, so its three packages were pure install weight. Deleted.
2. **One chunk per page.** Every route except the landing page is a `React.lazy` import
   (`src/App.jsx`), so a phone that scans a machine's QR code downloads the story page and
   nothing from the staff or education side.
3. **GSAP only where it animates.** The 115 kB scroll library is fetched inside `ScrollJourney`
   only on desktop with motion allowed. Phones and reduced-motion users get the stacked
   version and never download it.
4. **Supabase after first paint.** The 228 kB client is loaded with a dynamic import from
   `src/lib/backend.js`, so the page renders before the sync library arrives, then goes live.
5. **No layout shift while a page loads.** The lazy-route fallback holds the footer in place
   (story page cumulative layout shift 0.64 → 0.01).

Still on the list: self-host the two Google Fonts, and give the browser-stored session photos
a size cap in the shared row (they are already shrunk to about 15–40 KB each).

## What is functional and what is conceptual
For anyone asking "how much of this actually works":

| Area | Status | Notes |
|---|---|---|
| Grounds log, batch statuses, pathways, Circularity rate | **Functional** | Real ledger in the shared store; every public figure derives from it |
| Dispatch a batch to a booked session, teacher logs outcome with photo | **Functional** | Reuse is only confirmed by the teacher's log; residual grounds come back as a batch |
| Shared live state across browsers (Supabase) | **Functional** | One JSON row per slice, realtime; open prototype policies |
| Machine brew feed | **Simulated** | Buttons, auto-simulator and `scripts/emit-brews.mjs` call the same atomic `brew` function a real gateway would |
| QR story page and printable booth card | **Functional** | Reads the same store; QR encodes the page's own address |
| Bookings, cart, partner requests and approvals, inbox, feed | **Functional** | Stored in the shared state |
| Course payment | **Conceptual** | Confirming an order unlocks the course; nothing is charged, prices are placeholders |
| Accounts and roles | **Prototype** | Browser-only, hashed passwords, no server check |
| Weather-driven drying capacity | **Seeded** | The four-week outlook in `WEEKS` is hand-entered, not fetched from a forecast |
| Reach figures (people, families) | **Seeded + live** | Start from seed values, then move with real bookings, quizzes and missions |
| Education hub lesson plans | **Content pending** | Structure works; lesson content is being confirmed |

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
