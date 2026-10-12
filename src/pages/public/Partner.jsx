import { useState } from 'react';
import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import Icon from '../../components/ui/Icon';
import Marquee from '../../components/ui/Marquee';
import { useStore } from '../../store/useStore';
import { STORIES } from '../../data/seed';
import { STORY_PICS, Svg } from '../../data/art';
import './partner.css';

const reveal = {
  initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10%' }, transition: { duration: 0.45 },
};

const STEPS = [
  { icon: 'mail', h: 'Apply', p: 'Tell us what you make, whether you can take fresh or dried grounds, and how much per week.' },
  { icon: 'recycle', h: 'Set a pickup schedule', p: 'CoffeeBot plans collections around your schedule. Fresh grounds can go out the same week, with no drying.' },
  { icon: 'send', h: 'Share what you made', p: "Send a photo and the kg you used. Your story can appear here and in CoffeeBot's impact figures." },
];

const TONES = ['tan', 'sky', 'butter'];

const ENVELOPE = `<svg viewBox="0 0 200 140" aria-hidden="true">
  <rect x="2" y="2" width="196" height="136" rx="6" fill="#F3EEE2" stroke="#D9D0BE" stroke-width="2"/>
  <path d="M4 136 L78 70 M196 136 L122 70" stroke="#D9D0BE" stroke-width="2" fill="none"/>
  <path d="M3 5 L100 86 L197 5" fill="#ECE5D6" stroke="#D9D0BE" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="100" cy="84" r="17" fill="#9DBBE3"/><circle cx="100" cy="84" r="11" fill="none" stroke="#7FA3D4" stroke-width="2"/></svg>`;

const jump = (id) => document.getElementById(id)?.scrollIntoView({
  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
});

/** One partner's story as a letter: the envelope opens and the letter slides out. */
function Letter({ story, tone, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = `letter-${story.pic}`;
  return (
    <article className={`env tone-${tone} ${open ? 'open' : ''}`}>
      <div className="env-letter" id={id} aria-hidden={!open}>
        <div>
          <div className="env-paper">
            <div className="stamp env-stamp"><div><Svg markup={STORY_PICS[story.pic]} /></div></div>
            <p className="env-dear">Dear CoffeeBot,</p>
            <blockquote>{story.quote}</blockquote>
            <p className="env-sign">— {story.name}</p>
            <div className="row wrap" style={{ gap: 6 }}>
              <span className="tag t-gen">{story.kg}</span>
              <span className={`tag ${story.grounds === 'Fresh grounds' ? 't-wet' : 't-dry'}`}>{story.grounds}</span>
            </div>
          </div>
        </div>
      </div>
      <button className="env-body" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <span className="env-pocket" />
        <span className="env-flap" />
        <span className="env-seal" aria-hidden="true">{story.name.charAt(0)}</span>
        <span className="env-front">
          <span className="env-from">From</span>
          <b>{story.name}</b>
          <span className="env-kind">{story.kind} · {story.since}</span>
          <span className="env-hint">{open ? 'Close letter' : 'Open letter'}</span>
        </span>
      </button>
    </article>
  );
}

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
    <Page bare>
      <div className="pw">
        {/* hero */}
        <section className="pw-hero">
          <div className="pw-hero-text">
            <span className="pw-kicker">(For cafés, farms &amp; makers)</span>
            <h1>Give used coffee grounds <em>somewhere good</em> to go.</h1>
            <p>Businesses and community groups that can use coffee grounds help CoffeeBot reuse more of them. Tell us what you need and how often.</p>
            <div className="row wrap">
              <button className="pw-btn ghost" onClick={() => jump('letters')}>Read partner letters</button>
              <button className="pw-btn" onClick={() => jump('apply')}>Become a partner</button>
            </div>
          </div>
          <div className="pw-hero-art" aria-hidden="true">
            <div className="pw-photo"><Svg markup={STORY_PICS.compost} /></div>
            <span className="pw-envelope" dangerouslySetInnerHTML={{ __html: ENVELOPE }} />
            <div className="stamp pw-hero-stamp"><div><img src="/coffeebot-mark.png" alt="" /><span>Grounds Up</span></div></div>
          </div>
        </section>

        <Marquee text="A second life for every ground" className="pw-marquee" />

        {/* partner experiences, as letters */}
        <section className="pw-letters" id="letters">
          <motion.div {...reveal} className="pw-head">
            <h2>Letters from <em>our partners</em></h2>
            <p>Each envelope holds one partner's experience of working with CoffeeBot. Open them to read what partnering looks like.</p>
          </motion.div>
          <div className="env-grid">
            {STORIES.map((s, i) => (
              <motion.div key={s.name} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }}>
                <Letter story={s} tone={TONES[i % TONES.length]} defaultOpen={i === 0} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* how it works, as pinned notes */}
        <section className="pw-steps">
          <motion.div {...reveal} className="pw-head">
            <span className="pw-kicker">(Three steps)</span>
            <h2>How partnering <em>works</em></h2>
          </motion.div>
          <ol className="notes">
            {STEPS.map((s, i) => (
              <motion.li key={s.h} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }} className={`note tone-${TONES[i]}`}>
                <span className="note-ico"><Icon name={s.icon} size={24} /></span>
                <h3>{i + 1}. {s.h}</h3>
                <p>{s.p}</p>
              </motion.li>
            ))}
          </ol>
        </section>

        {/* apply */}
        <section className="pw-apply" id="apply">
          <div className="pw-apply-in">
            <div className="stamp-shadow">
              <form className="stamp pw-form" noValidate onSubmit={submit}>
                <div>
                  <h2>Write to <em>CoffeeBot</em></h2>
                  <p className="small muted">Send a partner request and CoffeeBot staff will review it.</p>
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
                  <button className="pw-btn" type="submit">Send partner request</button>
                  <div className={`msg ${msg.ok ? 'ok' : msg.text ? 'bad' : ''}`} role="status">{msg.text}</div>
                </div>
              </form>
            </div>

            <div className="stamp-shadow pw-current">
              <div className="stamp">
                <div>
                  <h2>Current <em>partners</em></h2>
                  <div className="list">
                    {partners.map((p) => (
                      <div key={p.name}><span>{p.name}</span><span className="small muted">{p.kind}</span></div>
                    ))}
                  </div>
                  <p className="small muted">Partners collect on a regular schedule, so CoffeeBot can plan collection instead of storing grounds.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Page>
  );
}
