import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import Icon from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { ACTS, COURSES } from '../../data/seed';
import { COURSE_PRICES, COURSE_FIT, PURCHASE_INCLUDES, PRICES_ARE_PLACEHOLDERS, money } from '../../data/pricing';
import { ART, Svg } from '../../data/art';
import { toCSV, downloadFile } from '../../lib/download';
import './courses.css';

const reveal = {
  initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' }, transition: { duration: 0.4 },
};

/** plain-text lesson plan a teacher can print or paste into their own notes */
function lessonPlan(k) {
  const a = ACTS[k];
  const c = COURSES[k];
  return [
    `CoffeeBot · Grounds Up — Lesson plan`,
    ``,
    a.name.toUpperCase(),
    `${c.level} · ${c.mins} minutes · ${a.wet ? 'Fresh (wet) grounds, no drying' : 'Dried grounds'}${a.grams ? ` · about ${a.grams} g per item` : ''}`,
    ``,
    `LEARNING OUTCOME`,
    a.learn,
    ``,
    `MATERIALS`,
    ...c.materials.map((m) => `- ${m}`),
    ``,
    `STEPS`,
    ...c.steps.map((s, i) => `${i + 1}. ${s}`),
    ``,
    `AFTER THE SESSION`,
    `Log your session in Grounds Up so the grounds your group reused count towards CoffeeBot's impact figures.`,
  ].join('\n');
}

const courseRows = () => Object.entries(ACTS).map(([k, a]) => ({
  name: a.name, price: money(COURSE_PRICES[k]), type: a.wet ? 'Wet' : 'Dry', level: COURSES[k].level, mins: COURSES[k].mins, learn: a.learn, materials: COURSES[k].materials.join('; '),
}));

export default function LearnDo() {
  const user = useStore((s) => s.user);
  const cart = useStore((s) => s.carts[s.user.email]) || [];
  const owned = useStore((s) => s.purchases[s.user.orgId]) || [];
  const addToCart = useStore((s) => s.addToCart);
  const teacher = user.role === 'teacher';
  const fit = COURSE_FIT[user.role];

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">Paid courses</span>
        <h1>{teacher ? 'Hands-on courses for your class' : 'Hands-on courses for your team'}</h1>
        <p>
          Each course is a guided, hands-on session built around used coffee grounds. Buy a course once for {user.org}, then
          book sessions for it whenever you need. {teacher
            ? 'Every course comes with a lesson plan and a clear learning outcome for students.'
            : 'Every course links a practical activity to a workplace sustainability idea.'}
        </p>
        <div className="row wrap">
          <button className="btn ghost sm"
            onClick={() => downloadFile('coffeebot-course-list.csv', toCSV(courseRows(), [
              ['name', 'Course'], ['price', 'Price'], ['type', 'Grounds'], ['level', 'Level'], ['mins', 'Minutes'], ['learn', 'Learning outcome'], ['materials', 'Materials'],
            ]))}>
            Download course list (CSV)
          </button>
          <span className="small muted">Looking for something free? The <Link to="/app/hub">Education Hub</Link> and <Link to="/app/play">quizzes</Link> are included with your account.</span>
        </div>
        {PRICES_ARE_PLACEHOLDERS && <p className="price-note">Prices shown are placeholders and will be confirmed by CoffeeBot.</p>}
      </div>

      <div className="grid3 course-grid">
        {Object.entries(ACTS).map(([k, v], i) => {
          const c = COURSES[k];
          const isOwned = owned.includes(k);
          const inCart = cart.includes(k);
          return (
            <motion.article key={k} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="card course">
              <div className="thumb">
                <Svg markup={ART[k]} />
                <span className={`course-flag ${isOwned ? 'owned' : ''}`}>{isOwned ? 'Purchased' : 'Paid course'}</span>
              </div>
              <h2>{v.name}</h2>
              <p className="small">{fit[k]}</p>
              <div className="row wrap" style={{ gap: 6 }}>
                <span className="tag t-gen">{c.mins} min</span>
                {teacher && <span className="tag t-gen">{c.level}</span>}
                <span className={`tag ${v.wet ? 't-wet' : 't-dry'}`}>{v.wet ? 'Fresh grounds' : 'Dried grounds'}</span>
              </div>

              <dl className="course-facts">
                <div><dt>You'll learn</dt><dd>{v.learn}</dd></div>
                <div><dt>For</dt><dd>{fit.audience}</dd></div>
              </dl>

              <details className="course-more">
                <summary>What the session covers</summary>
                <ol>{c.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                <b className="small">Materials</b>
                <ul>{c.materials.map((m) => <li key={m}>{m}</li>)}</ul>
                <b className="small">Your purchase includes</b>
                <ul>{PURCHASE_INCLUDES.map((m) => <li key={m}>{m}</li>)}</ul>
              </details>

              <div className="course-buy">
                {isOwned ? (
                  <>
                    <Link className="btn sm" to={`/app/book?act=${k}`}>Book a session →</Link>
                    <button className="btn ghost sm" onClick={() => downloadFile(`lesson-plan-${k}.txt`, lessonPlan(k), 'text/plain;charset=utf-8')}>Lesson plan</button>
                  </>
                ) : (
                  <>
                    <div className="course-price"><b>{money(COURSE_PRICES[k])}</b><span>one-time, per organisation</span></div>
                    {inCart ? (
                      <Link className="btn ghost sm" to="/app/cart"><Icon name="check" size={14} strokeWidth={3} /> In cart · View</Link>
                    ) : (
                      <button className="btn sm" onClick={() => addToCart(k)}>Add to cart</button>
                    )}
                  </>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </Page>
  );
}
