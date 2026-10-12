import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import Icon from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { ACTS, WEEKS } from '../../data/seed';
import { Donut, Ring } from '../../components/ui/charts';
import { toCSV, downloadFile } from '../../lib/download';
import './dashboard.css';

const ACT_COLOR = { scrub: 'var(--brew)', soap: 'var(--amber)', candle: 'var(--teal)', planter: 'var(--leaf)', compost: 'var(--bad)', seeds: '#8A6A4A' };
const ENGAGEMENT_GOAL = 10;

const reveal = {
  initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' }, transition: { duration: 0.4 },
};

export default function Dashboard() {
  const user = useStore((s) => s.user);
  const bookings = useStore((s) => s.bookings);
  const quizzesDone = useStore((s) => s.quizzesDone);
  const missionsAssigned = useStore((s) => s.missionsAssigned);
  const teacher = user.role === 'teacher';

  const mine = [...bookings.filter((b) => b.org === user.org)].sort((a, b) => a.week - b.week);
  const people = mine.reduce((a, b) => a + b.people, 0);
  const kg = mine.reduce((a, b) => a + b.kg, 0);
  const next = mine[0];

  const byAct = {};
  mine.forEach((b) => { byAct[b.act] = (byAct[b.act] || 0) + b.kg; });
  const donut = Object.entries(byAct).map(([k, v]) => ({ name: ACTS[k].name, value: v, color: ACT_COLOR[k] || 'var(--brew)' }));
  const engagement = quizzesDone + missionsAssigned;

  const record = mine.map((b) => ({
    id: b.id, week: WEEKS[b.week].w, course: ACTS[b.act].name,
    grounds: ACTS[b.act].wet ? 'Fresh (wet)' : 'Dried', people: b.people, kg: b.kg,
  }));
  const exportRecord = () => downloadFile(`${user.org.toLowerCase().replace(/\W+/g, '-')}-reuse-record.csv`, toCSV(record, [
    ['week', 'Week of'], ['course', 'Course'], ['grounds', 'Grounds'], ['people', 'Participants'], ['kg', 'Kg reused'],
  ]));

  const learnLinks = [
    { to: '/app/hub', icon: 'book', title: 'Education Hub', text: teacher ? 'Sustainability topics with classroom resources' : 'Sustainability topics with workplace scenarios' },
    { to: '/app/play', icon: 'award', title: 'Quizzes & missions', text: 'Run a quiz or send a mission home' },
    { to: '/app/learn', icon: 'leaf', title: 'Browse courses', text: 'Hands-on activities made from grounds' },
  ];

  return (
    <Page>
      <div className="pagehead db-head">
        <div className="stack db-head-text">
          <span className="eyebrow">{teacher ? 'Teacher dashboard' : 'Corporate dashboard'} · {user.org}</span>
          <h1>Welcome back, {user.name}</h1>
          <p>Everything your group does here — booking activities, running quizzes, logging missions — feeds CoffeeBot's live impact figures.</p>
        </div>
        <Link className="btn" to="/app/book">Book an activity <Icon name="arrowRight" size={16} /></Link>
      </div>

      <div className="stack db">
        <motion.div {...reveal} className="stats">
          <div className="stat lead"><b className="num">{kg} kg</b><span className="lbl">Grounds your group has put to use</span></div>
          <div className="stat"><b className="num">{people}</b><span className="lbl">People in your booked activities</span></div>
          <div className="stat"><b className="num">{quizzesDone}</b><span className="lbl">Quizzes completed</span></div>
          <div className="stat"><b className="num">{missionsAssigned}</b><span className="lbl">Home missions assigned</span></div>
        </motion.div>

        <section>
          <div className="spread db-sec-head">
            <h2>Coming up</h2>
            <Link className="small" to="/app/bookings">All bookings →</Link>
          </div>
          <div className="grid2 db-row">
            <motion.div {...reveal} className="panel">
              <div className="panel-head"><h3>Next session</h3>{next && <span className="small muted">{mine.length} booked</span>}</div>
              {next ? (
                <div className="db-next">
                  <div className="db-date"><span className="xs">Week of</span><b>{WEEKS[next.week].w}</b></div>
                  <div className="stack db-next-body">
                    <div className="spread"><b>{ACTS[next.act].name}</b><span className={`tag ${ACTS[next.act].wet ? 't-wet' : 't-dry'}`}>{ACTS[next.act].wet ? 'Wet' : 'Dry'}</span></div>
                    <span className="small muted">{ACTS[next.act].desc}</span>
                  </div>
                </div>
              ) : (
                <p className="muted">No bookings yet. Pick an activity and choose a week to get started.</p>
              )}
              <div className="db-foot">
                {next ? (
                  <>
                    <span><b className="num">{next.people}</b> people</span>
                    <span><b className="num">{next.kg} kg</b> kit</span>
                  </>
                ) : (
                  <Link className="btn sm" to="/app/book">Book an activity</Link>
                )}
              </div>
            </motion.div>

            <motion.div {...reveal} className="panel">
              <div className="panel-head"><h3>Keep learning</h3></div>
              <nav className="db-links" aria-label="Learning resources">
                {learnLinks.map((l) => (
                  <Link key={l.to} to={l.to} className="db-link">
                    <span className="db-link-icon"><Icon name={l.icon} size={18} /></span>
                    <span className="db-link-text"><b>{l.title}</b><span className="small muted">{l.text}</span></span>
                    <Icon name="arrowRight" size={16} className="db-link-arrow" />
                  </Link>
                ))}
              </nav>
            </motion.div>
          </div>
        </section>

        <section>
          <div className="spread db-sec-head"><h2>Your impact</h2></div>
          <div className="grid2 db-row">
            <motion.div {...reveal} className="panel">
              <div className="panel-head"><h3>Grounds by activity</h3><span className="small muted">kg used</span></div>
              {donut.length ? (
                <Donut segments={donut} centerLabel={`${kg}`} centerSub="kg used" />
              ) : (
                <p className="muted">Book an activity to see your grounds breakdown here.</p>
              )}
              <div className="db-foot">
                <span><b className="num">{mine.length}</b> sessions</span>
                <span><b className="num">{donut.length}</b> activity types</span>
              </div>
            </motion.div>

            <motion.div {...reveal} className="panel">
              <div className="panel-head"><h3>Learning engagement</h3><span className="small muted">goal of {ENGAGEMENT_GOAL}</span></div>
              <div className="db-ring">
                <Ring value={engagement} max={ENGAGEMENT_GOAL} label={engagement} sub="done" color="var(--teal)" />
                <p className="small muted">Quizzes and missions your group has run — every one adds to CoffeeBot's reach.</p>
              </div>
              <div className="db-foot">
                <span><b className="num">{quizzesDone}</b> quizzes</span>
                <span><b className="num">{missionsAssigned}</b> missions</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section>
          <div className="spread db-sec-head">
            <h2>Reuse record</h2>
            <button className="btn ghost sm" disabled={!mine.length} onClick={exportRecord}>Download CSV</button>
          </div>
          <motion.div {...reveal} className="panel">
            <p className="small muted">Every session your group has booked, with the participants and grounds behind it. {teacher ? "Use it for your school's sustainability or CCA reporting." : "Use it for your organisation's sustainability reporting."}</p>
            {mine.length ? (
              <div className="scroll">
                <table className="db-table">
                  <thead><tr><th>Week</th><th>Course</th><th>Grounds</th><th className="r">Participants</th><th className="r">Kg reused</th></tr></thead>
                  <tbody>
                    {record.map((r) => (
                      <tr key={r.id}><td>{r.week}</td><td>{r.course}</td><td className="small">{r.grounds}</td><td className="r">{r.people}</td><td className="r">{r.kg}</td></tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr><td colSpan={3}>Total</td><td className="r">{people}</td><td className="r">{kg}</td></tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="muted">No sessions yet — your record starts with your first booking.</p>
            )}
          </motion.div>
        </section>
      </div>
    </Page>
  );
}
