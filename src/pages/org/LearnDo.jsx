import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import { ACTS, COURSES } from '../../data/seed';
import { ART, Svg } from '../../data/art';
import { toCSV, downloadFile } from '../../lib/download';

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
  name: a.name, type: a.wet ? 'Wet' : 'Dry', level: COURSES[k].level, mins: COURSES[k].mins, learn: a.learn, materials: COURSES[k].materials.join('; '),
}));

export default function LearnDo() {
  const navigate = useNavigate();
  const entries = Object.entries(ACTS);

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">Courses &amp; materials</span>
        <h1>Every product is a lesson you can run</h1>
        <p>Each item made from coffee grounds links to a hands-on course for your class or team. Download the lesson plan, then book the grounds. Dry courses use dried grounds and are booked around the weather; wet courses use fresh grounds with no drying.</p>
        <button className="btn ghost sm" style={{ alignSelf: 'flex-start' }}
          onClick={() => downloadFile('coffeebot-course-list.csv', toCSV(courseRows(), [
            ['name', 'Course'], ['type', 'Grounds'], ['level', 'Level'], ['mins', 'Minutes'], ['learn', 'Learning outcome'], ['materials', 'Materials'],
          ]))}>
          Download course list (CSV)
        </button>
      </div>

      <div className="grid3">
        {entries.map(([k, v], i) => (
          <motion.div key={k} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="card">
            <div className="thumb"><Svg markup={ART[k]} /></div>
            <div className="row wrap" style={{ gap: 6 }}>
              <span className={`tag ${v.wet ? 't-wet' : 't-dry'}`}>{v.wet ? 'Wet · no drying' : 'Dried grounds'}</span>
              <span className="tag t-gen">{COURSES[k].level}</span>
              <span className="tag t-gen">{COURSES[k].mins} min</span>
            </div>
            <b>{v.name}</b>
            <span className="small muted">{v.desc}.</span>
            <span className="small" style={{ color: 'var(--brew)' }}><b>You'll learn:</b> {v.learn}</span>
            <div className="row wrap" style={{ marginTop: 'var(--s2)', gap: 'var(--s2)' }}>
              <button className="btn sm" onClick={() => navigate(`/app/book?act=${k}`)}>Book this →</button>
              <button className="btn ghost sm" onClick={() => downloadFile(`lesson-plan-${k}.txt`, lessonPlan(k), 'text/plain;charset=utf-8')}>Lesson plan</button>
            </div>
          </motion.div>
        ))}
      </div>
    </Page>
  );
}
