import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Page from '../../components/ui/Page';
import { useStore } from '../../store/useStore';
import { VISIBILITY_ITEMS } from '../../data/seed';
import { batchTotals, pathways, usageTotals, educationByOrg, capTotal, fmt } from '../../lib/calc';
import { toCSV, downloadFile, today, BATCH_COLS } from '../../lib/download';
import './reports.css';

const reveal = {
  initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' }, transition: { duration: 0.4 },
};

export default function Reports() {
  const { batches, usage, bookings, partners, reach, reusedYear, missionsCompleted, quizzesDone, visibility, setVisibility } = useStore((s) => s);

  const t = batchTotals(batches);
  const u = usageTotals(usage);
  const paths = pathways(batches).sort((a, b) => b.value - a.value);
  const edu = educationByOrg(bookings);
  const eduKg = edu.reduce((a, o) => a + o.kg, 0);
  const capturePct = u.kg ? Math.round((t.logged / u.kg) * 100) : 0;
  const period = `${usage[0]?.w ?? ''} – ${usage[usage.length - 1]?.w ?? ''} 2026`;

  const summaryRows = [
    ['Cups served', u.cups],
    ['Grounds generated (est. kg)', fmt(u.kg)],
    ['Grounds logged (kg)', t.logged],
    ['Capture rate (%)', capturePct],
    ['Confirmed reused (kg)', t.reused],
    ['Disposed (kg)', t.disposed],
    ['Reuse rate (%)', t.reuseRate],
    ['Grounds reused this year (kg)', reusedYear],
    ['People reached', reach.people],
    ['Family members reached', reach.families + missionsCompleted],
    ['Education partners', edu.length],
    ['Reuse partners', partners.length],
    ['Partner capacity (kg/week)', capTotal(partners)],
    ...paths.map((p) => [`Pathway: ${p.name} (kg)`, p.value]),
  ].map(([metric, value]) => ({ metric, value }));

  const downloads = [
    ['Impact summary', 'Headline metrics for this period', () =>
      downloadFile(`coffeebot-impact-summary-${today()}.csv`, toCSV(summaryRows, [['metric', 'Metric'], ['value', 'Value']]))],
    ['Grounds log', `${batches.length} batches with source, partner, use and status`, () =>
      downloadFile(`coffeebot-grounds-${today()}.csv`, toCSV(batches, BATCH_COLS))],
    ['Education partners', 'Sessions, participants and kg per organisation', () =>
      downloadFile(`coffeebot-education-${today()}.csv`, toCSV(edu, [['org', 'Organisation'], ['sessions', 'Sessions'], ['people', 'Participants'], ['kg', 'Kg reused'], ['acts', 'Activities']]))],
  ];

  return (
    <Page>
      <div className="pagehead no-print">
        <span className="eyebrow">Sustainability reporting</span>
        <h1>Reports</h1>
        <p>Preview the impact report, download the data behind it, and choose what appears on the public About page.</p>
      </div>

      <div className="grid2 no-print" style={{ marginBottom: 'var(--s5)' }}>
        <motion.div {...reveal} className="panel">
          <div className="panel-head"><h2>Downloads</h2></div>
          <div className="list">
            {downloads.map(([name, desc, run]) => (
              <div key={name} style={{ alignItems: 'center' }}>
                <span><b>{name}</b><br /><span className="small muted">{desc}</span></span>
                <button className="btn ghost sm" onClick={run}>CSV</button>
              </div>
            ))}
            <div style={{ alignItems: 'center' }}>
              <span><b>Full report</b><br /><span className="small muted">The preview below, as a PDF (use Save as PDF)</span></span>
              <button className="btn sm" onClick={() => window.print()}>Print / PDF</button>
            </div>
          </div>
        </motion.div>

        <motion.div {...reveal} className="panel">
          <div className="panel-head"><h2>Public visibility</h2><Link className="small" to="/about">View About page →</Link></div>
          <p className="small muted">Choose which figures appear on the public About page. Changes apply straight away.</p>
          <div className="list">
            {VISIBILITY_ITEMS.map(([k, label]) => (
              <div key={k} style={{ alignItems: 'center' }}>
                <label htmlFor={`vis-${k}`} style={{ margin: 0, fontWeight: 400 }}>{label}</label>
                <span className="row" style={{ gap: 'var(--s2)' }}>
                  <span className={`tag ${visibility[k] ? 't-ok' : 't-gen'}`}>{visibility[k] ? 'Public' : 'Hidden'}</span>
                  <input type="checkbox" id={`vis-${k}`} className="switch" checked={!!visibility[k]}
                    onChange={(e) => setVisibility(k, e.target.checked)} />
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ---- report preview (also what prints) ---- */}
      <motion.article {...reveal} className="panel report">
        <header className="spread">
          <div>
            <span className="eyebrow">CoffeeBot · Grounds Up</span>
            <h2 style={{ fontSize: 28 }}>Sustainability impact report</h2>
            <span className="small muted">Reporting period {period} · generated {today()}</span>
          </div>
          <img src="/coffeebot-mark.png" alt="" width="48" height="48" />
        </header>

        <section>
          <h3>1. Coffee usage</h3>
          <div className="stats">
            <div className="stat"><b className="num">{u.cups.toLocaleString()}</b><span className="lbl">Cups served</span></div>
            <div className="stat"><b className="num">{fmt(u.kg)} kg</b><span className="lbl">Grounds generated (≈20 g a cup)</span></div>
            <div className="stat"><b className="num">{t.logged} kg</b><span className="lbl">Grounds collected and logged</span></div>
            <div className="stat"><b className="num">{capturePct}%</b><span className="lbl">Capture rate</span></div>
          </div>
        </section>

        <section>
          <h3>2. Reuse and pathways</h3>
          <p className="small muted">Reuse rate is reused kg as a share of batches that have closed (reused or disposed): <b>{t.reuseRate}%</b>. {fmt(t.inProgress)} kg is still in progress.</p>
          <table style={{ minWidth: 0 }}>
            <thead><tr><th>Pathway</th><th className="r">Kg</th><th className="r">Share</th></tr></thead>
            <tbody>
              {paths.map((p) => (
                <tr key={p.name}><td>{p.name}</td><td className="r">{fmt(p.value)}</td><td className="r">{Math.round((p.value / t.logged) * 100)}%</td></tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h3>3. Education</h3>
          <p className="small muted">{edu.length} education partners, {reach.people.toLocaleString()} people reached in total, {reach.families + missionsCompleted} family members through home missions, {quizzesDone} quizzes completed on the platform this session.</p>
          <div className="scroll">
            <table style={{ minWidth: 0 }}>
              <thead><tr><th>Organisation</th><th className="r">Sessions</th><th className="r">Participants</th><th className="r">Kg reused</th><th>Activities</th></tr></thead>
              <tbody>
                {edu.map((o) => (
                  <tr key={o.org}><td>{o.org}</td><td className="r">{o.sessions}</td><td className="r">{o.people}</td><td className="r">{fmt(o.kg)}</td><td className="small">{o.acts}</td></tr>
                ))}
                <tr><td><b>Total</b></td><td className="r"><b>{bookings.length}</b></td><td className="r"><b>{edu.reduce((a, o) => a + o.people, 0)}</b></td><td className="r"><b>{fmt(eduKg)}</b></td><td /></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3>4. Reuse partners</h3>
          <table style={{ minWidth: 0 }}>
            <thead><tr><th>Partner</th><th>Type</th><th>Grounds</th><th className="r">Kg / week</th></tr></thead>
            <tbody>
              {partners.map((p) => (
                <tr key={p.name}><td>{p.name}</td><td className="small">{p.kind}</td><td className="small">{p.wet ? 'Fresh' : 'Dried'}</td><td className="r">{p.cap}</td></tr>
              ))}
            </tbody>
          </table>
        </section>

        <footer className="xs muted">
          Figures come from CoffeeBot's grounds log and booking records. Grounds generated is estimated from cups served; reuse counts only batches confirmed as Reused.
        </footer>
      </motion.article>
    </Page>
  );
}
