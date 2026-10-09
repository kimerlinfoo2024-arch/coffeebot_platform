import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import { useStore } from '../../store/useStore';
import { ACTS, WEEKS } from '../../data/seed';
import { Donut, Ring } from '../../components/ui/charts';
import { toCSV, downloadFile } from '../../lib/download';

const ACT_COLOR = { scrub: 'var(--brew)', soap: 'var(--amber)', candle: 'var(--teal)', planter: 'var(--leaf)', compost: 'var(--bad)', seeds: '#8A6A4A' };

const reveal = {
  initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' }, transition: { duration: 0.4 },
};

export default function Dashboard() {
  const user = useStore((s) => s.user);
  const bookings = useStore((s) => s.bookings);
  const quizzesDone = useStore((s) => s.quizzesDone);
  const missionsAssigned = useStore((s) => s.missionsAssigned);

  const mine = bookings.filter((b) => b.org === user.org);
  const people = mine.reduce((a, b) => a + b.people, 0);
  const kg = mine.reduce((a, b) => a + b.kg, 0);
  const next = [...mine].sort((a, b) => a.week - b.week)[0];

  const byAct = {};
  mine.forEach((b) => { byAct[b.act] = (byAct[b.act] || 0) + b.kg; });
  const donut = Object.entries(byAct).map(([k, v]) => ({ name: ACTS[k].name, value: v, color: ACT_COLOR[k] || 'var(--brew)' }));
  const engagement = quizzesDone + missionsAssigned;

  const record = [...mine].sort((a, b) => a.week - b.week).map((b) => ({
    id: b.id, week: WEEKS[b.week].w, course: ACTS[b.act].name,
    grounds: ACTS[b.act].wet ? 'Fresh (wet)' : 'Dried', people: b.people, kg: b.kg,
  }));
  const exportRecord = () => downloadFile(`${user.org.toLowerCase().replace(/\W+/g, '-')}-reuse-record.csv`, toCSV(record, [
    ['week', 'Week of'], ['course', 'Course'], ['grounds', 'Grounds'], ['people', 'Participants'], ['kg', 'Kg reused'],
  ]));

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">Education partner · {user.org}</span>
        <h1>Welcome back, {user.name}</h1>
        <p>Everything your group does here — booking activities, running quizzes, logging missions — feeds CoffeeBot's live impact figures.</p>
      </div>

      <motion.div {...reveal} className="stats">
        <div className="stat lead"><b className="num">{kg} kg</b><span className="lbl">Grounds your group has put to use</span></div>
        <div className="stat"><b className="num">{people}</b><span className="lbl">People in your booked activities</span></div>
        <div className="stat"><b className="num">{quizzesDone}</b><span className="lbl">Quizzes completed</span></div>
        <div className="stat"><b className="num">{missionsAssigned}</b><span className="lbl">Home missions assigned</span></div>
      </motion.div>

      <div className="grid2" style={{ marginTop: 'var(--s5)' }}>
        <motion.div {...reveal} className="panel">
          <div className="panel-head"><h2>Your grounds by activity</h2><span className="small muted">{kg} kg total</span></div>
          {donut.length ? (
            <Donut segments={donut} centerLabel={`${kg}`} centerSub="kg used" />
          ) : (
            <p className="muted">Book an activity to see your grounds breakdown here.</p>
          )}
        </motion.div>
        <motion.div {...reveal} className="panel" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h2 style={{ alignSelf: 'flex-start' }}>Learning engagement</h2>
          <Ring value={engagement} max={10} label={engagement} sub="done" color="var(--teal)" />
          <p className="small muted">Quizzes and missions your group has run — every one adds to CoffeeBot's reach.</p>
        </motion.div>
      </div>

      <motion.div {...reveal} className="panel" style={{ marginTop: 'var(--s5)' }}>
        <div className="panel-head">
          <h2>Your education reuse record</h2>
          <button className="btn ghost sm" disabled={!mine.length} onClick={exportRecord}>Download CSV</button>
        </div>
        <p className="small muted">Every session your group has booked, with the participants and grounds behind it. Use it for your school's sustainability or CCA reporting.</p>
        {mine.length ? (
          <div className="scroll">
            <table style={{ minWidth: 560 }}>
              <thead><tr><th>Week</th><th>Course</th><th>Grounds</th><th className="r">Participants</th><th className="r">Kg reused</th></tr></thead>
              <tbody>
                {record.map((r) => (
                  <tr key={r.id}><td>{r.week}</td><td>{r.course}</td><td className="small">{r.grounds}</td><td className="r">{r.people}</td><td className="r">{r.kg}</td></tr>
                ))}
                <tr><td colSpan={3}><b>Total</b></td><td className="r"><b>{people}</b></td><td className="r"><b>{kg}</b></td></tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">No sessions yet — your record starts with your first booking.</p>
        )}
      </motion.div>

      <div className="grid2" style={{ marginTop: 'var(--s5)' }}>
        <motion.div {...reveal} className="panel">
          <div className="panel-head"><h2>Next up</h2><Link className="small" to="/app/bookings">All bookings →</Link></div>
          {next ? (
            <div className="card soft">
              <div className="spread"><b>{ACTS[next.act].name}</b><span className={`tag ${ACTS[next.act].wet ? 't-wet' : 't-dry'}`}>{ACTS[next.act].wet ? 'Wet' : 'Dry'}</span></div>
              <span className="small muted">{next.people} people · {next.kg} kg kit · week of {WEEKS[next.week].w}</span>
            </div>
          ) : (
            <p className="muted">No bookings yet. Pick an activity and choose a week to get started.</p>
          )}
          <Link className="btn" to="/app/book">Book an activity</Link>
        </motion.div>

        <motion.div {...reveal} className="panel">
          <h2>Keep learning</h2>
          <p className="muted small">Free for your group, any time — and each one adds to CoffeeBot's reach.</p>
          <div className="row wrap">
            <Link className="btn ghost" to="/app/play">Play a quiz</Link>
            <Link className="btn ghost" to="/app/play">Assign a home mission</Link>
            <Link className="btn ghost" to="/app/learn">Browse courses</Link>
          </div>
        </motion.div>
      </div>
    </Page>
  );
}
