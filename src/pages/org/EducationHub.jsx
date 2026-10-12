import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import Icon from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { AUDIENCE, SUSTAINABILITY, CIRCULAR, LIFECYCLE, TEACHER, CORPORATE } from '../../data/education';
import { downloadFile } from '../../lib/download';
import './hub.css';

const fade = {
  initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 },
  transition: { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] },
};

function ApplyList({ title, items }) {
  return (
    <div className="panel hub-apply">
      <h2>{title}</h2>
      <ul>{items.map((t) => <li key={t}><Icon name="check" size={16} strokeWidth={3} /><span>{t}</span></li>)}</ul>
    </div>
  );
}

function Sustainability({ role }) {
  const S = SUSTAINABILITY;
  return (
    <div className="stack">
      <div className="hub-def">
        <span className="eyebrow">What it means</span>
        <p className="hub-lead">{S.definition}</p>
        <p className="muted">{S.detail}</p>
      </div>

      <h2>The three dimensions</h2>
      <div className="grid3">
        {S.pillars.map((p) => (
          <div key={p.k} className={`card hub-pillar acc-${p.accent}`}>
            <span className="hub-ico"><Icon name={p.icon} size={26} /></span>
            <h3>{p.name}</h3>
            <p className="small">{p.what}</p>
            <p className="small hub-coffee"><b>In a cup of coffee:</b> {p.coffee}</p>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>Why it matters, every day</h2>
        <div className="grid3">
          {S.why.map(([h, t]) => <div key={h} className="card soft"><h3>{h}</h3><p className="small muted">{t}</p></div>)}
        </div>
      </div>

      <ApplyList title={role === 'teacher' ? 'Bringing it into the classroom' : 'Applying it at work'} items={S.apply[role]} />
    </div>
  );
}

function Circular({ role }) {
  const C = CIRCULAR;
  const [model, setModel] = useState('linear');
  const m = C.models[model];
  return (
    <div className="stack">
      <div className="hub-def">
        <span className="eyebrow">What it means</span>
        <p className="hub-lead">{C.definition}</p>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Linear or circular?</h2>
          <div className="subnav" role="tablist" aria-label="Economy model" style={{ margin: 0 }}>
            {Object.entries(C.models).map(([k, v]) => (
              <button key={k} role="tab" aria-selected={model === k} onClick={() => setModel(k)}>{v.label}</button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={model} {...fade} className="stack" style={{ gap: 'var(--s3)' }}>
            <ol className={`flow ${model}`} aria-label={`${m.label} model: ${m.steps.join(', then ')}${model === 'circular' ? ', then back to the start' : ''}`}>
              {m.steps.map((s, i) => (
                <motion.li key={s} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 * i, duration: 0.25 }}>
                  {s}
                </motion.li>
              ))}
            </ol>
            {model === 'circular' && <div className="flow-return" aria-hidden="true"><span>back into use</span></div>}
            <p>{m.text}</p>
            <p className="small hub-coffee"><b>With coffee:</b> {m.coffee}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <h2>Four principles</h2>
      <div className="grid2 hub-principles">
        {C.principles.map((p) => (
          <div key={p.name} className="card">
            <div className="row"><span className="hub-ico sm"><Icon name={p.icon} size={20} /></span><h3>{p.name}</h3></div>
            <p className="small">{p.text}</p>
            <p className="small hub-coffee"><b>With coffee:</b> {p.coffee}</p>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>What used coffee grounds can become</h2>
        <div className="list">
          {C.grounds.map(([h, t]) => <div key={h} className="hub-row"><b>{h}</b><span className="small muted">{t}</span></div>)}
        </div>
        <p className="small hub-note">{C.groundsNote}</p>
      </div>

      <div className="panel">
        <h2>{role === 'teacher' ? 'Where students can see it' : 'Where it applies in a business'}</h2>
        <div className="grid3">
          {C.apply[role].map(([h, t]) => <div key={h} className="card soft"><h3>{h}</h3><p className="small muted">{t}</p></div>)}
        </div>
      </div>
    </div>
  );
}

function Lifecycle() {
  const [i, setI] = useState(0);
  const s = LIFECYCLE[i];
  const last = LIFECYCLE.length - 1;
  return (
    <div className="stack">
      <div className="hub-def">
        <span className="eyebrow">From farm to cup, and after</span>
        <p className="hub-lead">A coffee bean passes through seven stages. Pick a stage to see what it uses, where waste appears and how the loop could close.</p>
      </div>

      <div className="panel">
        <ol className="journey-steps">
          {LIFECYCLE.map((st, idx) => (
            <li key={st.name} className={idx < i ? 'done' : ''}>
              <button aria-current={idx === i ? 'step' : undefined} onClick={() => setI(idx)}>
                <span className="dot"><Icon name={st.icon} size={18} /></span>
                <span className="lbl">{idx + 1}. {st.name}</span>
              </button>
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div key={i} {...fade} className="stage">
            <div>
              <span className="eyebrow">Stage {i + 1} of {LIFECYCLE.length}</span>
              <h2 className="stage-title">{s.name}</h2>
              <p>{s.what}</p>
            </div>
            <div className="stage-grid">
              <div className="card soft">
                <h3>What it uses</h3>
                <div className="row wrap" style={{ gap: 6 }}>{s.uses.map((u) => <span key={u} className="tag t-gen">{u}</span>)}</div>
              </div>
              <div className="card soft"><h3>Possible impact</h3><p className="small">{s.impact}</p></div>
              <div className="card stage-waste"><h3>Waste at this stage</h3><p className="small">{s.waste}</p></div>
              <div className="card stage-loop"><h3>Closing the loop</h3><p className="small">{s.circular}</p></div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="spread">
          <button className="btn ghost sm" disabled={i === 0} onClick={() => setI(i - 1)}>← Previous</button>
          <button className="btn sm" disabled={i === last} onClick={() => setI(i + 1)}>Next stage →</button>
        </div>
      </div>
    </div>
  );
}

function teacherSheet() {
  return [
    'CoffeeBot · Grounds Up — Classroom discussion sheet', '',
    'DISCUSSION QUESTIONS',
    ...TEACHER.questions.flatMap(([q, note], i) => [`${i + 1}. ${q}`, `   Teacher note: ${note}`, '']),
    'SHORT ACTIVITIES',
    ...TEACHER.activities.flatMap((a) => [`- ${a.title} (${a.level}, ${a.mins} min)`, `  ${a.text}`, '']),
    'FACILITATION TIPS',
    ...TEACHER.tips.map((t) => `- ${t}`),
  ].join('\n');
}

function ForTeachers() {
  const [open, setOpen] = useState(null);
  return (
    <div className="stack">
      <div className="panel">
        <div className="panel-head">
          <h2>Short classroom activities</h2>
          <button className="btn ghost sm" onClick={() => downloadFile('coffeebot-discussion-sheet.txt', teacherSheet(), 'text/plain;charset=utf-8')}>
            Download discussion sheet
          </button>
        </div>
        <div className="grid3">
          {TEACHER.activities.map((a) => (
            <div key={a.title} className="card soft">
              <div className="row wrap" style={{ gap: 6 }}><span className="tag t-gen">{a.level}</span><span className="tag t-gen">{a.mins} min</span></div>
              <h3>{a.title}</h3>
              <p className="small muted">{a.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Discussion questions</h2>
        <p className="small muted">Open a question to see a note on where to steer the conversation.</p>
        <div className="qa">
          {TEACHER.questions.map(([q, note], i) => (
            <div key={q} className="qa-item">
              <button aria-expanded={open === i} aria-controls={`qa-${i}`} onClick={() => setOpen(open === i ? null : i)}>
                <span>{q}</span><span className="qa-sign" aria-hidden="true">{open === i ? '–' : '+'}</span>
              </button>
              {open === i && <p id={`qa-${i}`} className="small"><b>Teacher note:</b> {note}</p>}
            </div>
          ))}
        </div>
      </div>

      <ApplyList title="Helping students understand" items={TEACHER.tips} />

      <div className="panel hub-next">
        <h2>Take it further</h2>
        <p className="muted small">Hands-on courses come with a lesson plan and the grounds to run them. Quizzes work well as a starter or a recap.</p>
        <div className="row wrap">
          <Link className="btn" to="/app/learn">Browse hands-on courses</Link>
          <Link className="btn ghost" to="/app/play">Open quizzes &amp; missions</Link>
        </div>
      </div>
    </div>
  );
}

function Scenario({ s }) {
  const [pick, setPick] = useState(null);
  return (
    <div className="card scenario">
      <h3>{s.title}</h3>
      <p className="small">{s.text}</p>
      <div className="stack" style={{ gap: 'var(--s2)' }}>
        {s.options.map(([label, right, why], i) => (
          <div key={label}>
            <button className="opt" data-state={pick === i ? (right ? 'right' : 'wrong') : undefined} aria-pressed={pick === i} onClick={() => setPick(i)}>
              {label}
            </button>
            {pick === i && <p className="small scenario-why" role="status"><b>{right ? 'Good call.' : 'Not quite.'}</b> {why}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ForCorporate() {
  return (
    <div className="stack">
      <div className="panel">
        <h2>Workplace sustainability practices</h2>
        <div className="grid2">
          {CORPORATE.practices.map(([h, t]) => <div key={h} className="card soft"><h3>{h}</h3><p className="small muted">{t}</p></div>)}
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: 'var(--s2)' }}>Workplace scenarios</h2>
        <p className="small muted" style={{ marginBottom: 'var(--s3)' }}>Illustrative situations, not real companies. Choose what you would do.</p>
        <div className="grid3">{CORPORATE.scenarios.map((s) => <Scenario key={s.title} s={s} />)}</div>
      </div>

      <ApplyList title="A first month, step by step" items={CORPORATE.actions} />

      <div className="panel hub-next">
        <h2>Take it further</h2>
        <p className="muted small">Book a hands-on session for your team, or run a quiz at your next meeting.</p>
        <div className="row wrap">
          <Link className="btn" to="/app/learn">Browse team activities</Link>
          <Link className="btn ghost" to="/app/play">Open quizzes &amp; missions</Link>
        </div>
      </div>
    </div>
  );
}

export default function EducationHub() {
  const role = useStore((s) => s.user.role);
  const A = AUDIENCE[role];
  const [tab, setTab] = useState('sus');
  const TABS = [
    ['sus', 'Sustainability'],
    ['circ', 'Circular economy'],
    ['life', 'Life of a coffee bean'],
    ['you', A.tab],
  ];

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">{A.eyebrow}</span>
        <h1>{A.title}</h1>
        <p>{A.intro}</p>
      </div>

      <div className="subnav" role="tablist" aria-label="Education Hub topics">
        {TABS.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} {...fade}>
          {tab === 'sus' && <Sustainability role={role} />}
          {tab === 'circ' && <Circular role={role} />}
          {tab === 'life' && <Lifecycle />}
          {tab === 'you' && (role === 'teacher' ? <ForTeachers /> : <ForCorporate />)}
        </motion.div>
      </AnimatePresence>
    </Page>
  );
}
