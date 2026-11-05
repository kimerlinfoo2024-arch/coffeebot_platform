import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import Icon from '../../components/ui/Icon';
import Marquee from '../../components/ui/Marquee';
import { STORIES } from '../../data/seed';
import { STORY_PICS, Svg } from '../../data/art';
import { PALETTE } from '../../styles/palette';
import './partner.css';

const reveal = {
  initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10%' }, transition: { duration: 0.45 },
};

const STEPS = [
  { icon: 'users', h: 'Create a partner account', p: 'Use Sign up at the top of the page, choose "A reuse partner" and use your work email.' },
  { icon: 'mail', h: 'Send a request', p: 'From your partner dashboard, tell us what you make, whether you take fresh or dried grounds, and how much per week.' },
  { icon: 'check', h: 'We review it', p: 'CoffeeBot staff check that the grounds you need match what our machines produce, then approve your request.' },
  { icon: 'recycle', h: 'Agree a pickup schedule', p: 'We plan collections around your schedule. Fresh grounds can go out the same week, with no drying.' },
  { icon: 'leaf', h: 'Put the grounds to use', p: 'Compost them, grow with them or make something new. Your weekly amount is counted as reused.' },
  { icon: 'send', h: 'Share what you made', p: "Send a photo and the kg you used. Your story can appear on this page and in CoffeeBot's impact reporting." },
];

const BENEFITS = [
  { icon: 'sprout', h: 'A steady, free supply', p: 'Used grounds on a regular schedule, so you can plan your batches instead of hunting for material.' },
  { icon: 'check', h: 'Grounds you can trust', p: 'Batches are kept apart from general waste and labelled fresh or dried, so you know what you are getting.' },
  { icon: 'recycle', h: 'Pickups that fit you', p: 'Collection days are planned around your capacity, not ours. Change the amount any time from your dashboard.' },
  { icon: 'award', h: 'Your work, shown', p: 'Approved partners can be featured on this page and in the reports CoffeeBot shares with schools and workplaces.' },
  { icon: 'users', h: 'A wider community', p: 'Meet the schools, offices and makers who are part of the same loop, through activities and events.' },
  { icon: 'leaf', h: 'Measured impact', p: "Every kilogram you take is logged, so you can show customers how much waste you've kept out of landfill." },
];

const TONES = ['tan', 'sky', 'butter'];

const ENVELOPE = `<svg viewBox="0 0 200 140" aria-hidden="true">
  <rect x="2" y="2" width="196" height="136" rx="6" fill="${PALETTE.cream}" stroke="${PALETTE.beige2}" stroke-width="2"/>
  <path d="M4 136 L78 70 M196 136 L122 70" stroke="${PALETTE.beige2}" stroke-width="2" fill="none"/>
  <path d="M3 5 L100 86 L197 5" fill="${PALETTE.cream2}" stroke="${PALETTE.beige2}" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="100" cy="84" r="17" fill="${PALETTE.blue}"/><circle cx="100" cy="84" r="11" fill="none" stroke="${PALETTE.blue2}" stroke-width="2"/></svg>`;

/** One partner's story as a letter. On a mouse, hovering the envelope opens it and the
    letter rises out; moving away tucks it back in. On touch screens (no hover) a tap
    opens and closes it, and keyboard users open it by focusing the envelope. */
function Letter({ story, tone }) {
  const [open, setOpen] = useState(false);
  const lastPointer = useRef('');
  const id = `letter-${story.pic}`;
  const byMouse = (e) => e.pointerType === 'mouse';
  return (
    <article className={`env tone-${tone} ${open ? 'open' : ''}`}
      onPointerEnter={(e) => { if (byMouse(e)) setOpen(true); }}
      onPointerLeave={(e) => { if (byMouse(e)) setOpen(false); }}>
      <div className="env-stage">
        <div className="env-letter" id={id} aria-hidden={!open}>
          <div className="env-paper">
            <div className="env-top">
              <div className="row wrap" style={{ gap: 6 }}>
                {story.placeholder && <span className="ph-flag">Placeholder quote</span>}
                <span className="tag t-gen">{story.kg}</span>
                <span className={`tag ${story.grounds === 'Fresh grounds' ? 't-wet' : 't-dry'}`}>{story.grounds}</span>
              </div>
              <div className="stamp env-stamp"><div><Svg markup={STORY_PICS[story.pic]} /></div></div>
            </div>
            <p className="env-dear">Dear CoffeeBot,</p>
            <blockquote>{story.quote}</blockquote>
            <p className="env-sign">{story.name}</p>
          </div>
        </div>
        <button className="env-body" aria-expanded={open} aria-controls={id}
          onPointerDown={(e) => { lastPointer.current = e.pointerType; }}
          onClick={() => { if (lastPointer.current !== 'mouse') setOpen((o) => !o); lastPointer.current = ''; }}
          onBlur={() => setOpen(false)}
          onFocus={(e) => { if (e.target.matches(':focus-visible')) setOpen(true); }}>
          <span className="env-pocket" />
          <span className="env-flap" />
          <span className="env-seal" aria-hidden="true">{story.name.charAt(0)}</span>
          <span className="env-front">
            <span className="env-from">From</span>
            <b>{story.name}</b>
            <span className="env-kind">{story.kind} · {story.since}</span>
            <span className="env-hint"><span className="h-hover">Hover to read</span><span className="h-tap">{open ? 'Tap to close' : 'Tap to read'}</span></span>
          </span>
        </button>
      </div>
    </article>
  );
}

export default function Partner() {
  return (
    <Page bare>
      <div className="pw">
        {/* hero */}
        <section className="pw-hero">
          <div className="pw-hero-text">
            <span className="pw-kicker">(For cafés, farms &amp; makers)</span>
            <h1>Give used coffee grounds <em>somewhere good</em> to go.</h1>
            <p>Businesses and community groups that can use coffee grounds help CoffeeBot reuse more of them. Here's how partnering works, what you get from it, and what our partners say.</p>
          </div>
          <div className="pw-hero-art" aria-hidden="true">
            <div className="pw-photo"><Svg markup={STORY_PICS.compost} /></div>
            <span className="pw-envelope" dangerouslySetInnerHTML={{ __html: ENVELOPE }} />
            <div className="stamp pw-hero-stamp"><div><img src="/coffeebot-mark.png" alt="" /><span>Grounds Up</span></div></div>
          </div>
        </section>

        <Marquee text="A second life for every ground" className="pw-marquee" />

        {/* how it works, step by step, as pinned notes */}
        <section className="pw-steps" id="how">
          <motion.div {...reveal} className="pw-head">
            <span className="pw-kicker">(Step by step)</span>
            <h2>How partnering <em>works</em></h2>
          </motion.div>
          <ol className="notes">
            {STEPS.map((s, i) => (
              <motion.li key={s.h} {...reveal} transition={{ ...reveal.transition, delay: (i % 3) * 0.1 }} className={`note tone-${TONES[i % TONES.length]}`}>
                <span className="note-ico"><Icon name={s.icon} size={24} /></span>
                <h3>{i + 1}. {s.h}</h3>
                <p>{s.p}</p>
              </motion.li>
            ))}
          </ol>
          <p className="pw-signup-note">Ready? Choose <b>Sign up</b> at the top of the page and pick <b>"A reuse partner"</b>. Requests are sent from your partner dashboard.</p>
        </section>

        {/* benefits */}
        <section className="pw-benefits">
          <motion.div {...reveal} className="pw-head">
            <span className="pw-kicker">(Why partner with us)</span>
            <h2>What you <em>get</em></h2>
          </motion.div>
          <ul className="perks">
            {BENEFITS.map((b, i) => (
              <motion.li key={b.h} {...reveal} transition={{ ...reveal.transition, delay: (i % 3) * 0.1 }} className="stamp-shadow">
                <div className="stamp"><div>
                  <span className="perk-ico"><Icon name={b.icon} size={22} /></span>
                  <h3>{b.h}</h3>
                  <p>{b.p}</p>
                </div></div>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* testimonials, as letters */}
        <section className="pw-letters" id="letters">
          <motion.div {...reveal} className="pw-head">
            <span className="pw-kicker">(Testimonials)</span>
            <h2>Letters from <em>our partners</em></h2>
            <p>Each envelope holds one partner's experience of working with CoffeeBot. Hover over one (or tap it) to read their letter.</p>
          </motion.div>
          <div className="env-grid">
            {STORIES.map((s, i) => (
              <motion.div key={s.name} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }}>
                <Letter story={s} tone={TONES[i % TONES.length]} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </Page>
  );
}
