import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import { useStore } from '../../store/useStore';
import { capTotal } from '../../lib/calc';

const reveal = {
  initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' }, transition: { duration: 0.4 },
};

export default function Partners() {
  const partners = useStore((s) => s.partners);
  const requests = useStore((s) => s.requests);
  const approveRequest = useStore((s) => s.approveRequest);

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">Operations</span>
        <h1>Partners</h1>
        <p>Approving a request adds its weekly capacity to the drying plan.</p>
      </div>

      <div className="grid2">
        <motion.div {...reveal} className="panel">
          <div className="panel-head"><h2>Active partners</h2><span className="small muted">{capTotal(partners)} kg a week in total</span></div>
          <div className="stack" style={{ gap: 'var(--s2)' }}>
            {partners.map((p) => (
              <div key={p.name} className="card">
                <div className="spread"><b>{p.name}</b><span className={`tag ${p.wet ? 't-wet' : 't-dry'}`}>{p.wet ? 'Takes wet' : 'Needs dry'}</span></div>
                <span className="small muted">{p.kind}</span>
                <span className="small">{p.cap} kg a week</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...reveal} className="panel">
          <div className="panel-head"><h2>Requests</h2></div>
          <div className="stack" style={{ gap: 'var(--s2)' }}>
            {requests.length ? requests.map((p) => (
              <div key={p.id} className="card">
                <div className="spread"><b>{p.name}</b><span className={`tag ${p.wet ? 't-wet' : 't-dry'}`}>{p.wet ? 'Takes wet' : 'Needs dry'}</span></div>
                <span className="small muted">{p.kind}. From {p.by}</span>
                <span className="small">Up to {p.cap} kg a week</span>
                <button className="btn ok sm" onClick={() => approveRequest(p.id)}>Approve</button>
              </div>
            )) : <p className="small muted">No pending requests.</p>}
          </div>
        </motion.div>
      </div>
    </Page>
  );
}
