import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ROLE_HOME, ROLE_LABEL } from '../../data/orgs';
import Icon from '../ui/Icon';
import '../../pages/org/courses.css';

const PUBLIC_NAV = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/partner', 'Partner with us'],
  ['/contact', 'Contact'],
];
const ORG_NAV = [
  ['/app', 'Dashboard'],
  ['/app/hub', 'Education Hub'],
  ['/app/learn', 'Courses'],
  ['/app/play', 'Quizzes & Missions'],
  ['/app/bookings', 'My Bookings'],
];
const STAFF_NAV = [
  ['/staff', 'Overview'],
  ['/staff/grounds', 'Grounds Log'],
  ['/staff/plan', 'Drying Plan'],
  ['/staff/partners', 'Partners'],
  ['/staff/reports', 'Reports'],
];

export default function Header() {
  const user = useStore((s) => s.user);
  const signOut = useStore((s) => s.signOut);
  const cartCount = useStore((s) => (s.user && !s.user.staff ? (s.carts[s.user.email] || []).length : 0));
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
  const home = !user ? '/' : ROLE_HOME[user.role];

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
            <>
              <Link className="btn ghost sm" to="/signin">Log in</Link>
              <Link className="btn sm" to="/signup">Sign up</Link>
            </>
          ) : (
            <>
            {!user.staff && (
              <Link className="cart-link" to="/app/cart" aria-label={`Cart, ${cartCount} course${cartCount === 1 ? '' : 's'}`}>
                <Icon name="cart" size={18} />
                {cartCount > 0 && <span className="count" aria-hidden="true">{cartCount}</span>}
              </Link>
            )}
            <div className="prof" ref={menuRef}>
              <button aria-haspopup="true" aria-expanded={open} aria-label="Profile"
                onClick={() => setOpen((o) => !o)}>{user.name.charAt(0)}</button>
              {open && (
                <div className="menu">
                  <b>{user.name}</b>
                  <span className="small muted">{user.email}</span>
                  <span className="small">{user.org}</span>
                  <span className={`role-pill ${user.staff ? 'rp-staff' : 'rp-org'}`}>
                    {ROLE_LABEL[user.role]}
                  </span>
                  <button className="btn ghost sm" onClick={() => { setOpen(false); navigate('/'); signOut(); }}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
