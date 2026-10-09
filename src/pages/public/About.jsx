import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Counter from '../../components/ui/Counter';
import Page from '../../components/ui/Page';
import ClosedLoop from '../../components/ui/ClosedLoop';
import { useStore } from '../../store/useStore';
import { ACTS } from '../../data/seed';
import { Donut } from '../../components/ui/charts';
import { pathways, usageTotals, fmt } from '../../lib/calc';

const reveal = {
  initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10%' }, transition: { duration: 0.45 },
};

export default function About() {
  const { reusedYear, bookings, reach, partners, batches, usage, visibility: vis } = useStore((s) => ({
    reusedYear: s.reusedYear, bookings: s.bookings, reach: s.reach, partners: s.partners,
    batches: s.batches, usage: s.usage, visibility: s.visibility,
  }));
  const actKg = bookings.reduce((a, b) => a + b.kg, 0);
  const orgs = new Set(bookings.map((b) => b.org)).size + 2;
  // only reused or in-progress grounds are shown publicly — landfill stays internal
  const paths = pathways(batches.filter((b) => b.status !== 'Disposed' && b.use !== 'Landfill' && b.use !== 'Unassigned'));
  const cups = usageTotals(usage).cups;
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
            {vis.grounds && <div className="stat lead"><Counter to={reusedYear + actKg} suffix=" kg" className="bignum" /><span className="lbl">Grounds given a second life this year</span></div>}
            {vis.reach && <div className="stat"><Counter to={reach.people} className="bignum" /><span className="lbl">People reached through activities</span></div>}
            {vis.reach && <div className="stat"><Counter to={orgs} className="bignum" /><span className="lbl">Schools and workplaces</span></div>}
            {vis.partners && <div className="stat"><Counter to={partners.length} className="bignum" /><span className="lbl">Reuse partners</span></div>}
            {vis.usage && <div className="stat"><Counter to={cups} className="bignum" /><span className="lbl">Cups served in the last 4 weeks</span></div>}
          </motion.div>
          <p className="small muted" style={{ margin: '12px 0 var(--s6)' }}>
            Figures update from CoffeeBot's operations dashboard. Reuse only counts once a partner or activity confirms it.
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

      <h2 style={{ margin: 'var(--s7) 0 var(--s3)' }}>What grounds become</h2>
      <div className="grid3">
        {Object.entries(ACTS).map(([k, v], i) => (
          <motion.div key={k} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="card">
            <span className={`tag ${v.wet ? 't-wet' : 't-dry'}`}>{v.wet ? 'Wet · no drying' : 'Dried grounds'}</span>
            <b>{v.name}</b>
            <span className="small muted">{v.learn}</span>
          </motion.div>
        ))}
      </div>

      <motion.div {...reveal} className="panel center" style={{ marginTop: 'var(--s7)', alignItems: 'center', gap: 'var(--s3)' }}>
        <h2>Bring Grounds Up to your class or team</h2>
        <p className="muted" style={{ maxWidth: '54ch' }}>Sign in with your school or workplace email to book activities, run quizzes and track the impact your group contributes.</p>
        <div className="row wrap" style={{ justifyContent: 'center' }}>
          <Link className="btn" to="/signin">Sign in</Link>
          <Link className="btn ghost" to="/partner">Partner with us</Link>
        </div>
      </motion.div>
    </Page>
  );
}
