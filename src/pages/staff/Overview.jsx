import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import Hero from '../../components/hero/Hero';
import { useStore } from '../../store/useStore';
import { groundsTotals, weekRow, fmt } from '../../lib/calc';
import { WEEKS } from '../../data/seed';
import { StackedBars, Ring } from '../../components/ui/charts';

const reveal = {
  initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' }, transition: { duration: 0.4 },
};

export default function Overview() {
  const { reach, bookings, partners, inbox, feed, missionsAssigned, missionsCompleted } = useStore((s) => s);
  const orgs = new Set(bookings.map((b) => b.org)).size + 2;
  const g = groundsTotals(bookings, partners);
  const circularity = Math.round(((g.act + g.part) / g.collected) * 100);

  const weekBars = WEEKS.map((w, i) => {
    const x = weekRow(bookings, partners, i);
    return {
      label: w.w,
      segments: [
        { name: 'Activities (dry)', value: +x.dry.toFixed(1), color: 'var(--brew)' },
        { name: 'Activities (wet)', value: +x.wet.toFixed(1), color: 'var(--teal)' },
        { name: 'To partners', value: +x.part.toFixed(1), color: 'var(--leaf)' },
        { name: 'At risk', value: +x.risk.toFixed(1), color: 'var(--bad)' },
      ],
    };
  });

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">CoffeeBot staff</span>
        <h1>Overview</h1>
        <p>Reach from activities and where CoffeeBot's grounds are going over the next four weeks.</p>
      </div>

      <div className="stack">
        <motion.div {...reveal}>
          <h2 style={{ marginBottom: 'var(--s2)' }}>Reach</h2>
          <div className="stats">
            <div className="stat lead"><b className="num">{reach.people.toLocaleString()}</b><span className="lbl">People reached — students and staff in activities</span></div>
            <div className="stat"><b className="num">{reach.families + missionsCompleted}</b><span className="lbl">Family members reached — through home missions</span></div>
            <div className="stat"><b className="num">{orgs}</b><span className="lbl">Schools and workplaces</span></div>
            <div className="stat"><b className="num">{12 + missionsAssigned}</b><span className="lbl">Missions assigned this week</span></div>
          </div>
        </motion.div>

        <motion.div {...reveal}>
          <div className="spread" style={{ marginBottom: 'var(--s2)' }}>
            <h2>Grounds, next 4 weeks</h2>
            <Link className="small" to="/staff/plan">Open drying plan →</Link>
          </div>
          <div className="stats">
            <div className="stat"><b className="num">{fmt(g.act)} kg</b><span className="lbl">Booked for activities</span></div>
            <div className="stat"><b className="num">{fmt(g.part)} kg</b><span className="lbl">Going to partners · {partners.length} partners</span></div>
            <div className={`stat ${g.risk ? 'warn' : ''}`}><b className="num">{fmt(g.risk)} kg</b><span className="lbl">{g.risk ? 'At risk — approve partners to reduce' : 'Every kg has a destination'}</span></div>
            <div className="stat"><b className="num">{g.collected} kg</b><span className="lbl">Collected (estimate) · 80 kg a week</span></div>
          </div>
        </motion.div>

        <div className="grid2">
          <motion.div {...reveal} className="panel">
            <div className="panel-head"><h2>Grounds by week</h2><span className="small muted">kg</span></div>
            <StackedBars data={weekBars} unit=" kg" />
          </motion.div>
          <motion.div {...reveal} className="panel" style={{ alignItems: 'center', textAlign: 'center' }}>
            <h2 style={{ alignSelf: 'flex-start' }}>Circularity rate</h2>
            <Ring value={circularity} max={100} label={`${circularity}%`} sub="routed" color="var(--leaf)" size={150} />
            <p className="small muted">Share of collected grounds routed to an activity or partner instead of disposal.</p>
          </motion.div>
        </div>

        <div className="grid2">
          <motion.div {...reveal} className="panel">
            <div className="panel-head"><h2>Inbox</h2><span className="tag t-gen">{inbox.length} message{inbox.length === 1 ? '' : 's'}</span></div>
            <div className="list">
              {inbox.map((m, i) => (
                <div key={i} style={{ flexDirection: 'column', gap: 2 }}>
                  <span><b>{m.from}</b> <span className="small muted">{m.topic}</span></span>
                  <span className="small">{m.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...reveal} className="panel">
            <div className="panel-head"><h2>Recent activity</h2></div>
            <div className="list">
              {feed.slice(0, 6).map((f, i) => <div key={i}><span>{f}</span></div>)}
            </div>
          </motion.div>
        </div>

        {/* product showcase — also what the public About page displays */}
        <motion.div {...reveal}>
          <div className="spread" style={{ marginBottom: 'var(--s2)' }}>
            <h2>What your grounds become</h2>
            <Link className="small" to="/about">View public About →</Link>
          </div>
          <Hero autoTint={false} tagline="Shared publicly on your About page">
            {() => <Link className="pill dark" to="/about">See the public page →</Link>}
          </Hero>
        </motion.div>
      </div>
    </Page>
  );
}
