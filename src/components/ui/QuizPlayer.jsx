import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Confetti from './Confetti';
import Icon from './Icon';
import '../../pages/org/play.css';

const SHAPES = ['▲', '◆', '●', '■'];
export const POINTS = 100;

/** Plays one quiz. Students play it from a teacher's link (`onFinish` records the score);
    teachers can preview it (`preview`), which records nothing and can be replayed. */
export default function QuizPlayer({ quiz: Q, preview = false, onFinish, onExit }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);
  const finished = useRef(false);
  const done = i >= Q.qs.length;

  useEffect(() => {
    if (done && !finished.current) { finished.current = true; onFinish?.(score, Q.qs.length); }
  }, [done, score, Q, onFinish]);

  const reset = () => { finished.current = false; setI(0); setScore(0); setPicked(null); setLocked(false); };

  if (done) {
    const ratio = score / Q.qs.length;
    const ringPct = Math.round(ratio * 100);
    const msg = ratio === 1 ? ['award', 'Perfect! You really know your grounds.']
      : ratio >= 0.5 ? ['check', 'Nice work! Solid sustainability instincts.']
      : ['sprout', 'Good start. Every quiz teaches something new!'];
    return (
      <div className={`player acc-${Q.accent}`}>
        <Confetti fire={score > 0 ? Q.t : null} />
        <motion.div className="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <span className="result-ico"><Icon name={msg[0]} size={40} /></span>
          <div className="ring" style={{ '--p': ringPct }}><b>{ringPct}%</b></div>
          <h2>{msg[1]}</h2>
          <p className="muted">{score} of {Q.qs.length} right · {score * POINTS} points</p>
          <p className="small muted">{preview ? 'Preview only. Nothing was recorded.' : 'Done! Your result has been sent to your teacher.'}</p>
          {preview && (
            <div className="row wrap" style={{ justifyContent: 'center' }}>
              <button className="btn" onClick={reset}>Preview again</button>
              <button className="btn ghost" onClick={onExit}>Back to quizzes</button>
            </div>
          )}
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
          <span className="score-chip">{preview ? 'Preview' : `${score * POINTS} pts`}</span>
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
