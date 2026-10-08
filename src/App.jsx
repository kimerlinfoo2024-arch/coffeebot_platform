import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';

import Layout from './components/layout/Layout';
import ToastHost from './components/ui/ToastHost';

import Landing from './pages/public/Landing';
import About from './pages/public/About';
import Partner from './pages/public/Partner';
import Contact from './pages/public/Contact';
import SignIn from './pages/public/SignIn';

import Dashboard from './pages/org/Dashboard';
import LearnDo from './pages/org/LearnDo';
import Play from './pages/org/Play';
import Book from './pages/org/Book';
import MyBookings from './pages/org/MyBookings';

import Overview from './pages/staff/Overview';
import DryingPlan from './pages/staff/DryingPlan';
import Partners from './pages/staff/Partners';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function RequireRole({ need, children }) {
  const user = useStore((s) => s.user);
  if (!user) return <Navigate to="/signin" replace />;
  if (need === 'staff' && !user.staff) return <Navigate to="/app" replace />;
  if (need === 'org' && user.staff) return <Navigate to="/staff" replace />;
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
            <Route path="/signin" element={<SignIn />} />

            {/* school / workplace */}
            <Route path="/app" element={<RequireRole need="org"><Dashboard /></RequireRole>} />
            <Route path="/app/learn" element={<RequireRole need="org"><LearnDo /></RequireRole>} />
            <Route path="/app/play" element={<RequireRole need="org"><Play /></RequireRole>} />
            <Route path="/app/book" element={<RequireRole need="org"><Book /></RequireRole>} />
            <Route path="/app/bookings" element={<RequireRole need="org"><MyBookings /></RequireRole>} />

            {/* staff */}
            <Route path="/staff" element={<RequireRole need="staff"><Overview /></RequireRole>} />
            <Route path="/staff/plan" element={<RequireRole need="staff"><DryingPlan /></RequireRole>} />
            <Route path="/staff/partners" element={<RequireRole need="staff"><Partners /></RequireRole>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Layout>
      <ToastHost />
    </>
  );
}
