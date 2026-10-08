import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollJourney from '../../components/hero/ScrollJourney';
import Counter from '../../components/ui/Counter';
import { useStore } from '../../store/useStore';

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-12%' },
  transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] },
};

export default function Landing() {
  const reusedYear = useStore((s) => s.reusedYear);
  const people = useStore((s) => s.reach.people);
  const families = useStore((s) => s.reach.families);
  const partners = useStore((s) => s.partners.length);

  return (
    <div>
      <ScrollJourney />

      {/* value proposition */}
      <section className="page">
        <motion.div {...reveal} className="stack" style={{ maxWidth: '72ch', margin: '0 auto', textAlign: 'center', gap: 'var(--s4)' }}>
          <span className="eyebrow">The circular sustainability hub</span>
          <h1 style={{ fontSize: 'var(--t-2xl)' }}>One platform. Two views. A closed loop.</h1>
          <p className="muted" style={{ fontSize: 'var(--t-lg)' }}>
            CoffeeBot turns an underused waste stream into measurable impact, visibility among schools and
            workplaces, and a hands-on learning resource for the wider community.
          </p>
        </motion.div>

        {/* two audiences */}
        <div className="grid2" style={{ marginTop: 'var(--s7)' }}>
          <motion.div {...reveal} className="panel">
            <span className="tag t-ok">Schools &amp; workplaces</span>
            <h2>Learn it by making it</h2>
            <p className="muted">
              Products made from coffee grounds introduce the idea; each links to a hands-on activity you can
              book. Quizzes and home missions teach waste and circular-economy concepts — free, any time.
            </p>
            <Link className="btn" to="/signin">Sign in to get started</Link>
          </motion.div>
          <motion.div {...reveal} className="panel">
            <span className="tag t-gen">CoffeeBot staff</span>
            <h2>Measure the whole loop</h2>
            <p className="muted">
              Built on CoffeeBot's IoT data: consumption, grounds generated, beneficial reuse, reuse
              destinations and circularity rate — with a drying plan that matches activities to the weather.
            </p>
            <Link className="btn ghost" to="/about">See how it works</Link>
          </motion.div>
        </div>
      </section>

      {/* impact teaser (public, verified metrics) */}
      <section style={{ background: 'var(--brew)', color: '#fff' }}>
        <div className="page">
          <motion.div {...reveal} className="stack center" style={{ gap: 'var(--s2)', marginBottom: 'var(--s6)' }}>
            <span className="eyebrow" style={{ color: 'var(--amber-soft)' }}>Verified impact, shared publicly</span>
            <h2 style={{ fontSize: 'var(--t-xl)', color: '#fff' }}>What CoffeeBot's grounds have done this year</h2>
          </motion.div>
          <motion.div {...reveal} className="grid4">
            {[
              { to: reusedYear, suffix: ' kg', lbl: 'Grounds given a second life' },
              { to: people, lbl: 'People reached through activities' },
              { to: families, lbl: 'Family members reached at home' },
              { to: partners, lbl: 'Active reuse partners' },
            ].map((m, i) => (
              <div key={i} className="stat" style={{ background: 'color-mix(in srgb, #fff 10%, transparent)', borderColor: 'color-mix(in srgb, #fff 24%, transparent)', color: '#fff' }}>
                <Counter to={m.to} suffix={m.suffix || ''} className="bignum" />
                <span className="lbl" style={{ color: '#fff', opacity: 0.82 }}>{m.lbl}</span>
              </div>
            ))}
          </motion.div>
          <motion.div {...reveal} className="center" style={{ marginTop: 'var(--s6)' }}>
            <Link className="pill" to="/about">See the full story →</Link>
          </motion.div>
        </div>
      </section>

      {/* partner CTA */}
      <section className="page">
        <motion.div {...reveal} className="panel" style={{ alignItems: 'center', textAlign: 'center', gap: 'var(--s3)' }}>
          <span className="eyebrow">For cafés, farms &amp; makers</span>
          <h2>Can you reuse coffee grounds?</h2>
          <p className="muted" style={{ maxWidth: '56ch' }}>
            Compost, skincare, candles, mushroom growing — if you can put grounds to use, partnering with
            CoffeeBot gives you a steady, scheduled supply and a place in the impact story.
          </p>
          <Link className="btn center" to="/partner">Partner with us</Link>
        </motion.div>
      </section>
    </div>
  );
}
