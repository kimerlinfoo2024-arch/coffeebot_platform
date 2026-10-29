import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Counter from '../../components/ui/Counter';
import Page from '../../components/ui/Page';
import GroundsShowcase from '../../components/hero/GroundsShowcase';
import { useStore } from '../../store/useStore';
import { Donut } from '../../components/ui/charts';
import { pathways, usageTotals, liveSummary, batchTotals, fmt } from '../../lib/calc';

const reveal = {
  initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10%' }, transition: { duration: 0.45 },
};

const STEPS = [
  ['Brew', 'A coffee is made, and the used grounds are left behind in the machine.'],
  ['Collect', 'Grounds are kept apart from general waste and picked up on a schedule.'],
  ['Sort and dry', 'Clean batches are dried for products. Fresh batches go straight to compost or growers.'],
  ['Repurpose', 'The grounds become an ingredient in something new — see below.'],
];

export default function About() {
  const { bookings, reach, partners, batches, usage, visibility: vis } = useStore((s) => ({
    bookings: s.bookings, reach: s.reach, partners: s.partners,
    batches: s.batches, usage: s.usage, visibility: s.visibility,
  }));
  const orgs = new Set(bookings.map((b) => b.org)).size + 2;
  // only reused or in-progress grounds are shown publicly — landfill stays internal
  const paths = pathways(batches.filter((b) => b.status !== 'Disposed' && b.use !== 'Landfill' && b.use !== 'Unassigned'));
  const liveCups = useStore((s) => liveSummary(s).cups);
  const cups = usageTotals(usage).cups + liveCups;
  const anyStats = vis.grounds || vis.reach || vis.partners || vis.usage;

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">About CoffeeBot</span>
        <h1>Grounds up, not thrown out</h1>
        <p>
          CoffeeBot makes tabletop coffee machines for offices and campuses. Every cup leaves about 20 g of
          used grounds. Grounds Up gives those grounds a second life — and teaches people how along the way.
        </p>
      </div>

      {anyStats && (
        <>
          <motion.div {...reveal} className="stats">
            {vis.grounds && <div className="stat lead"><Counter to={batchTotals(batches).reused} suffix=" kg" className="bignum" /><span className="lbl">Grounds confirmed reused</span></div>}
            {vis.reach && <div className="stat"><Counter to={reach.people} className="bignum" /><span className="lbl">People reached through activities</span></div>}
            {vis.reach && <div className="stat"><Counter to={orgs} className="bignum" /><span className="lbl">Schools and workplaces</span></div>}
            {vis.partners && <div className="stat"><Counter to={partners.length} className="bignum" /><span className="lbl">Reuse partners</span></div>}
            {vis.usage && <div className="stat"><Counter to={cups} className="bignum" /><span className="lbl">Cups served in the last 4 weeks</span></div>}
          </motion.div>
          <p className="small muted" style={{ margin: '12px 0 var(--s6)' }}>
            Figures come straight from CoffeeBot's grounds log. Reuse only counts once a batch is confirmed reused by a partner or a logged session.
          </p>
        </>
      )}

      {(vis.pathways || vis.partners) && (
        <div className="grid2" style={{ marginTop: 'var(--s6)' }}>
          {vis.pathways && (
            <motion.div {...reveal} className="panel">
              <h2>Where grounds go</h2>
              <Donut segments={paths} centerLabel={fmt(paths.reduce((a, p) => a + p.value, 0))} centerSub="kg, last 4 weeks" />
            </motion.div>
          )}
          {vis.partners && (
            <motion.div {...reveal} className="panel">
              <h2>Our reuse partners</h2>
              <div className="list">
                {partners.map((p) => <div key={p.name}><span>{p.name}</span><span className="small muted">{p.kind}</span></div>)}
              </div>
            </motion.div>
          )}
        </div>
      )}

      <div className="pagehead" style={{ marginTop: 'var(--s7)' }}>
        <span className="eyebrow">A resource, not just waste</span>
        <h2 style={{ fontSize: 'var(--t-xl)', fontWeight: 900 }}>What used grounds can become</h2>
        <p>Grounds don't have to end in the bin. Collected clean and handled quickly, they can be an ingredient in something new.</p>
      </div>

      <ol className="reuse-steps">
        {STEPS.map(([h, t], i) => (
          <motion.li key={h} {...reveal} transition={{ ...reveal.transition, delay: i * 0.12 }}>
            <b>{h}</b><span>{t}</span>
          </motion.li>
        ))}
      </ol>

      <motion.div {...reveal}><GroundsShowcase /></motion.div>
      <p className="small muted" style={{ marginTop: 'var(--s3)', maxWidth: '80ch' }}>
        These are possible uses, not guarantees. Grounds are one ingredient alongside others, and whether reuse is the
        better option depends on how the grounds are collected, dried and transported.
      </p>

      <motion.div {...reveal} className="panel center" style={{ marginTop: 'var(--s7)', alignItems: 'center', gap: 'var(--s3)' }}>
        <h2>Bring Grounds Up to your class or team</h2>
        <p className="muted" style={{ maxWidth: '54ch' }}>Create an account with your school or work email to open the Education Hub, book activities and run quizzes.</p>
        <Link className="btn center" to="/signup">Sign up</Link>
      </motion.div>
    </Page>
  );
}
