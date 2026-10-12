import { useState } from 'react';
import { Link } from 'react-router-dom';
import Page from '../../components/ui/Page';
import { useStore } from '../../store/useStore';
import { ACTS, COURSES } from '../../data/seed';
import { COURSE_PRICES, PRICES_ARE_PLACEHOLDERS, money } from '../../data/pricing';
import { ART, Svg } from '../../data/art';
import './courses.css';

export default function Cart() {
  const user = useStore((s) => s.user);
  const cart = useStore((s) => s.carts[s.user.email]) || [];
  const orders = useStore((s) => s.orders).filter((o) => o.orgId === user.orgId);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const checkout = useStore((s) => s.checkout);
  const [done, setDone] = useState(null);
  const total = cart.reduce((a, k) => a + COURSE_PRICES[k], 0);

  if (done) {
    return (
      <Page>
        <div className="pagehead">
          <span className="eyebrow">Order #{done.id} confirmed</span>
          <h1>Your courses are unlocked</h1>
          <p>{done.lines.length === 1 ? 'This course is' : 'These courses are'} now available to everyone at {user.org}. Book a session whenever you're ready.</p>
        </div>
        <div className="panel" style={{ maxWidth: 640 }}>
          <div className="list">
            {done.lines.map((l) => (
              <div key={l.course} style={{ alignItems: 'center' }}>
                <span><b>{l.name}</b></span>
                <Link className="btn sm" to={`/app/book?act=${l.course}`}>Book a session →</Link>
              </div>
            ))}
            <div><b>Order total</b><b className="num">{money(done.total)}</b></div>
          </div>
          <p className="small muted">No payment was taken. Online payment is not connected yet, so CoffeeBot will be in touch about payment for this order.</p>
          <Link className="btn ghost" to="/app/learn">Back to courses</Link>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">Your cart</span>
        <h1>Review your courses</h1>
        <p>Courses are bought once for {user.org} and shared with everyone in your organisation.</p>
      </div>

      {cart.length === 0 ? (
        <div className="panel" style={{ maxWidth: 640 }}>
          <h2>Your cart is empty</h2>
          <p className="muted">Browse the courses and add the ones you'd like to run.</p>
          <Link className="btn" to="/app/learn">Browse courses</Link>
        </div>
      ) : (
        <div className="grid2 cart-layout">
          <ul className="cart-list">
            {cart.map((k) => (
              <li key={k} className="card">
                <div className="thumb"><Svg markup={ART[k]} /></div>
                <div className="cart-info">
                  <b>{ACTS[k].name}</b>
                  <span className="small muted">{ACTS[k].desc} · {COURSES[k].mins} min</span>
                  <span className="small">{ACTS[k].learn}</span>
                </div>
                <div className="cart-side">
                  <b className="num">{money(COURSE_PRICES[k])}</b>
                  <span className="xs muted">Qty 1</span>
                  <button className="btn ghost sm" onClick={() => removeFromCart(k)} aria-label={`Remove ${ACTS[k].name} from cart`}>Remove</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="panel glass cart-summary">
            <h2>Order summary</h2>
            <div className="list">
              <div><span>Organisation</span><b>{user.org}</b></div>
              <div><span>Courses</span><b className="num">{cart.length}</b></div>
              <div><span>Total</span><b className="num cart-total">{money(total)}</b></div>
            </div>
            {PRICES_ARE_PLACEHOLDERS && <p className="price-note">Prices shown are placeholders and will be confirmed by CoffeeBot.</p>}
            <button className="btn block" onClick={() => setDone(checkout())}>Confirm order</button>
            <p className="small muted">
              Online payment is not connected yet, so no card details are collected and nothing is charged here.
              Confirming records your order and unlocks booking for these courses.
            </p>
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <div className="panel" style={{ marginTop: 'var(--s6)' }}>
          <h2>Past orders for {user.org}</h2>
          <div className="scroll">
            <table style={{ minWidth: 480 }}>
              <thead><tr><th>Order</th><th>Date</th><th>Courses</th><th className="r">Total</th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}><td>#{o.id}</td><td>{o.date}</td><td className="small">{o.lines.map((l) => l.name).join(', ')}</td><td className="r">{money(o.total)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Page>
  );
}
