# CoffeeBot · Grounds Up

A digital **Circular Sustainability Hub** for CoffeeBot: one platform, four kinds of account.
The dashboard a user reaches is decided by their account's organisation
(see `src/data/orgs.js`), never chosen by hand:

- **CoffeeBot staff** (`@coffeebot.com`): measure the whole loop (consumption, grounds log,
  reuse destinations, drying plan, partner approvals, downloadable reports).
- **Schools (teachers) and workplaces (corporate)**: learn through the Education Hub, buy courses,
  book coffee-ground activities, log each session with a photo, and assign quizzes and home
  missions to a class or team through a shareable link. Participation feeds back into the staff
  impact figures.
- **Reuse partners** (cafés, farms, makers): send CoffeeBot a request to take grounds from their own
  dashboard and follow whether it has been approved.

Students and family members who open a teacher's quiz or mission link need no account.

Rebuilt from a single-file HTML prototype into React + Vite, with a few deliberate
"showpiece" moments and a restructured information architecture.

## Stack
- **React 18 + Vite 5**: app shell (use a current Node LTS; Vite 5 needs Node 18 or newer)
- **react-router-dom 6**: public / org / partner / staff routes, role-gated
- **zustand** (+ `persist`): single store; all mutations live here so the *closed loop* (a booking or
  a student's finished quiz feeding staff reach) is visible across every view
- **framer-motion**: page transitions, scroll reveals, animated counters, toast
- **GSAP + ScrollTrigger**: the scrubbed scroll journey on the landing page (fetched on
  demand, desktop only)
- **@supabase/supabase-js**: shared state and the machine ingest function (loaded after first paint)
- **qrcode**: the printable booth card on each machine's story page
- **Plain CSS** with design tokens (`src/styles/tokens.css`), one stylesheet per page or component group

## Contents
[Installation](#installation) · [Commands](#commands) · [Configuration](#configuration) ·
[Troubleshooting](#troubleshooting) · [How it fits together](#how-it-fits-together) ·
[Information architecture](#information-architecture) · [Structure](#structure) ·
[Shared data (Supabase)](#shared-data-supabase) · [Deployment](#deploying-vercel) · [Quizzes and missions](#quizzes-and-missions) ·
[Green computing](#green-computing) · [Functional vs conceptual](#what-is-functional-and-what-is-conceptual) ·
[Accounts and routing](#accounts-and-routing) · [Demo accounts](#demo-accounts)

## Installation

### Prerequisites
- **Node.js 18 or newer** (a current LTS is best; developed on Node 24) and **npm** (bundled with Node).
- **Git**.
- Optional: a free [Supabase](https://supabase.com) project, only if you want data shared live
  across browsers. Without it the app works fully, storing data in your browser.

### Quick start
```bash
git clone https://github.com/kimerlinfoo2024-arch/coffeebot_platform.git
cd coffeebot_platform
npm install
npm run dev
```
Open **http://localhost:5173**. That is all that is needed for browser-only mode; the footer will
say *This browser only*. Use the [demo accounts](#demo-accounts) to explore each dashboard.

To share data live across browsers, also follow [Configuration](#configuration) below.

### MAMP note
The repo lives under MAMP's `htdocs` folder, but the app is a Vite project and does **not** need
Apache or PHP. Run it with `npm run dev`. To serve a production build from any static host
(including Apache), run `npm run build` and publish `dist/`, making sure every path falls back to
`index.html` (see `vercel.json` for the rule).

## Commands
```bash
npm install                              # install dependencies
npm run dev                              # dev server with hot reload, http://localhost:5173
npm run build                            # production build -> dist/
npm run preview                          # serve the production build locally
node scripts/emit-brews.mjs [--every 3] [--count 20] [--machine m2]
                                         # simulated machine; needs Supabase configured
```
There is no test suite or linter configured. `npm run build` is the check that the code compiles.
To test on a phone on the same network, run `npx vite --host` and open the printed network URL.

## Configuration
The only configuration is two optional environment variables, read by Vite at start-up:

| Variable | Meaning |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL (Project Settings → API) |
| `VITE_SUPABASE_ANON_KEY` | The "anon public" key from the same page |

1. `cp .env.example .env.local` and paste in both values.
2. In the Supabase SQL editor, run the whole of `supabase/schema.sql` once (safe to re-run).
3. Restart `npm run dev`. The footer should now say **Live · shared data**.

Full details, teammate onboarding and deployment are in [Shared data (Supabase)](#shared-data-supabase).
`.env.local` is git-ignored; never commit it.

## Troubleshooting
| Symptom | Fix |
|---|---|
| Footer says *This browser only* although keys are set | The file must be named exactly `.env.local` in the project root, with no quotes; **restart** `npm run dev` |
| Footer says *Sync error · this browser only* | Hover it for the error. Usually `supabase/schema.sql` has not been run, or the URL or key is wrong |
| `npm install` or `vite` fails with syntax errors | Node is too old; upgrade to Node 18+ (`node -v`) |
| Port 5173 is busy | Vite picks the next free port and prints it; or stop the other process |
| Deep link or refresh gives a 404 when deployed | The host needs a fallback to `index.html` (Vercel uses `vercel.json`) |
| Deployed site ignores Supabase | Set both variables in the host's settings **and redeploy**; Vite bakes them in at build time |
| Demo data looks wrong or stale | Staff → Reports → Demo data → Reset (stop any running simulation first), or clear the site's localStorage |
| `emit-brews.mjs` says "Missing VITE_SUPABASE_URL" | Create `.env.local` first, or export the two variables in your shell |

## How it fits together
```
 browser (React app)                         Supabase (optional)
 ┌───────────────────────────┐   debounced   ┌──────────────────────────┐
 │ zustand store             │ ───upsert───▶ │ shared_state table       │
 │  · session, accounts, carts│              │  one JSON row per slice  │
 │  · shared slices           │ ◀──realtime── │                          │
 │ saved to localStorage      │              │ brew(machine) function   │
 └───────────────────────────┘               └───────────▲──────────────┘
        ▲                                                 │ POST /rest/v1/rpc/brew
        │ automation.js: simulator, auto-logged batches   │
        └─────────────────────────────────────  buttons · emit-brews.mjs · a real gateway
```

- The app has **no server of its own**. Everything reads from and writes to one zustand store
  (`src/store/useStore.js`), which is saved to the browser's localStorage.
- With Supabase configured, the *shared slices* in the store are also mirrored to the
  `shared_state` table by `src/lib/sync.js`, so every browser sees the same data live.
  Accounts, organisations, carts and the signed-in user are **not** shared; they stay in each browser.
- `src/lib/automation.js` (started from `src/main.jsx`) turns the simulated machine feed into
  grounds-log batches and activity-feed lines, and runs the auto-simulate timer.

## Showpiece: the scroll landing
`/` is an Apple-style **scrubbed scrollytelling** narrative: *the life of a coffee ground*:
brew → collect → transform → impact, over a large faint `COFFEEBOT` wordmark. Pinned GSAP
ScrollTrigger timeline on desktop; degrades to clean stacked, reveal-on-view sections on mobile and
for `prefers-reduced-motion`. Below it: a "join us" block, a static row of Education Hub topics
(no sideways scrolling), and a public impact strip (grounds confirmed reused, people reached, family
members reached, active reuse partners), all read from the live store.

## Information architecture
| Audience | Routes |
|----------|--------|
| Public | `/` landing · `/about` (what CoffeeBot does, how grounds are reused, product showcase) · `/m/:machineId` (QR story per machine) · `/partner` (information for would-be partners) · `/contact` · `/signin` · `/signup` · `/play/:code` (student quiz or mission link, no account) |
| Teacher / corporate | `/app` dashboard · `/app/hub` Education Hub · `/app/learn` (paid courses) · `/app/cart` · `/app/play` (quizzes and missions: assign and track) · `/app/book` · `/app/bookings` |
| Reuse partner | `/partner-portal` partner dashboard (send a request, follow its status) |
| CoffeeBot staff | `/staff` overview · `/staff/plan` bookings & drying plan · `/staff/partners` · `/staff/grounds` grounds log · `/staff/reports` reports |

Unknown URLs redirect to `/`. Signed-in users are redirected away from `/signin` and `/signup`,
and anyone on the wrong side of the learner / partner / staff split is sent to their own dashboard
(`RequireRole` in `src/App.jsx`). The header navigation differs per audience (`src/components/layout/Header.jsx`).

### Key IA decisions (vs the prototype)
1. Role-aware landing: staff land on Overview, orgs on Dashboard, partners on their partner dashboard.
2. Products merged into **Learn & Do**: every activity (incl. the two wet ones) is now discoverable.
3. **About is a public explainer**. Impact figures are no longer on it; the only public numbers are the
   four on the landing page, and the per-machine story pages.
4. **Partner with us** (`/partner`) is a public information page for cafés, farms and makers (steps,
   benefits and partner testimonials shown as letters). A request can only be **sent from a signed-in
   partner account**, on `/partner-portal`.
5. The **closed loop is wired**: bookings, and quizzes and missions that students finish from a shared
   link, all feed `reach`, visible on both the org dashboard and staff Overview.
6. Booking gained a **review-before-confirm** step and cancel.
7. The **Education Hub** (`/app/hub`) teaches sustainability, the circular economy and the coffee
   lifecycle in four tabs, with a separate version for teachers and for workplaces. Content lives in
   `src/data/education.js`; it deliberately contains no statistics.
8. Staff get a **Grounds log** (log and edit batches, filter by status, dispatch to a booking, export
   CSV) and **Reports** (CSV downloads, a printable sustainability impact report, demo-data reset).
9. Teachers and corporate users **assign** quizzes and home missions to a class or team and share a
   link, instead of playing them themselves (see "Quizzes and missions" below).

## Structure
```
index.html           entry; preloads two of the self-hosted fonts
.env.example         template for the optional Supabase variables
vite.config.js       Vite config (React plugin only)
vercel.json          rewrite so direct links (QR codes, refreshes) reach the app
scripts/
  emit-brews.mjs     Node script that plays a machine against Supabase
supabase/
  schema.sql         shared_state table, open prototype policies, realtime, brew() function
public/
  fonts/             Poppins and Barlow, self-hosted woff2
  icons/ art/ products/   illustrations (PNG and WebP)
  coffeebot-mark.png favicon.svg icons.svg
src/
  main.jsx           mounts the app, starts sync and automation
  App.jsx            routes, lazy page loading, role guards
  data/seed.js       products, activities, weeks, quizzes, missions, stories, machines, batches, seed state
  data/orgs.js       seeded organisations, demo accounts, roles, email-domain rules, password rules
  data/pricing.js    course prices (placeholders) and per-audience course framing
  data/company.js    company contact details
  data/education.js  Education Hub learning content (teacher and corporate versions)
  data/art.jsx       SVG artwork (cup, grounds pile, beans, story pictures)
  data/icons.jsx     illustrated PNG icons and product drawings, with SVG fallbacks
  data/hubArt.js     Education Hub illustrations
  lib/calc.js        weather → drying-capacity, batch, usage and Circularity maths (shared by org + staff)
  lib/sync.js        store <-> Supabase mirror, and the brew() client
  lib/backend.js     Supabase client handle (loaded on demand) and the local/supabase switch
  lib/automation.js  auto-simulate timer; machine brews → batches and feed lines
  lib/photo.js       shrinks and caps session photos
  lib/download.js    client-side CSV and text-file downloads
  store/useStore.js  zustand store + all mutations
  styles/            tokens.css (colours, type, spacing), base.css, components.css, fonts.css, palette.js
  components/hero/   ScrollJourney (landing showpiece) + GroundsShowcase (About)
  components/layout/ header (role-aware nav, cart) + footer (shows the data mode)
  components/ui/     Page transition, Counter, ToastHost, charts, ClosedLoop, Marquee, Confetti, Icon,
                     LiveFeed (staff machine panel), CircularityFunnel, QuizPlayer
  pages/public|org|partner|staff/
```

## Shared data (Supabase)
Operational data: batches, bookings, partners, requests, inbox, feed, reach, course orders,
assigned quizzes and missions, and the machine counters, lives in the zustand store and is mirrored
through `src/lib/sync.js`. The slices that are shared are listed in `SHARED_KEYS` in that file.

- **No configuration**: everything persists in this browser's localStorage. The footer shows
  *This browser only*.
- **With Supabase**: every browser reads and writes the same slices and sees changes live, so a
  booking on one laptop appears on the staff Overview on another within a second. The footer
  shows *Live · shared data*. While connecting it shows *Connecting…*, and if the connection or a
  write fails it shows *Sync error · this browser only* (hover it for the error text).

How the sync behaves:
- One JSON row per slice in `shared_state (key, value, updated_at)`. A change to a slice is sent as a
  whole-row upsert about 200 ms later. **Last write wins per slice.**
- On first load the remote copy wins, except for slices you edited before the load finished.
  The first browser to open an empty table seeds it from `src/data/seed.js`.
- Remote changes arrive over a realtime channel and are applied to the store without being echoed back.
- The machine counters (`live_m1` to `live_m4`) are the exception: they are only changed through the
  `brew` database function, never written by the browser directly.

Setup (about five minutes):
1. Create a free project at supabase.com.
2. SQL editor → paste and run the whole of `supabase/schema.sql` (the `shared_state` table, open
   prototype policies, realtime, and the `brew` function). It is safe to run again after updates.
3. Create a file named `.env.local` in the project root with the project URL and anon key from
   Project Settings → API (no quotes, no spaces after the `=`), then restart `npm run dev`:
   ```
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```
   (`.env.example` in the repo is a template: `cp .env.example .env.local`.)
4. The first browser to open the app seeds the table from `src/data/seed.js`. Staff can put
   everything back to the seed figures with **Reports → Demo data → Reset**.

### Joining an existing Supabase project (teammates)
The project owner has already run `supabase/schema.sql`, so teammates only need the keys:

1. Check out the branch and run `npm install`.
2. Create `.env.local` in the project root containing the two lines shown above.
3. Get both values from the project owner, either privately by message or by being invited
   under Project Settings → Team, after which they are under Project Settings → API ("Project
   URL" and the "anon public" key).
4. Stop the dev server (Ctrl+C) and run `npm run dev` again. Vite only reads `.env.local` on start.
5. Check the footer of any page. It should say **Live · shared data**. If it says **This
   browser only**, the file is missing, misnamed, or the server was not restarted.

Never commit `.env.local` (`.gitignore` already excludes it). If someone skips this, the app
still runs, but they only see their own browser's data, so bookings and brews will not appear
on anyone else's screen, and a simulation they start never reaches the shared database. The anon
key is meant to ship to browsers, but the prototype policies let anyone holding it read and write
every row, so share it only with the team and rotate it (Project Settings → API) after the demo.
A brand-new Supabase project needs `supabase/schema.sql` run once in its SQL editor.

### Deploying (Vercel)
The live site runs on Vercel at **https://coffeebot-grounds-up.vercel.app**, with its data in Supabase.
It is a static Vite build, so any static host works. These steps use Vercel.

**Before you start**, have the Supabase project ready: `supabase/schema.sql` run once in its SQL
editor, and the project URL and "anon public" key from Project Settings → API.

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 18 or newer |

| Environment variable | Value | Environments |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | Production, Preview |
| `VITE_SUPABASE_ANON_KEY` | the "anon public" key | Production, Preview |

**Option A: from the Vercel website**
1. Vercel → Add New → Project → Import the GitHub repository (fork it first if it belongs to
   another account, so your Vercel can see it).
2. Leave the settings above as detected, open **Environment Variables**, add the two rows, then **Deploy**.
3. Settings → Git → set the **Production Branch** to `main`. Every push to `main` then redeploys.

**Option B: from the command line**
```bash
npm install --global vercel@latest
vercel login
vercel link                       # create or choose the project
vercel env add VITE_SUPABASE_URL --environment production
vercel env add VITE_SUPABASE_ANON_KEY --environment production --type config
vercel deploy --prod
```
Vercel asks you to choose a type for the anon key because the `VITE_` prefix exposes it to the
browser. `config` is correct: the key is meant to reach the browser (see the security note above).
Repeat the two `env add` lines with `--environment preview` if you want preview deployments connected too.

**Check it worked** (do all three):
1. The footer of any page says **Live · shared data**. If it says *This browser only*, the variables
   are missing or were added after the last build: add them, then redeploy.
2. Open `/m/m1` directly in a new tab. It must show the Hartwell L3 pantry page, not a 404. This proves
   the `vercel.json` rewrite is active.
3. Sign in as staff, open Overview and press **Brew a cup**. A second browser on the same site shows the
   counter move without a refresh.

**Redeploying.** Vite bakes the two variables into the bundle at build time, so changing a variable does
nothing until the next deployment. A site connected to GitHub redeploys on every push to `main`. A site
deployed from the command line redeploys only when you run `vercel deploy --prod` again.

**Printing QR codes.** The booth card encodes the address of the page it was opened on. Open the card on
the production address before printing, never on `localhost` or a preview link.

**Other hosts** (Netlify, Cloudflare Pages, GitHub Pages): run `npm run build`, publish `dist/`, set the same
two variables at build time, and add a rule that serves `index.html` for every path, as `vercel.json` does
here. Without that rule a QR scan or a refresh on any page except the landing page returns 404.

### Simulated IoT feed
Four simulated machines live on the staff Overview under **Live from the machines**. A brew
can come from three places, and every open dashboard updates within about a second:

- the **Brew a cup** button on each machine card, or the **Start simulation** button;
- `node scripts/emit-brews.mjs [--every 3] [--count 20] [--machine m2]`, which plays a
  machine from outside the browser using the values in `.env.local`;
- anything else that calls the `brew(machine)` database function
  (`POST /rest/v1/rpc/brew` with `{"machine": "m1"}`), which is what a real machine's gateway would do.

The function locks the machine's row, adds one and returns the new value in a single
transaction, so reports that arrive at the same instant all count. Brews feed cups served and
grounds generated, so the Circularity rate's denominator moves live. The counters reset with
the rest of the demo data. Machines are listed in `src/data/seed.js` (`MACHINES`).

**Start simulation** makes the browser brew a cup on a random machine every 250 ms (about four a
second, `SIM_EVERY_MS` in `src/lib/automation.js`). The timer lives at app level, so it keeps running
while you move between pages, until you press **Simulation running** to stop it or close or refresh
the tab. The on/off state is **per browser** and is not shared: someone else's simulation updates
your numbers but your button will not show it, and only they can stop it. Press it off before using
Reset, or the counters start climbing again.

### What a brew sets off
`src/lib/automation.js` watches the machine counters, in every open browser:

- every **25 cups** from a machine (`AUTO_BATCH_CUPS`, about 0.5 kg) a new grounds-log batch is
  logged for that machine's site, status *Collected*, use *Unassigned*, with the note "Auto-logged
  from the simulated machine feed". It then shows in the staff Grounds log, on that machine's story
  page and in the Circularity funnel's *Collected* stage;
- every **10 cups** (`FEED_EVERY_CUPS`) a line is added to the activity feed, and each auto-logged
  batch adds one too. The feed is capped at 40 lines;
- confirmed reuse is **never** touched by a brew: a batch only becomes *Reused* when a teacher logs
  a session.

Each addition carries a fixed key (machine and cup count), so browsers that are open at the same
time skip it if it is already there. It only runs once the data has loaded (`local` or `live`
status), so it cannot overwrite shared data with a stale local copy. The baseline figures are never
changed: **Reports → Demo data → Reset** puts the seed batches, feed, bookings, reach and everything
else back, and sets the machine counters to 0. Brews arriving from `emit-brews.mjs` also trigger this,
but only while some browser has the app open.

### QR story page per machine
Every machine has a public page, `/m/<machine id>` (for example `/m/m1`), meant to be reached by
scanning a code stuck on the machine. It shows that machine's live brews, the grounds they left
behind, every batch collected from it with its status, where those batches went, and any logged
session with the teacher's photo. Landfill and unassigned batches stay out of the public
pathway chart but disposed kg is still stated. The page ends with a **booth card**: a QR code
for its own address plus a one-line pitch; **Print** gives a card with nothing else on the page.
Machines are tied to grounds-log entries through `source` in `MACHINES` (`src/data/seed.js`).

The public **confirmed reused** figure on the landing page and scroll hero is
`batchTotals(batches).reused`: the grounds log's own number. There is no separate headline figure.

Design notes: one JSON row per slice, last write wins per slice (except the machine counters,
which only change through `brew`), and the anon key can write everything. That is deliberate for a
booth demo and must change (per-row tables, role policies, server-side auth) before any real
deployment. Accounts and organisations stay in the browser because the table is publicly readable.
For the same reason, the **first names or nicknames students type** when finishing a quiz or mission
are stored in the shared `assignments` row, which anyone with the key can read.

## Quizzes and missions
Teachers and corporate users do not play quizzes themselves. On `/app/play` they:

1. pick one of the four quizzes or three home missions in `src/data/seed.js` (a quiz can be
   previewed first, which records nothing);
2. press **Assign**, name the class or team, and get a link of the form `/play/<code>`;
3. share the link. Students open it on any device with **no account**, type a first name or
   nickname, and play. Finished quizzes record the score; missions are marked done with one button;
4. see who has finished under **Assigned**, and close or reopen the link at any time.

Each finished quiz adds one person to `reach.people` and one to `quizzesDone`; each finished mission adds one
family to `reach.families` and one to `missionsCompleted`, and assigning a mission adds one to
`missionsAssigned`. Those are what the staff Overview, Reports and the landing page read. The
teacher dashboard counts only its own organisation's assignments. The code is a random six-character
string, so a link is only as private as the people it is shared with.

## Green computing
The question was whether the platform itself is lean enough to preach circularity. The table below
was measured with Lighthouse 12 (performance category, simulated mobile, `vite preview` on
localhost) and `vite build` output on 27 Oct 2026, **before the later design refresh**. It has not
been re-run since.

| | Before | After |
|---|---|---|
| JavaScript on first load, landing page (minified) | 866 kB in one file | 351 kB (phone) · 422 kB (desktop) |
| Same, gzipped over the wire | 272 kB | 116 kB (phone) · 144 kB (desktop) |
| Lighthouse performance, landing page | 84 | 96 |
| Largest contentful paint, landing page | 3.9 s | 2.4 s |
| Installed dependencies | three.js, react-three-fiber and shadergradient (34 MB) | removed |

For reference, a `vite build` on 8 Nov 2026 produces a main app chunk of 349 kB (116 kB gzipped), a
Supabase chunk of 228 kB (59 kB gzipped) that loads after first paint, and a GSAP chunk pair of about
115 kB (71 kB + 44 kB) that is fetched only on desktop. Every page has its own chunk. Lighthouse
scores have not been re-measured.

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
6. **Fonts served from our own origin.** Poppins (headings, weights 600, 700, 800) and Barlow
   (body text, weights 400, 600, 700) ship as six latin-only woff2 files, about 71 kB together, in
   `public/fonts` (`src/styles/fonts.css`); `index.html` preloads Barlow 400 and Poppins 700. That
   removes third-party font hosts and a render-blocking stylesheet from every page load. The pairing
   matches CoffeeBot's own site.
7. **Session photos capped.** A teacher's evidence photo is shrunk on the device and re-shrunk
   until it is under 60 KB (`src/lib/photo.js`), and the store refuses anything larger, so one
   logged session cannot add megabytes to the shared bookings row every browser syncs.

Still on the list: an image CDN or object storage for photos if the platform ever holds more
than a few hundred logged sessions, since they currently live inline in the bookings row.

## What is functional and what is conceptual
For anyone asking "how much of this actually works":

| Area | Status | Notes |
|---|---|---|
| Grounds log, batch statuses, pathways, Circularity rate | **Functional** | Real ledger in the shared store; every public figure derives from it |
| Dispatch a batch to a booked session, teacher logs outcome with photo | **Functional** | Reuse is only confirmed by the teacher's log; residual grounds come back as a batch |
| Shared live state across browsers (Supabase) | **Functional** | One JSON row per slice, realtime; open prototype policies |
| Machine brew feed | **Simulated** | Buttons, the simulator and `scripts/emit-brews.mjs` call the same atomic `brew` function a real gateway would |
| Auto-logged batches and feed lines from brews | **Simulated** | Created from cup counts, not from a scale or a bin sensor; grounds generated is cups × 20 g |
| QR story page and printable booth card | **Functional** | Reads the same store; QR encodes the page's own address |
| Bookings, cart, partner requests and approvals, inbox, feed | **Functional** | Stored in the shared state |
| Quizzes and missions assigned by link, student results | **Functional** | Stored in the shared `assignments` slice; no student accounts, so names are self-typed |
| Course payment | **Conceptual** | Confirming an order unlocks the course; nothing is charged, prices are placeholders |
| Accounts and roles | **Prototype** | Browser-only, hashed passwords, no server check |
| Partner-only requests | **Prototype** | Enforced in the browser only; the database does not check it (see `addPartnerRequest`) |
| Weather-driven drying capacity | **Seeded** | The four-week outlook in `WEEKS` (19 Oct to 9 Nov 2026) is hand-entered, not fetched from a forecast, and about 80 kg collected a week is a fixed assumption (`COLLECTED`) |
| Reach figures (people, families) | **Seeded + live** | Start from seed values (1,420 people, 310 families), then move with real bookings and finished quizzes and missions |
| Seed data | **Placeholder** | The 8 batches, bookings, partners, requests, weekly cup counts, feed and inbox are invented starting figures |
| Partner testimonials | **Placeholder** | Quotes are written for layout and labelled "Placeholder quote" on the page |
| Education Hub lesson plans and copy | **Draft** | Structure works; the words are draft copy awaiting the owner's review |

## Accounts and routing
There is no backend for accounts yet. Organisations and accounts are seeded in `src/data/orgs.js` and
kept in the browser's localStorage (`coffeebot-auth-v1`) along with the signed-in user, carts and
purchases; operational data (bookings, batches, orders, assignments) lives in the shared store
described above. Passwords are salted and SHA-256 hashed in the browser (a simple fallback hash is
used on non-secure origins such as `http://192.168.x.x`), but this is **not** real security: move
accounts and the role check to a server before launch.

- Organisation type decides the role: `staff` → `/staff`, `school` → teacher and `company` → corporate (both `/app`), `partner` → `/partner-portal`.
- Sign-up creates an account instantly. A registered email domain joins that organisation; a new
  domain registers a new one. On the sign-up form you choose **A school or workplace** (education
  domains become schools, the rest companies) or **A reuse partner**.
- Staff accounts cannot be self-created, and personal email domains are refused.
- Passwords need 8+ characters, a number and a special character.
- The session is always rebuilt from the stored account and its organisation, so editing the stored
  user in localStorage cannot switch dashboards.
- Company contact details live in `src/data/company.js`.

## Paid courses and cart
Courses (`/app/learn`) are paid and bought once per organisation. Add to Cart → `/app/cart` →
Confirm order. **No payment provider is connected**: confirming records the order and unlocks the
lesson plan and session booking for that course, and nothing is charged. Prices live in
`src/data/pricing.js` and are **placeholders**: replace them and set `PRICES_ARE_PLACEHOLDERS`
to `false`.

## Demo accounts
Opened from the buttons on the log-in page (no password):
- Teacher: `aisha.rahman@greenridge.edu.sg`
- Workplace: `daniel.tan@hartwell.com.sg`
- CoffeeBot staff: `meiling@coffeebot.com`

There is no demo partner account. To see the partner dashboard, choose **Sign up → A reuse partner**
and use any non-personal email. An email on `greenleafcompost.sg` joins the seeded *Greenleaf Compost*
organisation.

## Known loose ends
- `visibility` (and `VISIBILITY_ITEMS`, `setVisibility`) is still in the store and shared data, but
  nothing reads or sets it any more: the public About page no longer shows figures and Reports has no
  toggles. A line at the bottom of the staff Overview still mentions choosing what is shown in Reports.
- `coffeebot-logo.png` sits in the project root and is not used by the app.
