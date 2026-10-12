import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { SEED_ACCOUNTS, ROLE_LABEL } from '../../data/orgs';
import Icon from '../../components/ui/Icon';
import './signin.css';

const NEXT = {
  signup: ['/signup', 'Sign up'],
  contact: ['/contact', 'Contact us'],
};

export default function SignIn() {
  const signIn = useStore((s) => s.signIn);
  const signInDemo = useStore((s) => s.signInDemo);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  const finish = (res) => {
    if (!res.ok) { setErr(res); return; }
    navigate(res.home);
  };
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    finish(await signIn(email, password));
    setBusy(false);
  };

  return (
    <div className="signin-wrap">
      <div className="signin-bg" aria-hidden="true" />
      <motion.div
        className="panel glass signin-card"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <img className="mark" src="/coffeebot-mark.png" alt="CoffeeBot" />
        <div>
          <h1>Log in to Grounds Up</h1>
          <p className="muted small" style={{ marginTop: 6 }}>
            One log-in for CoffeeBot staff, teachers and workplaces. Your account decides which dashboard you see.
          </p>
        </div>

        <form className="stack" style={{ gap: 'var(--s3)' }} noValidate onSubmit={submit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="name@school.edu.sg" autoComplete="email"
              value={email} onChange={(e) => { setEmail(e.target.value); setErr(null); }} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" autoComplete="current-password"
              value={password} onChange={(e) => { setPassword(e.target.value); setErr(null); }} />
          </div>
          <button className="btn block" type="submit" disabled={busy}>Log in</button>
          {err && (
            <div className="msg bad" role="alert">
              {err.error}{' '}
              {NEXT[err.next] && <Link to={NEXT[err.next][0]}>{NEXT[err.next][1]}</Link>}
            </div>
          )}
        </form>

        <p className="signin-note">New here? <Link to="/signup">Sign up</Link></p>

        <div className="signin-divider">or try a demo account</div>
        <div className="signin-demos">
          {SEED_ACCOUNTS.map((a) => (
            <button key={a.email} className="demo-btn" onClick={() => finish(signInDemo(a.email))}>
              <span><span className="who">{ROLE_LABEL[a.role]}</span> · {a.email}</span>
              <span className="demo-arrow"><Icon name="arrowRight" size={16} /></span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
