import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { PASSWORD_RULES, ROLE_BY_ORG_TYPE, ROLE_LABEL, parseEmail, findOrgByDomain } from '../../data/orgs';
import Icon from '../../components/ui/Icon';
import './signin.css';

const NEXT = {
  signin: ['/signin', 'Log in'],
  contact: ['/contact', 'Contact us'],
};

export default function SignUp() {
  const signUp = useStore((s) => s.signUp);
  const orgs = useStore((s) => s.orgs);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', orgName: '', email: '', password: '', confirm: '' });
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErr(null); };

  // a registered domain already tells us the organisation, so we don't ask for it
  const parsed = parseEmail(form.email);
  const knownOrg = parsed ? findOrgByDomain(orgs, parsed.domain) : null;
  const joinable = knownOrg && knownOrg.type !== 'staff';

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setErr({ error: 'The two passwords do not match.' }); return; }
    setBusy(true);
    const res = await signUp(form);
    setBusy(false);
    if (!res.ok) { setErr(res); return; }
    navigate(res.home);
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
          <h1>Sign up for Grounds Up</h1>
          <p className="muted small" style={{ marginTop: 6 }}>
            For teachers and workplace teams. Use your school or work email — it decides which learning hub you get.
          </p>
        </div>

        <form className="stack" style={{ gap: 'var(--s3)' }} noValidate onSubmit={submit}>
          <div className="field">
            <label htmlFor="suName">Your name</label>
            <input type="text" id="suName" autoComplete="given-name" value={form.name} onChange={set('name')} />
          </div>
          <div className="field">
            <label htmlFor="suEmail">School or work email</label>
            <input type="email" id="suEmail" placeholder="name@school.edu.sg" autoComplete="email"
              value={form.email} onChange={set('email')} />
          </div>
          {joinable ? (
            <div className="signin-org">
              <Icon name="check" size={16} strokeWidth={3} />
              <span>You'll join <b>{knownOrg.name}</b> as a {ROLE_LABEL[ROLE_BY_ORG_TYPE[knownOrg.type]].toLowerCase()} user.</span>
            </div>
          ) : (
            <div className="field">
              <label htmlFor="suOrg">School or company name</label>
              <input type="text" id="suOrg" autoComplete="organization" value={form.orgName} onChange={set('orgName')} />
            </div>
          )}
          <div className="field">
            <label htmlFor="suPass">Password</label>
            <input type="password" id="suPass" autoComplete="new-password" aria-describedby="suRules"
              value={form.password} onChange={set('password')} />
            <ul className="pw-rules" id="suRules">
              {PASSWORD_RULES.map(([label, test]) => {
                const ok = test(form.password);
                return (
                  <li key={label} className={ok ? 'ok' : ''}>
                    <Icon name={ok ? 'check' : 'x'} size={13} strokeWidth={3} />
                    {label}<span className="sr-only">{ok ? ' — met' : ' — not met yet'}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="field">
            <label htmlFor="suConfirm">Confirm password</label>
            <input type="password" id="suConfirm" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} />
          </div>
          <button className="btn block" type="submit" disabled={busy}>Create account</button>
          {err && (
            <div className="msg bad" role="alert">
              {err.error}{' '}
              {NEXT[err.next] && <Link to={NEXT[err.next][0]}>{NEXT[err.next][1]}</Link>}
            </div>
          )}
        </form>

        <p className="signin-note">Already have an account? <Link to="/signin">Log in</Link></p>
      </motion.div>
    </div>
  );
}
