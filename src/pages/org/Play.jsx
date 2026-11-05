import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import Icon from '../../components/ui/Icon';
import QuizPlayer from '../../components/ui/QuizPlayer';
import { useStore } from '../../store/useStore';
import { QUIZZES, MISSIONS } from '../../data/seed';
import './play.css';

/* Teachers (and workplace leads) don't play here: they hand quizzes and home
   missions to a class or team and share a link. Students play from that link
   on their own devices (pages/public/StudentPlay.jsx) and results come back here. */

const linkFor = (code) => `${window.location.origin}/play/${code}`;

/** the link to share, with a copy button */
function ShareLink({ code }) {
  const [copied, setCopied] = useState(false);
  const url = linkFor(code);
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { window.prompt('Copy this link:', url); }
  };
  return (
    <div className="share">
      <input type="text" readOnly value={url} aria-label="Link to share" onFocus={(e) => e.target.select()} />
      <button type="button" className="btn sm" onClick={copy}>{copied ? 'Copied' : 'Copy link'}</button>
    </div>
  );
}

/** "Assign" button that opens a one-field form (which class or team), then shows the link */
function AssignBox({ type, index, words }) {
  const assign = useStore((s) => s.assign);
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState('');
  const [made, setMade] = useState(null);

  if (made) {
    return (
      <div className="assign-box">
        <span className="small"><b>Assigned to {made.group}.</b> Share this link with your {words.people}:</span>
        <ShareLink code={made.code} />
        <button type="button" className="btn ghost sm" onClick={() => { setMade(null); setOpen(false); setGroup(''); }}>Assign to another {words.group}</button>
      </div>
    );
  }
  if (!open) {
    return <button type="button" className="btn sm" onClick={() => setOpen(true)}><Icon name="send" size={14} /> Assign</button>;
  }
  const submit = (e) => { e.preventDefault(); setMade(assign(type, index, group)); };
  return (
    <form className="assign-box" onSubmit={submit}>
      <label htmlFor={`grp-${type}-${index}`} className="small">Which {words.group}?</label>
      <div className="share">
        <input type="text" id={`grp-${type}-${index}`} placeholder={words.groupEg} value={group} onChange={(e) => setGroup(e.target.value)} autoFocus />
        <button type="submit" className="btn sm">Assign</button>
      </div>
      <button type="button" className="btn ghost sm" onClick={() => setOpen(false)}>Cancel</button>
    </form>
  );
}

/** one handed-out quiz or mission, with who has finished it */
function AssignmentRow({ a, words }) {
  const setOpen = useStore((s) => s.setAssignmentOpen);
  const [show, setShow] = useState(false);
  const n = a.completions.length;
  return (
    <div className="card assigned">
      <div className="spread">
        <span className="stack" style={{ gap: 2 }}>
          <b>{a.title}</b>
          <span className="small muted">{a.type === 'quiz' ? 'Quiz' : 'Home mission'} · {a.group} · assigned {a.created}</span>
        </span>
        <span className={`tag ${a.open ? 't-ok' : 't-gen'}`}>{a.open ? 'Link open' : 'Link closed'}</span>
      </div>
      {a.open && <ShareLink code={a.code} />}
      <div className="row wrap" style={{ justifyContent: 'space-between' }}>
        <button type="button" className="linkish" aria-expanded={show} onClick={() => setShow((v) => !v)} disabled={!n}>
          <b className="num">{n}</b> {n === 1 ? `${words.person} has` : `${words.people} have`} finished{n ? (show ? ' · hide' : ' · show') : ''}
        </button>
        <button type="button" className="btn ghost sm" onClick={() => setOpen(a.id, !a.open)}>{a.open ? 'Close link' : 'Reopen link'}</button>
      </div>
      {show && n > 0 && (
        <ul className="done-list">
          {a.completions.map((c, i) => (
            <li key={i}><span>{c.name}</span><span className="small muted">{a.type === 'quiz' ? `${c.score}/${c.total} · ` : ''}{c.at.slice(0, 10)}</span></li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Play() {
  const user = useStore((s) => s.user);
  const all = useStore((s) => s.assignments);
  const [tab, setTab] = useState('quiz');
  const [preview, setPreview] = useState(null);

  const teacher = user.role === 'teacher';
  const words = teacher
    ? { person: 'student', people: 'students', group: 'class', groupEg: 'e.g. Class 3B' }
    : { person: 'colleague', people: 'colleagues', group: 'team', groupEg: 'e.g. Finance team' };

  const mine = all.filter((a) => a.orgId === user.orgId);
  const quizzes = mine.filter((a) => a.type === 'quiz');
  const missions = mine.filter((a) => a.type === 'mission');
  const count = (list) => list.reduce((n, a) => n + a.completions.length, 0);

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">Quizzes &amp; Missions</span>
        <h1>{teacher ? 'Assign it. Your students play it.' : 'Assign it. Your team plays it.'}</h1>
        <p>
          Pick a quiz or a home mission, assign it to a {words.group}, and share the link. Your {words.people} open it on
          their own phones or laptops (no account needed), and you can see who has finished under <b>Assigned</b>.
        </p>
      </div>

      <div className="stats" style={{ marginBottom: 'var(--s5)' }}>
        <div className="stat"><b className="num">{quizzes.length}</b><span className="lbl">Quizzes assigned</span></div>
        <div className="stat"><b className="num">{count(quizzes)}</b><span className="lbl">Quizzes finished by {words.people}</span></div>
        <div className="stat"><b className="num">{missions.length}</b><span className="lbl">Home missions assigned</span></div>
        <div className="stat"><b className="num">{count(missions)}</b><span className="lbl">Home missions completed</span></div>
      </div>

      <div className="subnav" role="tablist">
        <button role="tab" aria-selected={tab === 'quiz'} onClick={() => { setTab('quiz'); setPreview(null); }}>Quizzes</button>
        <button role="tab" aria-selected={tab === 'miss'} onClick={() => setTab('miss')}>Home missions</button>
        <button role="tab" aria-selected={tab === 'done'} onClick={() => setTab('done')}>Assigned ({mine.length})</button>
      </div>

      {tab === 'quiz' && (
        <AnimatePresence mode="wait">
          {preview === null ? (
            <motion.div key="grid" className="quiz-grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {QUIZZES.map((q, idx) => (
                <motion.div key={q.t} className={`quiz-card acc-${q.accent}`}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
                  <span className="blob" />
                  <span className="ico"><Icon name={q.icon} size={32} /></span>
                  <span className="q-topic">{q.topic}</span>
                  <h3>{q.t}</h3>
                  <span className="small muted">{q.qs.length} questions</span>
                  <div className="q-foot">
                    <button type="button" className="btn ghost sm" onClick={() => setPreview(idx)}><Icon name="play" size={12} fill /> Preview</button>
                    <AssignBox type="quiz" index={idx} words={words} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="player" className="stack" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="small muted">You're previewing what your {words.people} will see. Nothing is recorded.</p>
              <QuizPlayer quiz={QUIZZES[preview]} preview onExit={() => setPreview(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {tab === 'miss' && (
        <div className="quest-grid">
          {MISSIONS.map((m, idx) => (
            <motion.div key={m.t} className="quest"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
              <span className="ico"><Icon name={m.icon} size={32} /></span>
              <div className="meta">
                <span className={`badge ${m.level === 'Easy' ? 'easy' : 'medium'}`}>{m.level}</span>
                <span className="badge time">⏱ {m.mins}</span>
                <span className="badge time">{m.who}</span>
              </div>
              <h3>{m.t}</h3>
              <p className="small muted">{m.d}</p>
              <div className="q-actions">
                <AssignBox type="mission" index={idx} words={words} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'done' && (
        mine.length ? (
          <div className="assigned-list">
            {mine.map((a) => <AssignmentRow key={a.id} a={a} words={words} />)}
          </div>
        ) : (
          <div className="panel center" style={{ alignItems: 'center' }}>
            <p className="muted">Nothing assigned yet. Open <b>Quizzes</b> or <b>Home missions</b> and press <b>Assign</b>.</p>
          </div>
        )
      )}
    </Page>
  );
}
