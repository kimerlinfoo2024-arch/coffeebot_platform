import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import { ACTS } from '../../data/seed';
import { ART, Svg } from '../../data/art';

const reveal = {
  initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' }, transition: { duration: 0.4 },
};

export default function LearnDo() {
  const navigate = useNavigate();
  const entries = Object.entries(ACTS);

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">Learn &amp; Do</span>
        <h1>Every product is a lesson you can run</h1>
        <p>Each item made from coffee grounds links to a hands-on activity for your class or team. Dry activities use dried grounds and are booked around the weather; wet activities use fresh grounds with no drying.</p>
      </div>

      <div className="grid3">
        {entries.map(([k, v], i) => (
          <motion.div key={k} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="card interactive"
            onClick={() => navigate(`/app/book?act=${k}`)} role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/app/book?act=${k}`); }}>
            <div className="thumb"><Svg markup={ART[k]} /></div>
            <span className={`tag ${v.wet ? 't-wet' : 't-dry'}`}>{v.wet ? 'Wet · no drying' : 'Dried grounds'}</span>
            <b>{v.name}</b>
            <span className="small muted">{v.desc}.</span>
            <span className="small" style={{ color: 'var(--brew)' }}><b>You'll learn:</b> {v.learn}</span>
            <span className="btn sm" style={{ marginTop: 'var(--s2)' }}>Book this →</span>
          </motion.div>
        ))}
      </div>
    </Page>
  );
}
