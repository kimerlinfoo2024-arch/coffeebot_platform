import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { ROLE_HOME } from './data/orgs';

import Layout from './components/layout/Layout';
import ToastHost from './components/ui/ToastHost';

import Landing from './pages/public/Landing';

/* Every page except the landing page loads on demand, so a visitor (or a phone
   scanning a machine's QR code) downloads only the code for the page they open. */
const lazyPage = (load) => lazy(load);
const About = lazyPage(() => import('./pages/public/About'));
const Partner = lazyPage(() => import('./pages/public/Partner'));
const Contact = lazyPage(() => import('./pages/public/Contact'));
const SignIn = lazyPage(() => import('./pages/public/SignIn'));
const SignUp = lazyPage(() => import('./pages/public/SignUp'));
const MachineStory = lazyPage(() => import('./pages/public/MachineStory'));

const Dashboard = lazyPage(() => import('./pages/org/Dashboard'));
const EducationHub = lazyPage(() => import('./pages/org/EducationHub'));
const LearnDo = lazyPage(() => import('./pages/org/LearnDo'));
const Play = lazyPage(() => import('./pages/org/Play'));
const Book = lazyPage(() => import('./pages/org/Book'));
const Cart = lazyPage(() => import('./pages/org/Cart'));
const MyBookings = lazyPage(() => import('./pages/org/MyBookings'));

const Overview = lazyPage(() => import('./pages/staff/Overview'));
const DryingPlan = lazyPage(() => import('./pages/staff/DryingPlan'));
const Partners = lazyPage(() => import('./pages/staff/Partners'));
const Grounds = lazyPage(() => import('./pages/staff/Grounds'));
const Reports = lazyPage(() => import('./pages/staff/Reports'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/** Route guard. `need` is 'staff' or 'learner' (teacher or corporate).
    Anyone on the wrong side is sent to their own dashboard. */
function RequireRole({ need, children }) {
  const user = useStore((s) => s.user);
  if (!user) {
    // after signing out, this page is only still mounted for its exit
    // transition — the browser has already moved on, so don't redirect
    const stillHere = /^\/(app|staff)(\/|$)/.test(window.location.pathname);
    return stillHere ? <Navigate to="/signin" replace /> : null;
  }
  const home = ROLE_HOME[user.role];
  if (!home) return <Navigate to="/signin" replace />;
  const allowed = need === 'staff' ? user.role === 'staff' : user.role === 'teacher' || user.role === 'corporate';
  if (!allowed) return <Navigate to={home} replace />;
  return children;
}

/** Log-in and sign-up are for visitors; signed-in users go to their dashboard. */
function GuestOnly({ children }) {
  const user = useStore((s) => s.user);
  if (user && ROLE_HOME[user.role]) return <Navigate to={ROLE_HOME[user.role]} replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <Layout>
        <AnimatePresence mode="wait">
          {/* the placeholder keeps the footer in place while a page's chunk loads (no layout shift) */}
          <Suspense fallback={<div style={{ minHeight: '80vh' }} aria-hidden="true" />}>
          <Routes location={location} key={location.pathname}>
            {/* public */}
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signin" element={<GuestOnly><SignIn /></GuestOnly>} />
            <Route path="/signup" element={<GuestOnly><SignUp /></GuestOnly>} />
            <Route path="/m/:machineId" element={<MachineStory />} />  {/* QR on the machine opens this */}

            {/* learning partners: teachers and corporate users */}
            <Route path="/app" element={<RequireRole need="learner"><Dashboard /></RequireRole>} />
            <Route path="/app/hub" element={<RequireRole need="learner"><EducationHub /></RequireRole>} />
            <Route path="/app/learn" element={<RequireRole need="learner"><LearnDo /></RequireRole>} />
            <Route path="/app/play" element={<RequireRole need="learner"><Play /></RequireRole>} />
            <Route path="/app/book" element={<RequireRole need="learner"><Book /></RequireRole>} />
            <Route path="/app/cart" element={<RequireRole need="learner"><Cart /></RequireRole>} />
            <Route path="/app/bookings" element={<RequireRole need="learner"><MyBookings /></RequireRole>} />

            {/* staff */}
            <Route path="/staff" element={<RequireRole need="staff"><Overview /></RequireRole>} />
            <Route path="/staff/plan" element={<RequireRole need="staff"><DryingPlan /></RequireRole>} />
            <Route path="/staff/partners" element={<RequireRole need="staff"><Partners /></RequireRole>} />
            <Route path="/staff/grounds" element={<RequireRole need="staff"><Grounds /></RequireRole>} />
            <Route path="/staff/reports" element={<RequireRole need="staff"><Reports /></RequireRole>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </AnimatePresence>
      </Layout>
      <ToastHost />
    </>
  );
}
