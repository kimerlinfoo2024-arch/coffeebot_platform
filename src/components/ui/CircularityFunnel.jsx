import { motion } from 'framer-motion';
import { fmt } from '../../lib/calc';
import './closedloop.css';
import './funnel.css';

/** The Circularity chain: generated → collected → dispatched → confirmed reused,
    then the unrecovered residual broken down. Takes the result of calc.circularity(). */
export default function CircularityFunnel({ c }) {
  const top = c.generated || 1;
  const resid = [
    ['Not collected', c.notCollected],
    ['Still in progress', c.inProgress],
    ['Disposed', c.disposed],
  ];
  return (
    <div className="funnel">
      {c.stages.map((st, i) => (
        <div key={st.key} className={`fn-row ${st.key === 'reused' ? 'is-key' : ''}`}>
          <div className="fn-head">
            <span><b>{st.label}</b> <span className="xs muted">{st.note}</span></span>
            <span className="num"><b>{fmt(st.kg)} kg</b> <span className="muted small">{Math.round((st.kg / top) * 100)}%</span></span>
          </div>
          <div className="fn-track">
            <motion.div className="fn-bar" initial={{ width: 0 }} whileInView={{ width: `${(st.kg / top) * 100}%` }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.08 }} />
          </div>
        </div>
      ))}
      <div className="fn-resid">
        <b>Unrecovered residual: {fmt(c.residual)} kg ({c.residualPct}%)</b>
        <span className="small muted">{resid.map(([n, kg]) => `${n} ${fmt(kg)} kg`).join(' · ')}</span>
      </div>
    </div>
  );
}
