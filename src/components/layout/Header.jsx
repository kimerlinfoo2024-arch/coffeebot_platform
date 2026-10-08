import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const PUBLIC_NAV = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/partner', 'Partner with us'],
  ['/contact', 'Contact'],
];
const ORG_NAV = [
  ['/app', 'Dashboard'],
  ['/app/learn', 'Learn & Do'],
  ['/app/play', 'Quizzes & Missions'],
  ['/app/bookings', 'My Bookings'],
];
const STAFF_NAV = [
  ['/staff', 'Overview'],
  ['/staff/plan', 'Drying Plan'],
  ['/staff/partners', 'Partners'],
];

export default function Header() {
  const user = useStore((s) => s.user);
  const signOut = useStore((s) => s.signOut);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const nav = !user ? PUBLIC_NAV : user.staff ? STAFF_NAV : ORG_NAV;
  const home = !user ? '/' : user.staff ? '/staff' : '/app';

  return (
    <header className={`hdr ${scrolled ? 'scrolled' : ''}`}>
      <div className="hdr-in">
        <Link className="logo" to={home} aria-label="CoffeeBot home">
          <img src="/coffeebot-mark.png" alt="" />
          <span>CoffeeBot</span>
        </Link>

        <nav className="nav" aria-label="Main">
          {nav.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/' || to === '/app' || to === '/staff'}
              className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hdr-right">
          {!user ? (
            <button className="btn sm" onClick={() => navigate('/signin')}>Sign in</button>
          ) : (
            <div className="prof" ref={menuRef}>
              <button aria-haspopup="true" aria-expanded={open} aria-label="Profile"
                onClick={() => setOpen((o) => !o)}>{user.name.charAt(0)}</button>
              {open && (
                <div className="menu">
                  <b>{user.name}</b>
                  <span className="small muted">{user.email}</span>
                  <span className="small">{user.org}</span>
                  <span className={`role-pill ${user.staff ? 'rp-staff' : 'rp-org'}`}>
                    {user.staff ? 'CoffeeBot staff' : 'School or workplace'}
                  </span>
                  <button className="btn ghost sm" onClick={() => { signOut(); setOpen(false); navigate('/'); }}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
