import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { ROLE_HOME } from './data/orgs';

import Layout from './components/layout/Layout';
import ToastHost from './components/ui/ToastHost';

import Landing from './pages/public/Landing';
import About from './pages/public/About';
import Partner from './pages/public/Partner';
import Contact from './pages/public/Contact';
import SignIn from './pages/public/SignIn';
import SignUp from './pages/public/SignUp';
import MachineStory from './pages/public/MachineStory';

import Dashboard from './pages/org/Dashboard';
import EducationHub from './pages/org/EducationHub';
import LearnDo from './pages/org/LearnDo';
import Play from './pages/org/Play';
import Book from './pages/org/Book';
import Cart from './pages/org/Cart';
import MyBookings from './pages/org/MyBookings';

import Overview from './pages/staff/Overview';
import DryingPlan from './pages/staff/DryingPlan';
import Partners from './pages/staff/Partners';
import Grounds from './pages/staff/Grounds';
import Reports from './pages/staff/Reports';

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
        </AnimatePresence>
      </Layout>
      <ToastHost />
    </>
  );
}
