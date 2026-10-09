import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import Confetti from '../../components/ui/Confetti';
import Icon from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { QUIZZES, MISSIONS } from '../../data/seed';
import './play.css';

const SHAPES = ['▲', '◆', '●', '■'];
const POINTS = 100;

function QuizPlayer({ quizIndex, onExit }) {
  const recordQuiz = useStore((s) => s.recordQuiz);
  const Q = QUIZZES[quizIndex];
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);
  const recorded = useRef(false);
  const done = i >= Q.qs.length;
  const pct = Math.round((done ? Q.qs.length : i) / Q.qs.length * 100);

  useEffect(() => {
    if (done && !recorded.current) { recorded.current = true; recordQuiz(Q.t, score, Q.qs.length); }
  }, [done, score, Q, recordQuiz]);

  const reset = () => { recorded.current = false; setI(0); setScore(0); setPicked(null); setLocked(false); };

  if (done) {
    const ratio = score / Q.qs.length;
    const ringPct = Math.round(ratio * 100);
    const msg = ratio === 1 ? ['award', 'Perfect! You really know your grounds.']
      : ratio >= 0.5 ? ['check', 'Nice work — solid sustainability instincts.']
      : ['sprout', 'Good start. Give it another go!'];
    return (
      <div className={`player acc-${Q.accent}`}>
        <Confetti fire={score > 0 ? Q.t : null} />
        <motion.div className="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <span className="result-ico"><Icon name={msg[0]} size={40} /></span>
          <div className="ring" style={{ '--p': ringPct }}><b>{ringPct}%</b></div>
          <h2>{msg[1]}</h2>
          <p className="muted">You scored <b>{score} of {Q.qs.length}</b> · {score * POINTS} points</p>
          <p className="small muted">Recorded — this quiz now counts towards CoffeeBot's reach.</p>
          <div className="row wrap" style={{ justifyContent: 'center' }}>
            <button className="btn" onClick={reset}>Play again</button>
            <button className="btn ghost" onClick={onExit}>Back to quizzes</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = Q.qs[i];
  const choose = (idx) => {
    if (locked) return;
    setLocked(true); setPicked(idx);
    if (idx === q.a) setScore((s) => s + 1);
    setTimeout(() => { setPicked(null); setLocked(false); setI((n) => n + 1); }, 1150);
  };

  return (
    <div className={`player acc-${Q.accent}`}>
      <div className="player-top">
        <div className="row-between">
          <span style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name={Q.icon} size={18} /> {Q.t}</span>
          <span className="score-chip">{score * POINTS} pts</span>
        </div>
        <div className="progress"><i style={{ width: `${(i / Q.qs.length) * 100}%` }} /></div>
        <span className="small" style={{ opacity: 0.85 }}>Question {i + 1} of {Q.qs.length}</span>
      </div>

      <div className="player-body">
        <AnimatePresence mode="wait">
          <motion.div key={i} className="question"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            {q.q}
          </motion.div>
        </AnimatePresence>

        <div className="answers">
          {q.o.map((o, idx) => {
            const state = locked
              ? idx === q.a ? 'correct' : idx === picked ? 'wrong' : 'dim'
              : '';
            return (
              <motion.button
                key={idx} className={`answer a${idx} ${state}`} disabled={locked} onClick={() => choose(idx)}
                animate={state === 'wrong' ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="shape">{SHAPES[idx]}</span>
                <span className="a-txt">{o}</span>
                <span className="mark">{state === 'correct' ? <Icon name="check" size={20} strokeWidth={3} /> : state === 'wrong' ? <Icon name="x" size={20} strokeWidth={3} /> : null}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Play() {
  const [tab, setTab] = useState('quiz');
  const [active, setActive] = useState(null);
  const assignMission = useStore((s) => s.assignMission);
  const completeMission = useStore((s) => s.completeMission);
  const missionsAssigned = useStore((s) => s.missionsAssigned);
  const missionsCompleted = useStore((s) => s.missionsCompleted);
  const quizzesDone = useStore((s) => s.quizzesDone);
  const [burst, setBurst] = useState(null);

  const onComplete = () => { completeMission(); setBurst(Date.now()); };

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">Quizzes &amp; Missions</span>
        <h1>Learn it, play it, live it</h1>
        <p>Quizzes and home missions use coffee grounds as a relatable example to teach waste and circular-economy ideas. Everything you finish adds to CoffeeBot's reach.</p>
      </div>

      <div className="play-stats">
        <div className="play-stat"><span className="ico"><Icon name="book" /></span><div><b>{quizzesDone}</b><span>Quizzes completed</span></div></div>
        <div className="play-stat"><span className="ico"><Icon name="send" /></span><div><b>{missionsAssigned}</b><span>Missions assigned</span></div></div>
        <div className="play-stat"><span className="ico"><Icon name="home" /></span><div><b>{missionsCompleted}</b><span>Completions logged</span></div></div>
      </div>

      <div className="subnav" role="tablist">
        <button role="tab" aria-selected={tab === 'quiz'} onClick={() => { setTab('quiz'); setActive(null); }}>Quizzes &amp; games</button>
        <button role="tab" aria-selected={tab === 'miss'} onClick={() => setTab('miss')}>Home missions</button>
      </div>

      {tab === 'quiz' && (
        <AnimatePresence mode="wait">
          {active === null ? (
            <motion.div key="grid" className="quiz-grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {QUIZZES.map((q, idx) => (
                <motion.button key={q.t} className={`quiz-card acc-${q.accent}`} onClick={() => setActive(idx)}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                  whileTap={{ scale: 0.98 }}>
                  <span className="blob" />
                  <span className="ico"><Icon name={q.icon} size={32} /></span>
                  <span className="q-topic">{q.topic}</span>
                  <h3>{q.t}</h3>
                  <div className="q-foot">
                    <span className="small muted">{q.qs.length} questions · {q.qs.length * POINTS} pts</span>
                    <span className="play-btn">Play <Icon name="play" size={13} fill /></span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div key="player" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <QuizPlayer quizIndex={active} onExit={() => setActive(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {tab === 'miss' && (
        <div style={{ position: 'relative' }}>
          <Confetti fire={burst} />
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
                  <button className="btn sm" onClick={() => assignMission(idx)}>Assign to my group</button>
                  <button className="btn ok sm" onClick={onComplete}>Log a completion</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </Page>
  );
}
