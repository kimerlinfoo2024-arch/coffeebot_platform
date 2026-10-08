import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Page from '../../components/ui/Page';
import { useStore } from '../../store/useStore';
import { ACTS, WEEKS } from '../../data/seed';
import { kgFor, dryLeft, weekAvailable } from '../../lib/calc';

export default function Book() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const user = useStore((s) => s.user);
  const bookings = useStore((s) => s.bookings);
  const addBooking = useStore((s) => s.addBooking);

  const initialAct = ACTS[params.get('act')] ? params.get('act') : 'scrub';
  const [act, setAct] = useState(initialAct);
  const [people, setPeople] = useState(30);
  const [week, setWeek] = useState(null);

  const a = ACTS[act];
  const kg = kgFor(people);

  const pickAct = (k) => {
    setAct(k);
    if (week !== null && !ACTS[k].wet && dryLeft(bookings, week) < kgFor(people)) setWeek(null);
  };
  const changePeople = (v) => {
    const n = Number(v);
    const valid = n >= 5 && n <= 60 ? n : 30;
    setPeople(valid);
    if (week !== null && !a.wet && dryLeft(bookings, week) < kgFor(valid)) setWeek(null);
  };
  const confirm = () => {
    if (week === null) return;
    addBooking({ act, week, people });
    navigate('/app/bookings');
  };

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">Book an activity</span>
        <h1>Set up a hands-on session</h1>
        <p>Coffee-ground activities are booked ahead so CoffeeBot prepares only the grounds you need. Quizzes and missions don't need booking — run them any time.</p>
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>1. Choose an activity</h2>
          <div className="grid2" style={{ gap: 'var(--s2)' }}>
            {Object.entries(ACTS).map(([k, v]) => (
              <button key={k} className="card interactive" aria-pressed={act === k}
                style={{ borderColor: act === k ? 'var(--ink)' : undefined, boxShadow: act === k ? 'inset 0 0 0 1px var(--ink)' : undefined, gap: 4 }}
                onClick={() => pickAct(k)}>
                <b>{v.name}</b>
                <span className="small muted">{v.desc}</span>
                <span className={`tag ${v.wet ? 't-wet' : 't-dry'}`}>{v.wet ? 'Wet · no drying' : 'Dried grounds'}</span>
              </button>
            ))}
          </div>

          <h2 style={{ marginTop: 'var(--s3)' }}>2. How many people?</h2>
          <div className="field" style={{ maxWidth: 220 }}>
            <label htmlFor="ppl">Number of people (5–60)</label>
            <input type="number" id="ppl" min="5" max="60" value={people} onChange={(e) => changePeople(e.target.value)} />
          </div>

          <h2 style={{ marginTop: 'var(--s3)' }}>3. Choose a week <span className="small muted">(kit: {kg} kg)</span></h2>
          <div className="grid4" style={{ gap: 'var(--s2)' }}>
            {WEEKS.map((w, i) => {
              const ok = weekAvailable(bookings, act, i, people);
              return (
                <button key={i} className="card interactive" aria-pressed={week === i} disabled={!ok}
                  style={{ gap: 2, opacity: ok ? 1 : 0.5, borderColor: week === i ? 'var(--ink)' : undefined, boxShadow: week === i ? 'inset 0 0 0 1px var(--ink)' : undefined }}
                  onClick={() => setWeek(i)}>
                  <b>{w.w}</b>
                  <span className="small muted">{w.outlook}, {w.hum}%</span>
                  <span className="xs" style={{ color: ok ? 'var(--leaf)' : 'var(--bad)' }}>{a.wet ? 'Available' : ok ? 'Drying available' : 'No drying this week'}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="stack">
          <div className="panel glass" style={{ position: 'sticky', top: 90 }}>
            <h2>Review</h2>
            <div className="list">
              <div><span>Organisation</span><b>{user.org}</b></div>
              <div><span>Activity</span><b>{a.name}</b></div>
              <div><span>Type</span><span className={`tag ${a.wet ? 't-wet' : 't-dry'}`}>{a.wet ? 'Wet · no drying' : 'Dried grounds'}</span></div>
              <div><span>People</span><b className="num">{people}</b></div>
              <div><span>Kit size</span><b className="num">{kg} kg</b></div>
              <div><span>Week</span><b>{week === null ? '—' : `Week of ${WEEKS[week].w}`}</b></div>
            </div>
            <button className="btn block" disabled={week === null} onClick={confirm}>
              {week === null ? 'Pick a week to continue' : `Confirm booking`}
            </button>
            <p className="small muted">Confirming updates CoffeeBot's drying plan and adds {people} people to the impact figures.</p>
          </div>

          <div className="panel">
            <h2>Why some weeks are greyed out</h2>
            <p className="small muted">Dry activities need grounds that CoffeeBot dries in good weather. Rainy or humid weeks only offer wet activities, which use fresh grounds with no drying.</p>
            <p className="small muted">Booking ahead means CoffeeBot collects and dries only what's needed, instead of storing grounds and throwing away what nobody uses.</p>
          </div>
        </div>
      </div>
    </Page>
  );
}
