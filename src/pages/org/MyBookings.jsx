import { useState } from 'react';
import { Link } from 'react-router-dom';
import Page from '../../components/ui/Page';
import { useStore } from '../../store/useStore';
import { ACTS, WEEKS } from '../../data/seed';
import { shrinkPhoto } from '../../lib/photo';
import { fmt } from '../../lib/calc';

/** log what happened at a session — reuse is capped at the dispatched kg, a photo is required,
    and the unused remainder is shown as an explicit residual (never rounded up). */
function OutcomeForm({ booking, dispatched, onDone }) {
  const logOutcome = useStore((s) => s.logOutcome);
  const [people, setPeople] = useState(booking.people);
  const [kg, setKg] = useState(dispatched);
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState('');
  const [err, setErr] = useState('');
  const used = Math.min(Math.max(0, Number(kg) || 0), dispatched);
  const residual = Math.round((dispatched - used) * 10) / 10;

  const pick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try { setPhoto(await shrinkPhoto(f)); setErr(''); } catch (x) { setErr(x.message); }
  };
  const submit = (e) => {
    e.preventDefault();
    const r = logOutcome(booking.id, { people, kgUsed: kg, photo, notes: notes.trim() });
    if (!r.ok) return setErr(r.error);
    onDone();
  };

  return (
    <form className="panel" noValidate onSubmit={submit} style={{ marginTop: 'var(--s3)' }}>
      <h3>Log this session</h3>
      <p className="small muted">CoffeeBot sent <b>{fmt(dispatched)} kg</b>. Tell us what really happened. Only what you used counts as reused.</p>
      <div className="grid2" style={{ gap: 'var(--s3)' }}>
        <div className="field"><label htmlFor={`p${booking.id}`}>People who took part</label>
          <input id={`p${booking.id}`} type="number" min="1" value={people} onChange={(e) => { setPeople(e.target.value); setErr(''); }} /></div>
        <div className="field"><label htmlFor={`k${booking.id}`}>Grounds used (kg, max {fmt(dispatched)})</label>
          <input id={`k${booking.id}`} type="number" min="0.1" max={dispatched} step="0.1" value={kg} onChange={(e) => { setKg(e.target.value); setErr(''); }} /></div>
      </div>
      <p className="small" style={{ margin: 0 }}>
        Unused, returned to CoffeeBot: <b className={residual > 0 ? 'badc' : ''}>{fmt(residual)} kg</b>
      </p>
      <div className="field"><label htmlFor={`f${booking.id}`}>Photo of the activity (required)</label>
        <input id={`f${booking.id}`} type="file" accept="image/*" capture="environment" onChange={pick} />
        {photo && <img src={photo} alt="Preview of your activity" style={{ marginTop: 8, maxWidth: 180, borderRadius: 8 }} />}</div>
      <div className="field"><label htmlFor={`n${booking.id}`}>Notes (optional)</label>
        <input id={`n${booking.id}`} type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything CoffeeBot should know" /></div>
      <div className="row" style={{ gap: 'var(--s2)' }}>
        <button className="btn" type="submit">Submit and confirm reuse</button>
        <button className="btn ghost" type="button" onClick={onDone}>Not now</button>
      </div>
      {err && <div className="msg bad">{err}</div>}
    </form>
  );
}

export default function MyBookings() {
  const user = useStore((s) => s.user);
  const bookings = useStore((s) => s.bookings);
  const batches = useStore((s) => s.batches);
  const cancelBooking = useStore((s) => s.cancelBooking);
  const [logging, setLogging] = useState(null);
  const mine = [...bookings.filter((b) => b.org === user.org)].sort((a, b) => a.week - b.week);

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">My bookings</span>
        <h1>Your booked activities</h1>
        <p>Everything your group has scheduled. Once CoffeeBot sends the grounds, log the session here with a photo. That confirms the reuse.</p>
      </div>

      <div className="panel">
        {mine.length ? (
          <div className="list">
            {mine.map((b) => {
              const batch = batches.find((x) => x.id === b.batchId);
              const o = b.outcome;
              const ready = !o && batch && batch.status === 'Dispatched';
              return (
                <div key={b.id} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <div className="spread">
                    <span>
                      <b>{ACTS[b.act].name}</b><br />
                      <span className="small muted">{b.people} people · {b.kg} kg kit · week of {WEEKS[b.week].w}</span>
                    </span>
                    <span className="row" style={{ gap: 'var(--s3)' }}>
                      <span className={`tag ${o ? 't-ok' : ready ? 't-wet' : 't-gen'}`}>
                        {o ? 'Completed' : ready ? 'Grounds sent' : 'Booked'}
                      </span>
                      {ready && logging !== b.id && <button className="btn sm" onClick={() => setLogging(b.id)}>Log session</button>}
                      {!o && <button className="btn ghost sm" onClick={() => cancelBooking(b.id)}>Cancel</button>}
                    </span>
                  </div>
                  {o && (
                    <div className="row" style={{ gap: 'var(--s3)', alignItems: 'center', marginTop: 8 }}>
                      <img src={o.photo} alt="Evidence photo" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
                      <span className="small">
                        {o.people} people · <b>{fmt(o.kgUsed)} kg</b> reused of {fmt(o.dispatched)} kg sent
                        {o.residual > 0 && <> · {fmt(o.residual)} kg returned</>}
                        <br /><span className="muted">Logged {o.date}{o.notes ? ` · ${o.notes}` : ''}</span>
                      </span>
                    </div>
                  )}
                  {!o && !ready && <span className="xs muted" style={{ marginTop: 4 }}>CoffeeBot will send the grounds nearer the week. You can log the session once they do.</span>}
                  {ready && logging === b.id && <OutcomeForm booking={b} dispatched={batch.kg} onDone={() => setLogging(null)} />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="stack">
            <p className="muted">No bookings yet.</p>
            <Link className="btn" to="/app/book">Book your first activity</Link>
          </div>
        )}
      </div>
    </Page>
  );
}
