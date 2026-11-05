import { useState } from 'react';
import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import { useStore } from '../../store/useStore';
import '../public/partner.css';

const reveal = {
  initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' }, transition: { duration: 0.4 },
};

const KINDS = ['Compost or gardening', 'Skincare or soap', 'Candles or crafts', 'Mushroom growing', 'Other'];

/** Reuse partners' home: send a request to CoffeeBot and follow what happened to it.
    This is the only place a partner request can be sent from. */
export default function PartnerHome() {
  const user = useStore((s) => s.user);
  const addPartnerRequest = useStore((s) => s.addPartnerRequest);
  // seed partners predate accounts, so match by organisation name as well as id
  const mine = (r) => r.orgId === user.orgId || r.name === user.org;
  const pending = useStore((s) => s.requests).filter(mine);
  const active = useStore((s) => s.partners).filter(mine);

  const [form, setForm] = useState({ kind: KINDS[0], wet: 'wet', cap: 10, note: '' });
  const [msg, setMsg] = useState({ ok: false, text: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const cap = Number(form.cap);
    if (!(cap > 0)) return setMsg({ ok: false, text: 'Enter how many kg you could take each week.' });
    const sent = addPartnerRequest({ kind: form.kind, cap, wet: form.wet === 'wet', note: form.note.trim() });
    if (!sent) return setMsg({ ok: false, text: 'Only partner accounts can send requests.' });
    setMsg({ ok: true, text: 'Request sent. CoffeeBot staff will review it and reply by email.' });
    setForm((f) => ({ ...f, note: '' }));
  };

  const weekly = active.reduce((a, p) => a + (Number(p.cap) || 0), 0);

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">Partner dashboard · {user.org}</span>
        <h1>Welcome back, {user.name}</h1>
        <p>Tell CoffeeBot what grounds you can take, and follow your requests here. Once a request is approved, your weekly amount is added to CoffeeBot's collection plan.</p>
      </div>

      <motion.div {...reveal} className="stats">
        <div className="stat lead"><b>{active.length ? 'Active' : 'Not yet'}</b><span className="lbl">Partner status</span></div>
        <div className="stat"><b className="num">{weekly} kg</b><span className="lbl">Agreed per week</span></div>
        <div className="stat"><b className="num">{pending.length}</b><span className="lbl">Requests waiting for review</span></div>
        <div className="stat"><b className="num">{active.length}</b><span className="lbl">Requests approved</span></div>
      </motion.div>

      <div className="grid2" style={{ marginTop: 'var(--s5)' }}>
        <motion.div {...reveal} className="stamp-shadow">
          <form className="stamp pw-form" noValidate onSubmit={submit}>
            <div>
              <h2>Write to <em>CoffeeBot</em></h2>
              <p className="small muted">Sending as <b>{user.org}</b>. CoffeeBot staff review every request.</p>
              <div className="field"><label htmlFor="pKind">What you'd make or do</label>
                <select id="pKind" value={form.kind} onChange={set('kind')}>
                  {KINDS.map((k) => <option key={k}>{k}</option>)}
                </select></div>
              <div className="grid2" style={{ gap: 'var(--s3)' }}>
                <div className="field"><label htmlFor="pWet">Grounds you can take</label>
                  <select id="pWet" value={form.wet} onChange={set('wet')}>
                    <option value="wet">Fresh (wet) grounds</option><option value="dry">Dried grounds only</option>
                  </select></div>
                <div className="field"><label htmlFor="pCap">Kg per week</label>
                  <input type="number" id="pCap" min="1" value={form.cap} onChange={set('cap')} /></div>
              </div>
              <div className="field"><label htmlFor="pNote">Anything we should know? <span className="muted">(optional)</span></label>
                <textarea id="pNote" placeholder="e.g. we can collect on Tuesdays" value={form.note} onChange={set('note')} /></div>
              <button className="pw-btn" type="submit">Send request</button>
              <div className={`msg ${msg.ok ? 'ok' : msg.text ? 'bad' : ''}`} role="status">{msg.text}</div>
            </div>
          </form>
        </motion.div>

        <motion.div {...reveal} className="panel">
          <div className="panel-head"><h2>Your requests</h2></div>
          {pending.length || active.length ? (
            <div className="list">
              {pending.map((r) => (
                <div key={r.id} style={{ alignItems: 'center' }}>
                  <span><b>{r.kind}</b><br /><span className="small muted">{r.cap} kg a week · {r.wet ? 'fresh' : 'dried'} grounds{r.sent ? ` · sent ${r.sent}` : ''}</span></span>
                  <span className="tag t-dry">Waiting for review</span>
                </div>
              ))}
              {active.map((r, i) => (
                <div key={r.id ?? `a${i}`} style={{ alignItems: 'center' }}>
                  <span><b>{r.kind}</b><br /><span className="small muted">{r.cap} kg a week · {r.wet ? 'fresh' : 'dried'} grounds</span></span>
                  <span className="tag t-ok">Approved</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No requests yet. Send your first one with the form.</p>
          )}
          <p className="small muted">Questions about a pickup? Use the email on the Contact page.</p>
        </motion.div>
      </div>
    </Page>
  );
}
