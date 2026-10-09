import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import Icon from '../../components/ui/Icon';
import './signin.css';

const DEMOS = [
  ['Teacher', 'aisha.rahman@greenridge.edu.sg'],
  ['Workplace', 'daniel.tan@hartwell.com.sg'],
  ['CoffeeBot staff', 'meiling@coffeebot.com'],
];

export default function SignIn() {
  const signIn = useStore((s) => s.signIn);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');

  const submit = (value) => {
    const res = signIn(value);
    if (!res.ok) { setErr(res.error); return; }
    navigate(res.staff ? '/staff' : '/app');
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
          <h1>Sign in to Grounds Up</h1>
          <p className="muted small" style={{ marginTop: 6 }}>
            One platform for CoffeeBot staff and the schools and workplaces they work with. Your email decides your view — no password needed.
          </p>
        </div>

        <form className="stack" style={{ gap: 'var(--s3)' }} noValidate onSubmit={(e) => { e.preventDefault(); submit(email); }}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="name@school.edu.sg" autoComplete="email"
              value={email} onChange={(e) => { setEmail(e.target.value); setErr(''); }} />
          </div>
          <button className="btn block" type="submit">Continue</button>
          {err && <div className="msg bad">{err}</div>}
        </form>

        <div className="signin-divider">or try a demo account</div>
        <div className="signin-demos">
          {DEMOS.map(([label, mail]) => (
            <button key={mail} className="demo-btn" onClick={() => { setEmail(mail); submit(mail); }}>
              <span><span className="who">{label}</span> · {mail}</span>
              <span className="demo-arrow"><Icon name="arrowRight" size={16} /></span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
