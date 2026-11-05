import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  const auto = useStore((s) => s.autoSim);
  const setAuto = useStore((s) => s.setAutoSim);
  const [now, setNow] = useState(Date.now());

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);

  return (
    <div className="lf">
      <div className="lf-top">
        <div>
          <b className="num lf-total">{live.cups.toLocaleString()}</b>
          <span className="small muted"> cups brewed since reset · about {fmt(live.cups * GROUNDS_PER_CUP)} kg of grounds</span>
        </div>
        <button
          type="button"
          className={`lf-sim ${auto ? 'on' : ''}`}
          aria-pressed={auto}
          onClick={() => setAuto(!auto)}
          title={auto ? 'Stop the machines brewing' : 'Start the machines brewing on their own'}
        >
          <span className="lf-sim-icon" aria-hidden="true">
            {auto
              ? <svg viewBox="0 0 24 24" width="14" height="14"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" /></svg>
              : <svg viewBox="0 0 24 24" width="14" height="14"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>}
          </span>
          <span className="lf-sim-text">
            <b>{auto ? 'Simulation running' : 'Start simulation'}</b>
            <span className="xs">{auto ? 'Click to stop · keeps going on other pages' : 'Machines brew on their own'}</span>
          </span>
          <span className="lf-sim-dot" aria-hidden="true" />
        </button>
      </div>
      <div className="lf-grid">
        {live.machines.map((m) => (
          <div key={m.id} className="lf-m">
            <span className="small muted">{m.site}</span>
            <b>{m.name}</b>
            <motion.b key={m.cups} className="num lf-n" initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>{m.cups}</motion.b>
            <span className="xs muted">{ago(m.last, now)}</span>
            <div className="row" style={{ gap: 'var(--s2)', flexWrap: 'wrap' }}>
              <button className="btn ghost sm" onClick={() => brew(m.id)}>Brew a cup</button>
              <Link className="small" to={`/m/${m.id}`}>QR story →</Link>
            </div>
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

