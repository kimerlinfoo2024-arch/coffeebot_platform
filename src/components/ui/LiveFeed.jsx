import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { liveSummary, fmt } from '../../lib/calc';
import { GROUNDS_PER_CUP } from '../../data/seed';
import './livefeed.css';

const ago = (t, now) => {
  if (!t) return 'no brews yet';
  const s = Math.max(0, Math.round((now - t) / 1000));
  return s < 5 ? 'just now' : s < 60 ? `${s}s ago` : `${Math.round(s / 60)} min ago`;
};

/** Simulated IoT feed. Real machines would report a brew to the same shared store;
    here the buttons, the auto-simulator and scripts/emit-brews.mjs all play that role. */
export default function LiveFeed() {
  const state = useStore((s) => s);
  const live = liveSummary(state);
  const brew = useStore((s) => s.brew);
  const [auto, setAuto] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => {
    if (!auto) return undefined;
    const id = setInterval(() => {
      const pick = liveSummary(useStore.getState()).machines;
      brew(pick[Math.floor(Math.random() * pick.length)].id);
    }, 2500);
    return () => clearInterval(id);
  }, [auto, brew]);

  return (
    <div className="lf">
      <div className="lf-top">
        <div>
          <b className="num lf-total">{live.cups.toLocaleString()}</b>
          <span className="small muted"> cups brewed since reset · about {fmt(live.cups * GROUNDS_PER_CUP)} kg of grounds</span>
        </div>
        <label className="lf-auto">
          <input type="checkbox" className="switch" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
          <span className="small">Auto-simulate machines</span>
        </label>
      </div>
      <div className="lf-grid">
        {live.machines.map((m) => (
          <div key={m.id} className="lf-m">
            <span className="small muted">{m.site}</span>
            <b>{m.name}</b>
            <motion.b key={m.cups} className="num lf-n" initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>{m.cups}</motion.b>
            <span className="xs muted">{ago(m.last, now)}</span>
            <button className="btn ghost sm" onClick={() => brew(m.id)}>Brew a cup</button>
          </div>
        ))}
      </div>
      <p className="xs muted lf-note">
        <span className="tag t-gen">Simulated</span> Brews add to the cups served and grounds generated used by the Circularity rate.
        Run <code>node scripts/emit-brews.mjs</code> to send brews from outside the browser.
      </p>
    </div>
  );
}

