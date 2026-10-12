import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import Icon from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { AUDIENCE, SUSTAINABILITY, CIRCULAR, LIFECYCLE, TEACHER, CORPORATE } from '../../data/education';
import { downloadFile } from '../../lib/download';
import { Svg } from '../../data/art';
import { HUB_HERO, PILLAR_ART, MODEL_ART, STAGE_ART, CLASSROOM, OFFICE } from '../../data/hubArt';
import './hub.css';

const fade = {
  initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 },
  transition: { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] },
};

/* ---- shared building blocks: every topic uses the same skeleton ---- */

function TopicIntro({ eyebrow, lead, detail }) {
  return (
    <header className="hub-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="hub-lead">{lead}</h2>
      {detail && <p className="muted">{detail}</p>}
    </header>
  );
}

function Section({ title, note, action, children }) {
  return (
    <section className="hub-sec">
      <div className="hub-sec-head">
        <div>
          <h2>{title}</h2>
          {note && <p className="small muted">{note}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Checklist({ items }) {
  return (
    <div className="panel hub-apply">
      <ul>{items.map((t) => <li key={t}><Icon name="check" size={16} strokeWidth={3} /><span>{t}</span></li>)}</ul>
    </div>
  );
}

const InfoCards = ({ items, cols = 3 }) => (
  <div className={`grid${cols} hub-cards`}>
    {items.map(([h, t]) => <div key={h} className="card"><h3>{h}</h3><p className="small muted">{t}</p></div>)}
  </div>
);

function Sustainability({ role }) {
  const S = SUSTAINABILITY;
  return (
    <>
      <TopicIntro eyebrow="Topic 1 · Sustainability" lead={S.definition} detail={S.detail} />

      <Section title="The three dimensions" note="A choice is only sustainable when it works for all three.">
        <div className="grid3 hub-cards">
          {S.pillars.map((p) => (
            <div key={p.k} className={`card hub-pillar acc-${p.accent}`}>
              <Svg markup={PILLAR_ART[p.k]} className="hub-art" />
              <h3>{p.name}</h3>
              <p className="small">{p.what}</p>
              <p className="small hub-coffee"><b>In a cup of coffee:</b> {p.coffee}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Why it matters, every day">
        <InfoCards items={S.why} />
      </Section>

      <Section title={role === 'teacher' ? 'Bringing it into the classroom' : 'Applying it at work'}>
        <Checklist items={S.apply[role]} />
      </Section>
    </>
  );
}

function Circular({ role }) {
  const C = CIRCULAR;
  const [model, setModel] = useState('linear');
  const m = C.models[model];
  return (
    <>
      <TopicIntro eyebrow="Topic 2 · Circular economy" lead={C.definition} />

      <Section title="Linear or circular?" note="Switch between the two to compare."
        action={(
          <div className="subnav" role="tablist" aria-label="Economy model" style={{ margin: 0 }}>
            {Object.entries(C.models).map(([k, v]) => (
              <button key={k} role="tab" aria-selected={model === k} onClick={() => setModel(k)}>{v.label}</button>
            ))}
          </div>
        )}>
        <div className="panel">
          <AnimatePresence mode="wait">
            <motion.div key={model} {...fade} className="stack" style={{ gap: 'var(--s3)' }}>
              <Svg markup={MODEL_ART[model]} className="hub-art" />
              <ol className={`flow ${model}`} aria-label={`${m.label} model: ${m.steps.join(', then ')}${model === 'circular' ? ', then back to the start' : ''}`}>
                {m.steps.map((st, i) => (
                  <motion.li key={st} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 * i, duration: 0.25 }}>
                    {st}
                  </motion.li>
                ))}
              </ol>
              {model === 'circular' && <div className="flow-return" aria-hidden="true"><span>back into use</span></div>}
              <p>{m.text}</p>
              <p className="small hub-coffee"><b>With coffee:</b> {m.coffee}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </Section>

      <Section title="Four principles">
        <div className="grid2 hub-cards">
          {C.principles.map((p) => (
            <div key={p.name} className="card">
              <div className="row"><span className="hub-ico sm"><Icon name={p.icon} size={20} /></span><h3>{p.name}</h3></div>
              <p className="small">{p.text}</p>
              <p className="small hub-coffee"><b>With coffee:</b> {p.coffee}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="What used coffee grounds can become">
        <div className="panel">
          <div className="list">
            {C.grounds.map(([h, t]) => <div key={h} className="hub-row"><b>{h}</b><span className="small muted">{t}</span></div>)}
          </div>
          <p className="small hub-note">{C.groundsNote}</p>
        </div>
      </Section>

      <Section title={role === 'teacher' ? 'Where students can see it' : 'Where it applies in a business'}>
        <InfoCards items={C.apply[role]} />
      </Section>
    </>
  );
}

function Lifecycle() {
  const [i, setI] = useState(0);
  const s = LIFECYCLE[i];
  const last = LIFECYCLE.length - 1;
  return (
    <>
      <TopicIntro eyebrow="Topic 3 · Life of a coffee bean"
        lead="A coffee bean passes through seven stages, from the farm to your cup and beyond."
        detail="Pick a stage to see what it uses, where waste appears and how the loop could close." />

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
            <div className="stage-head">
              <div>
                <span className="eyebrow">Stage {i + 1} of {LIFECYCLE.length}</span>
                <h2 className="stage-title">{s.name}</h2>
                <p>{s.what}</p>
              </div>
              <Svg markup={STAGE_ART[i]} className="hub-art" />
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
          <button className="btn ghost sm" disabled={i === 0} onClick={() => setI(i - 1)}>← Previous stage</button>
          <button className="btn sm" disabled={i === last} onClick={() => setI(i + 1)}>Next stage →</button>
        </div>
      </div>
    </>
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
    <>
      <TopicIntro eyebrow="For your classroom"
        lead="Ready-to-run activities and questions for a lesson on coffee and waste."
        detail="Use them after any of the three topics, or on their own." />
      <Svg markup={CLASSROOM} className="hub-art hub-banner" />

      <Section title="Short classroom activities"
        action={(
          <button className="btn ghost sm" onClick={() => downloadFile('coffeebot-discussion-sheet.txt', teacherSheet(), 'text/plain;charset=utf-8')}>
            Download discussion sheet
          </button>
        )}>
        <div className="grid3 hub-cards">
          {TEACHER.activities.map((a) => (
            <div key={a.title} className="card">
              <div className="row wrap" style={{ gap: 6 }}><span className="tag t-gen">{a.level}</span><span className="tag t-gen">{a.mins} min</span></div>
              <h3>{a.title}</h3>
              <p className="small muted">{a.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Discussion questions" note="Open a question to see a note on where to steer the conversation.">
        <div className="panel qa">
          {TEACHER.questions.map(([q, note], i) => (
            <div key={q} className="qa-item">
              <button aria-expanded={open === i} aria-controls={`qa-${i}`} onClick={() => setOpen(open === i ? null : i)}>
                <span>{q}</span><span className="qa-sign" aria-hidden="true">{open === i ? '–' : '+'}</span>
              </button>
              {open === i && <p id={`qa-${i}`} className="small"><b>Teacher note:</b> {note}</p>}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Helping students understand">
        <Checklist items={TEACHER.tips} />
      </Section>

      <TakeItFurther text="Hands-on courses come with a lesson plan and the grounds to run them. Quizzes work well as a starter or a recap."
        primary={['/app/learn', 'Browse hands-on courses']} />
    </>
  );
}

function TakeItFurther({ text, primary }) {
  return (
    <div className="panel hub-next">
      <h2>Take it further</h2>
      <p className="muted small">{text}</p>
      <div className="row wrap">
        <Link className="btn" to={primary[0]}>{primary[1]}</Link>
        <Link className="btn ghost" to="/app/play">Open quizzes &amp; missions</Link>
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
    <>
      <TopicIntro eyebrow="For your workplace"
        lead="Practical steps for a more sustainable workplace, starting at the pantry."
        detail="Try the scenarios with your team, then pick a first step." />
      <Svg markup={OFFICE} className="hub-art hub-banner" />

      <Section title="Workplace sustainability practices">
        <InfoCards items={CORPORATE.practices} cols={2} />
      </Section>

      <Section title="Workplace scenarios" note="Illustrative situations, not real companies. Choose what you would do.">
        <div className="grid3 hub-cards">{CORPORATE.scenarios.map((sc) => <Scenario key={sc.title} s={sc} />)}</div>
      </Section>

      <Section title="A first month, step by step">
        <Checklist items={CORPORATE.actions} />
      </Section>

      <TakeItFurther text="Book a hands-on session for your team, or run a quiz at your next meeting."
        primary={['/app/learn', 'Browse team activities']} />
    </>
  );
}

export default function EducationHub() {
  const role = useStore((s) => s.user.role);
  const A = AUDIENCE[role];
  const [tab, setTab] = useState(0);
  const tabsRef = useRef(null);
  const TABS = [
    ['Sustainability', 'What it means'],
    ['Circular economy', 'Linear vs circular'],
    ['Life of a coffee bean', 'Seven stages'],
    [A.tab, role === 'teacher' ? 'Activities & questions' : 'Practices & scenarios'],
  ];
  const TOPICS = [
    <Sustainability role={role} />,
    <Circular role={role} />,
    <Lifecycle />,
    role === 'teacher' ? <ForTeachers /> : <ForCorporate />,
  ];

  const go = (i) => {
    setTab(i);
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">{A.eyebrow}</span>
        <h1>{A.title}</h1>
        <p>{A.intro}</p>
      </div>

      <Svg markup={HUB_HERO} className="hub-art hub-banner hub-hero" />

      <div className="hub-tabs" role="tablist" aria-label="Education Hub topics" ref={tabsRef}>
        {TABS.map(([label, sub], i) => (
          <button key={label} role="tab" aria-selected={tab === i} className="hub-tab" onClick={() => setTab(i)}>
            <span className="n">{i < 3 ? i + 1 : <Icon name={role === 'teacher' ? 'book' : 'users'} size={15} />}</span>
            <span><b>{label}</b><small>{sub}</small></span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} {...fade} className="hub-topic">
          {TOPICS[tab]}

          <nav className="hub-foot" aria-label="Topic navigation">
            {tab > 0 ? (
              <button className="btn ghost sm" onClick={() => go(tab - 1)}>← {TABS[tab - 1][0]}</button>
            ) : <span />}
            {tab < TABS.length - 1 && (
              <button className="hub-upnext" onClick={() => go(tab + 1)}>
                <small>Up next</small>
                <b>{TABS[tab + 1][0]} →</b>
              </button>
            )}
          </nav>
        </motion.div>
      </AnimatePresence>
    </Page>
  );
}
