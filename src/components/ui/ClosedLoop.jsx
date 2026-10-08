import { motion } from 'framer-motion';
import './closedloop.css';

const NODES = [
  { pos: 'top', step: 'Step 1', t: 'Brew', s: '20 g per cup', color: 'var(--brew)' },
  { pos: 'right', step: 'Step 2', t: 'Collect', s: 'dried to weather', color: 'var(--teal)' },
  { pos: 'bottom', step: 'Step 3', t: 'Transform', s: 'into products', color: 'var(--amber)' },
  { pos: 'left', step: 'Step 4', t: 'Impact', s: 'measured & shared', color: 'var(--leaf)' },
];

export default function ClosedLoop() {
  return (
    <div className="loop" role="img" aria-label="The closed loop: brew, collect, transform, impact, repeat">
      <div className="loop-ring" />
      <div className="loop-center"><b>Closed<br />loop</b></div>
      {NODES.map((n, i) => (
        <motion.div
          key={n.pos} className={`loop-node ${n.pos}`} style={{ background: n.color }}
          initial={{ opacity: 0, scale: 0.3 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.12, type: 'spring', stiffness: 240, damping: 15 }}
        >
          <span className="lstep">{n.step}</span>
          <span className="lt">{n.t}</span>
          <span className="ls">{n.s}</span>
        </motion.div>
      ))}
    </div>
  );
}
