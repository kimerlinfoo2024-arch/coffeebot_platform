import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import Page from '../../components/ui/Page';
import Icon from '../../components/ui/Icon';
import Confetti from '../../components/ui/Confetti';
import QuizPlayer from '../../components/ui/QuizPlayer';
import { useStore } from '../../store/useStore';
import { QUIZZES, MISSIONS } from '../../data/seed';
import '../org/play.css';

/** What a student sees after opening the link their teacher shared (/play/<code>).
    No account: they type a first name, play, and the result goes to the teacher. */
export default function StudentPlay() {
  const { code } = useParams();
  const a = useStore((s) => s.assignments.find((x) => x.code === code));
  const syncing = useStore((s) => s.sync.status === 'connecting');
  const completeAssignment = useStore((s) => s.completeAssignment);
  const [name, setName] = useState('');
  const [step, setStep] = useState('name'); // name → play → done
  const [burst, setBurst] = useState(null);

  const onFinish = useCallback((score, total) => { completeAssignment(code, { name, score, total }); }, [code, name, completeAssignment]);

  if (!a) {
    return (
      <Page>
        <div className="panel center sp-card">
          {syncing ? <p className="muted">Loading…</p> : (
            <>
              <h1>We couldn't find that link</h1>
              <p className="muted">Check the link with your teacher. It may have a typo, or it may have been closed.</p>
            </>
          )}
        </div>
      </Page>
    );
  }

  const item = a.type === 'quiz' ? QUIZZES[a.index] : MISSIONS[a.index];
  const head = (
    <div className="pagehead center sp-head">
      <span className="eyebrow">{a.org} · {a.group}</span>
      <h1>{item.t}</h1>
    </div>
  );

  if (!a.open && step !== 'done') {
    return <Page>{head}<div className="panel center sp-card"><p className="muted">Your teacher has closed this {a.type === 'quiz' ? 'quiz' : 'mission'}. Ask them if you still need it.</p></div></Page>;
  }

  if (step === 'name') {
    return (
      <Page>
        {head}
        <form className="panel sp-card" onSubmit={(e) => { e.preventDefault(); setStep('play'); }}>
          <p>{a.type === 'quiz'
            ? `Your teacher has sent you a quiz with ${item.qs.length} questions. Pick an answer for each one. Have fun!`
            : item.d}</p>
          <div className="field">
            <label htmlFor="spName">Your first name or nickname</label>
            <input type="text" id="spName" maxLength={40} autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
            <span className="xs muted" style={{ marginTop: 4 }}>So your teacher knows it was you. Please don't type your full name.</span>
          </div>
          <button type="submit" className="btn lg" disabled={!name.trim()}>
            {a.type === 'quiz' ? <>Start the quiz <Icon name="play" size={14} fill /></> : 'Next'}
          </button>
        </form>
      </Page>
    );
  }

  if (a.type === 'quiz') {
    return <Page>{head}<div className="sp-wide"><QuizPlayer quiz={item} onFinish={onFinish} /></div></Page>;
  }

  // home mission: do it at home, then tell the teacher
  return (
    <Page>
      {head}
      <div className="panel center sp-card" style={{ position: 'relative' }}>
        <Confetti fire={burst} />
        {step === 'done' ? (
          <>
            <span className="result-ico" style={{ color: 'var(--leaf)' }}><Icon name="award" size={40} /></span>
            <h2>Mission complete! Well done, {name.trim()}!</h2>
            <p className="muted">Your teacher can see that you finished it.</p>
          </>
        ) : (
          <>
            <span style={{ color: 'var(--brew)' }}><Icon name={item.icon} size={40} /></span>
            <p>{item.d}</p>
            <p className="small muted">{item.who} · {item.mins}</p>
            <button type="button" className="btn lg center" onClick={() => {
              if (completeAssignment(code, { name })) { setStep('done'); setBurst(Date.now()); }
            }}>We did it!</button>
          </>
        )}
      </div>
    </Page>
  );
}
