# CoffeeBot · Grounds Up

A digital **Circular Sustainability Hub** for CoffeeBot — one platform, two views,
decided by sign-in email domain:

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
| Public | `/` landing · `/about` (live metrics) · `/partner` · `/contact` · `/signin` |
| School / workplace | `/app` dashboard · `/app/learn` · `/app/play` · `/app/book` · `/app/bookings` |
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

## Demo accounts
- Teacher — `aisha.rahman@greenridge.edu.sg`
- Workplace — `daniel.tan@hartwell.com.sg`
- CoffeeBot staff — `meiling@coffeebot.com`
