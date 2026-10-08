import { Link } from 'react-router-dom';
import Page from '../../components/ui/Page';
import { useStore } from '../../store/useStore';
import { ACTS, WEEKS } from '../../data/seed';

export default function MyBookings() {
  const user = useStore((s) => s.user);
  const bookings = useStore((s) => s.bookings);
  const cancelBooking = useStore((s) => s.cancelBooking);
  const mine = [...bookings.filter((b) => b.org === user.org)].sort((a, b) => a.week - b.week);

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">My bookings</span>
        <h1>Your booked activities</h1>
        <p>Everything your group has scheduled. Cancelling frees up CoffeeBot's drying capacity for that week.</p>
      </div>

      <div className="panel">
        {mine.length ? (
          <div className="list">
            {mine.map((b) => (
              <div key={b.id}>
                <span>
                  <b>{ACTS[b.act].name}</b><br />
                  <span className="small muted">{b.people} people · {b.kg} kg kit · week of {WEEKS[b.week].w}</span>
                </span>
                <span className="row" style={{ gap: 'var(--s3)' }}>
                  <span className={`tag ${ACTS[b.act].wet ? 't-wet' : 't-dry'}`}>{ACTS[b.act].wet ? 'Wet' : 'Dry'}</span>
                  <button className="btn ghost sm" onClick={() => cancelBooking(b.id)}>Cancel</button>
                </span>
              </div>
            ))}
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
