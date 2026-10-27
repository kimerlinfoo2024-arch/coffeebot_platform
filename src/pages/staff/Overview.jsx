import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import { useStore } from '../../store/useStore';
import { groundsTotals, weekRow, batchTotals, usageTotals, pathways, circularity, liveSummary, withLive, fmt } from '../../lib/calc';
import LiveFeed from '../../components/ui/LiveFeed';
import CircularityFunnel from '../../components/ui/CircularityFunnel';
import { WEEKS } from '../../data/seed';
import { StackedBars, Donut } from '../../components/ui/charts';
import './overview.css';

const reveal = {
  initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' }, transition: { duration: 0.4 },
};

export default function Overview() {
  const state = useStore((s) => s);
  const { reach, bookings, partners, inbox, feed, missionsAssigned, missionsCompleted, batches } = state;
  const usage = withLive(state.usage, liveSummary(state).cups); // history plus the simulated live feed
  const orgs = new Set(bookings.map((b) => b.org)).size + 2;
  const g = groundsTotals(bookings, partners);
  const routed = Math.round(((g.act + g.part) / g.collected) * 100);
  const c = circularity(batches, usage);
  const t = batchTotals(batches);
  const u = usageTotals(usage);
  const paths = pathways(batches);
  const usageBars = usage.map((w) => ({ label: w.w, segments: [{ name: 'Cups served', value: w.cups, color: 'var(--brew)' }] }));

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
        <p>How far Grounds Up is reaching, what happened to the last four weeks of grounds, and where the next four weeks are going.</p>
      </div>

      <div className="stack ov">
        <motion.div {...reveal} className="stats">
          <div className="stat lead"><b className="num">{reach.people.toLocaleString()}</b><span className="lbl">People reached across {orgs} schools and workplaces</span></div>
          <div className="stat"><b className="num">{(reach.families + missionsCompleted).toLocaleString()}</b><span className="lbl">Family members reached · {12 + missionsAssigned} missions this week</span></div>
          <div className="stat"><b className="num">{u.cups.toLocaleString()}</b><span className="lbl">Cups served · 4 weeks plus live feed</span></div>
          <div className={`stat ${c.rate < 50 ? 'warn' : ''}`}><b className="num">{c.rate}%</b><span className="lbl">Circularity rate · confirmed reuse of all grounds generated</span></div>
        </motion.div>

        <section>
          <div className="spread ov-head">
            <h2>Live from the machines</h2>
            <span className="small muted">Updates for everyone, as it happens</span>
          </div>
          <motion.div {...reveal} className="panel">
            <LiveFeed />
          </motion.div>
        </section>

        <section>
          <div className="spread ov-head">
            <h2>Circularity</h2>
            <Link className="small" to="/staff/reports">Methodology in Reports →</Link>
          </div>
          <motion.div {...reveal} className="panel">
            <CircularityFunnel c={c} />
          </motion.div>
        </section>

        <section>
          <div className="spread ov-head">
            <h2>Last 4 weeks</h2>
            <Link className="small" to="/staff/grounds">Open grounds log →</Link>
          </div>
          <div className="grid2 ov-row">
            <motion.div {...reveal} className="panel">
              <div className="panel-head"><h3>Where grounds went</h3><span className="small muted">kg logged</span></div>
              <Donut segments={paths} centerLabel={fmt(t.logged)} centerSub="kg logged" />
              <div className="ov-foot">
                <span><b className="num">{fmt(t.reused)} kg</b> reused</span>
                <span><b className="num">{fmt(t.inProgress)} kg</b> in progress</span>
                <span className={t.disposed ? 'badc' : ''}><b className="num">{fmt(t.disposed)} kg</b> disposed</span>
              </div>
            </motion.div>
            <motion.div {...reveal} className="panel">
              <div className="panel-head"><h3>Coffee served</h3><span className="small muted">cups a week</span></div>
              <StackedBars data={usageBars} height={150} />
              <div className="ov-foot">
                <span><b className="num">{Math.round(u.perWeek).toLocaleString()}</b> cups a week</span>
                <span><b className="num">{fmt(u.kg)} kg</b> grounds generated</span>
                <span><b className="num">{u.kg ? Math.round((t.logged / u.kg) * 100) : 0}%</b> collected</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section>
          <div className="spread ov-head">
            <h2>Next 4 weeks</h2>
            <Link className="small" to="/staff/plan">Open drying plan →</Link>
          </div>
          <motion.div {...reveal} className="panel ov-plan">
            <div>
              <div className="panel-head"><h3>Planned grounds by week</h3><span className="small muted">kg · {g.collected / WEEKS.length} kg collected a week</span></div>
              <StackedBars data={weekBars} unit=" kg" height={180} />
            </div>
            <div className="list ov-plan-list">
              <div><span>Booked for activities</span><b className="num">{fmt(g.act)} kg</b></div>
              <div><span>Going to {partners.length} partners</span><b className="num">{fmt(g.part)} kg</b></div>
              <div><span>At risk of disposal</span><b className={`num ${g.risk ? 'badc' : ''}`}>{fmt(g.risk)} kg</b></div>
              <div><span>Routed overall</span><b className="num">{routed}%</b></div>
              {g.risk > 0 && <Link className="btn ghost sm" to="/staff/partners">Review partner requests</Link>}
            </div>
          </motion.div>
        </section>

        <div className="grid2 ov-row">
          <motion.div {...reveal} className="panel">
            <div className="panel-head"><h3>Inbox</h3><span className="tag t-gen">{inbox.length} message{inbox.length === 1 ? '' : 's'}</span></div>
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
            <div className="panel-head"><h3>Recent activity</h3></div>
            <div className="list">
              {feed.slice(0, 5).map((f, i) => <div key={i}><span className="small">{f}</span></div>)}
            </div>
          </motion.div>
        </div>

        <p className="small muted" style={{ textAlign: 'center' }}>
          Public figures and the product showcase live on the <Link to="/about">About page</Link> · choose what's shown in <Link to="/staff/reports">Reports</Link>.
        </p>
      </div>
    </Page>
  );
}
