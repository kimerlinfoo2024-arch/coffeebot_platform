import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollJourney from '../../components/hero/ScrollJourney';
import Counter from '../../components/ui/Counter';
import Icon from '../../components/ui/Icon';
import Marquee from '../../components/ui/Marquee';
import { useStore } from '../../store/useStore';
import { batchTotals } from '../../lib/calc';
import { BEAN } from '../../data/art';
import './landing.css';

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-12%' },
  transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] },
};

const TOPICS = [
  { tone: 'butter', icon: 'leaf',    title: 'what sustainability really means', by: 'Environment, people and economy — explained through one cup.' },
  { tone: 'rose',   icon: 'recycle', title: 'the circular economy, drawn as a loop', by: 'Take-make-dispose versus keeping materials in use.' },
  { tone: 'sky',    icon: 'cup',     title: 'the life of a coffee bean', by: 'Seven stages from farm to cup, and what happens after.' },
  { tone: 'sage',   icon: 'book',    title: 'for classrooms', by: 'Activities, discussion questions and lesson plans for teachers.' },
  { tone: 'butter', icon: 'users',   title: 'for workplaces', by: 'Scenarios and practical steps for teams and offices.' },
];

export default function Landing() {
  const reusedKg = useStore((s) => batchTotals(s.batches).reused);
  const people = useStore((s) => s.reach.people);
  const families = useStore((s) => s.reach.families);
  const partners = useStore((s) => s.partners.length);
  const rail = useRef(null);
  const slide = (d) => rail.current?.scrollBy({ left: d * 300, behavior: 'smooth' });

  return (
    <div>
      <ScrollJourney />

      <Marquee text="Join the loop" />

      {/* join us */}
      <section className="join">
        <span className="join-bit b1" aria-hidden="true" dangerouslySetInnerHTML={{ __html: BEAN }} />
        <span className="join-bit b2" aria-hidden="true" dangerouslySetInnerHTML={{ __html: BEAN }} />
        <span className="join-bit b3" aria-hidden="true" dangerouslySetInnerHTML={{ __html: BEAN }} />
        <motion.div {...reveal} className="join-in">
          <span className="sticker">For teachers &amp; workplaces</span>
          <h1 className="join-title">join us</h1>
          <p>
            Sign up with your school or work email to open the CoffeeBot Education Hub: sustainability,
            the circular economy and the life of a coffee bean, with hands-on activities you can book.
          </p>
          <Link className="pill dark" to="/signup">Sign up</Link>
          <p className="join-alt">Already have an account? <Link to="/signin">Log in</Link></p>
        </motion.div>
      </section>

      {/* what's inside */}
      <section className="inside">
        <motion.h2 {...reveal} className="inside-title">What you'll learn inside the Education Hub</motion.h2>
        <div className="rail" ref={rail} tabIndex={0} role="group" aria-label="Education Hub topics">
          {TOPICS.map((t) => (
            <article key={t.title} className={`topic ${t.tone}`}>
              <span className="topic-ico"><Icon name={t.icon} size={22} /></span>
              <h3>{t.title}</h3>
              <hr />
              <p>{t.by}</p>
            </article>
          ))}
        </div>
        <div className="rail-nav">
          <button onClick={() => slide(-1)} aria-label="Scroll topics left">←</button>
          <button onClick={() => slide(1)} aria-label="Scroll topics right">→</button>
        </div>
      </section>

      <Marquee text="Grounds up, not thrown out" />

      {/* impact (public, verified metrics) */}
      <section className="impact">
        <div className="page">
          <motion.div {...reveal} className="stack center" style={{ gap: 'var(--s2)', marginBottom: 'var(--s6)' }}>
            <span className="eyebrow" style={{ color: 'var(--amber-soft)' }}>Shared publicly</span>
            <h2 style={{ fontSize: 'var(--t-xl)', color: '#fff' }}>What CoffeeBot's grounds have done so far</h2>
          </motion.div>
          <motion.div {...reveal} className="grid4">
            {[
              { to: reusedKg, suffix: ' kg', lbl: 'Grounds confirmed reused' },
              { to: people, lbl: 'People reached through activities' },
              { to: families, lbl: 'Family members reached at home' },
              { to: partners, lbl: 'Active reuse partners' },
            ].map((m, i) => (
              <div key={i} className="stat impact-stat">
                <Counter to={m.to} suffix={m.suffix || ''} className="bignum" />
                <span className="lbl">{m.lbl}</span>
              </div>
            ))}
          </motion.div>
          <motion.div {...reveal} className="center" style={{ marginTop: 'var(--s6)' }}>
            <Link className="pill" to="/about">See how grounds are reused →</Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
