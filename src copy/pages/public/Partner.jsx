import { useState } from 'react';
import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import { useStore } from '../../store/useStore';
import { STORIES } from '../../data/seed';
import { STORY_PICS, Svg } from '../../data/art';

const reveal = {
  initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10%' }, transition: { duration: 0.45 },
};

export default function Partner() {
  const partners = useStore((s) => s.partners);
  const addPartnerRequest = useStore((s) => s.addPartnerRequest);

  const [form, setForm] = useState({ name: '', kind: 'Compost or gardening', wet: 'wet', cap: 10 });
  const [msg, setMsg] = useState({ ok: false, text: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setMsg({ ok: false, text: 'Add your organisation name.' });
    const cap = Number(form.cap);
    if (!(cap > 0)) return setMsg({ ok: false, text: 'Enter how many kg you could take each week.' });
    addPartnerRequest({ name: form.name.trim(), kind: form.kind, cap, wet: form.wet === 'wet' });
    setMsg({ ok: true, text: 'Request sent. CoffeeBot staff will review it.' });
    setForm((f) => ({ ...f, name: '' }));
  };

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">For cafés, farms &amp; makers</span>
        <h1>Partner with us</h1>
        <p>Businesses and community groups that can use coffee grounds help CoffeeBot reuse more of them. Tell us what you need and how often.</p>
      </div>

      <h2 style={{ marginBottom: 'var(--s3)' }}>What partnering looks like</h2>
      <div className="grid3" style={{ marginBottom: 'var(--s6)' }}>
        {STORIES.map((s, i) => (
          <motion.article key={s.name} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="thumb full"><Svg markup={STORY_PICS[s.pic]} /></div>
            <div style={{ padding: 'var(--s4)', display: 'flex', flexDirection: 'column', gap: 'var(--s2)' }}>
              <div><b>{s.name}</b><div className="small muted">{s.kind}. {s.since}</div></div>
              <blockquote style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.5 }}>"{s.quote}"</blockquote>
              <div className="row wrap" style={{ gap: 6 }}>
                <span className="tag t-gen">{s.kg}</span>
                <span className={`tag ${s.grounds === 'Fresh grounds' ? 't-wet' : 't-dry'}`}>{s.grounds}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="panel" style={{ marginBottom: 'var(--s6)' }}>
        <h2>How it works</h2>
        <div className="grid3">
          {[
            ['1. Apply', 'Tell us what you make, whether you can take fresh or dried grounds, and how much per week.'],
            ['2. Set a pickup schedule', 'CoffeeBot plans collections around your schedule. Fresh grounds can go out the same week, with no drying.'],
            ['3. Share what you made', "Send a photo and the kg you used. Your story can appear here and in CoffeeBot's impact figures."],
          ].map(([h, p]) => (
            <div key={h} className="card soft"><h3>{h}</h3><p className="small muted">{p}</p></div>
          ))}
        </div>
      </div>

      <div className="grid2">
        <form className="panel" noValidate onSubmit={submit}>
          <h2>Become a reuse partner</h2>
          <div className="field"><label htmlFor="pName">Organisation</label>
            <input type="text" id="pName" placeholder="e.g. Sunny Side Café" value={form.name} onChange={set('name')} /></div>
          <div className="field"><label htmlFor="pKind">What you'd make or do</label>
            <select id="pKind" value={form.kind} onChange={set('kind')}>
              <option>Compost or gardening</option><option>Skincare or soap</option>
              <option>Candles or crafts</option><option>Mushroom growing</option><option>Other</option>
            </select></div>
          <div className="grid2" style={{ gap: 'var(--s3)' }}>
            <div className="field"><label htmlFor="pWet">Grounds you can take</label>
              <select id="pWet" value={form.wet} onChange={set('wet')}>
                <option value="wet">Fresh (wet) grounds</option><option value="dry">Dried grounds only</option>
              </select></div>
            <div className="field"><label htmlFor="pCap">Kg per week</label>
              <input type="number" id="pCap" min="1" value={form.cap} onChange={set('cap')} /></div>
          </div>
          <button className="btn" type="submit">Send partner request</button>
          <div className={`msg ${msg.ok ? 'ok' : msg.text ? 'bad' : ''}`}>{msg.text}</div>
        </form>

        <div className="panel">
          <h2>Current partners</h2>
          <div className="list">
            {partners.map((p) => (
              <div key={p.name}><span>{p.name}</span><span className="small muted">{p.kind}</span></div>
            ))}
          </div>
          <p className="small muted">Partners collect on a regular schedule, so CoffeeBot can plan collection instead of storing grounds.</p>
        </div>
      </div>
    </Page>
  );
}
