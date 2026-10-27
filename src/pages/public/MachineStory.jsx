import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';
import Page from '../../components/ui/Page';
import Counter from '../../components/ui/Counter';
import { Donut } from '../../components/ui/charts';
import { useStore } from '../../store/useStore';
import { machineStory, fmt } from '../../lib/calc';
import { MACHINES, ACTS } from '../../data/seed';
import './machine.css';

const reveal = {
  initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' }, transition: { duration: 0.4 },
};
const STATUS_TAG = { Collected: 't-gen', Drying: 't-dry', Dispatched: 't-wet', Reused: 't-ok', Disposed: 't-bad' };
const shortDate = (d) => new Date(`${d}T00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const ago = (t, now) => {
  if (!t) return 'No brews reported yet';
  const s = Math.max(0, Math.round((now - t) / 1000));
  return s < 5 ? 'Brewed just now' : s < 60 ? `Last brew ${s}s ago` : s < 3600 ? `Last brew ${Math.round(s / 60)} min ago` : `Last brew ${Math.round(s / 3600)} h ago`;
};

/** the printable booth card: QR plus a one-line pitch. Print styles hide everything else. */
function BoothCard({ machine, url }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    QRCode.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#2B1D14', light: '#0000' } })
      .then(setSvg).catch(() => setSvg(''));
  }, [url]);
  return (
    <div className="booth-card">
      <div className="booth-qr" dangerouslySetInnerHTML={{ __html: svg }} />
      <div className="booth-text">
        <span className="eyebrow">Grounds Up · CoffeeBot</span>
        <h2>Where did this cup's grounds go?</h2>
        <p>Scan to follow the used grounds from the <b>{machine.name}</b> machine to compost, mushrooms and classroom kits.</p>
        <span className="xs muted booth-url">{url}</span>
      </div>
    </div>
  );
}

export default function MachineStory() {
  const { machineId } = useParams();
  const story = useStore((s) => machineStory(s, machineId));
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);

  if (!story) {
    return (
      <Page>
        <div className="pagehead"><span className="eyebrow">Grounds Up</span><h1>No machine with that code</h1>
          <p>Try one of the machines on the network instead.</p></div>
        <div className="row wrap">{MACHINES.map((m) => <Link key={m.id} className="btn ghost sm" to={`/m/${m.id}`}>{m.name}</Link>)}</div>
      </Page>
    );
  }

  const url = `${window.location.origin}/m/${story.id}`;
  const closed = story.reused + story.disposed;

  return (
    <Page>
      <div className="story">
        <div className="pagehead story-head">
          <span className="eyebrow">Grounds Up · machine {story.id.toUpperCase()}</span>
          <h1>{story.name}</h1>
          <p>
            Every cup this machine brews leaves about 20 g of used grounds. This page follows those grounds
            from the <b>{story.site}</b> pantry to wherever they end up. It updates as the machine brews.
          </p>
          <div className="row wrap story-live">
            <span className={`live-dot ${story.last && now - story.last < 10000 ? 'on' : ''}`} aria-hidden="true" />
            <span className="small">{ago(story.last, now)}</span>
            <span className="tag t-gen">Simulated feed</span>
          </div>
        </div>

        <motion.div {...reveal} className="stats story-stats">
          <div className="stat lead"><Counter to={story.cups} className="bignum" /><span className="lbl">Cups brewed since the counter reset</span></div>
          <div className="stat"><Counter to={story.generatedKg} decimals={1} suffix=" kg" className="bignum" /><span className="lbl">Grounds those cups left behind</span></div>
          <div className="stat"><Counter to={story.logged} suffix=" kg" className="bignum" /><span className="lbl">Collected and weighed from this machine</span></div>
          <div className="stat"><Counter to={story.reused} suffix=" kg" className="bignum" /><span className="lbl">Confirmed reused · {closed ? `${story.reuseRate}% of closed batches` : 'none closed yet'}</span></div>
        </motion.div>

        <div className="story-grid">
          <motion.section {...reveal} className="panel">
            <div className="panel-head"><h2>Where the grounds went</h2><span className="small muted">kg by pathway</span></div>
            {story.paths.length ? (
              <Donut segments={story.paths} centerLabel={fmt(story.paths.reduce((a, p) => a + p.value, 0))} centerSub="kg routed" />
            ) : (
              <p className="small muted">No batches from this machine have been routed yet. The first collection shows up here.</p>
            )}
            <p className="xs muted" style={{ marginTop: 'var(--s3)' }}>
              Reuse only counts once a partner or a teacher confirms it. Anything that could not be dried in time is
              recorded as disposed, not hidden{story.disposed ? ` (${fmt(story.disposed)} kg so far)` : ''}.
            </p>
          </motion.section>

          <motion.section {...reveal} className="panel">
            <div className="panel-head"><h2>Batch by batch</h2><span className="small muted">{story.batches.length} collected</span></div>
            {story.batches.length ? (
              <ol className="story-batches">
                {[...story.batches].sort((a, b) => (a.date < b.date ? 1 : -1)).map((b) => (
                  <li key={b.id}>
                    <span className="small muted">{shortDate(b.date)}</span>
                    <b className="num">{fmt(b.kg)} kg</b>
                    <span>{b.use === 'Unassigned' ? 'Waiting for a destination' : b.use}{b.partner && <span className="small muted"> · {b.partner}</span>}</span>
                    <span className={`tag ${STATUS_TAG[b.status]}`}>{b.status}</span>
                  </li>
                ))}
              </ol>
            ) : <p className="small muted">Nothing collected from this machine yet.</p>}
          </motion.section>
        </div>

        {story.sessions.length > 0 && (
          <motion.section {...reveal} className="panel">
            <div className="panel-head"><h2>Made into something</h2><span className="small muted">sessions that used these grounds</span></div>
            <div className="story-sessions">
              {story.sessions.map((s) => (
                <figure key={s.id}>
                  {s.outcome.photo && <img src={s.outcome.photo} alt={`${s.org} ${ACTS[s.act].name} session`} loading="lazy" />}
                  <figcaption>
                    <b>{s.org}</b>
                    <span className="small">{ACTS[s.act].name} · {s.outcome.people} people · {fmt(s.outcome.kgUsed)} kg used</span>
                    {s.outcome.notes && <span className="xs muted">{s.outcome.notes}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </motion.section>
        )}

        <motion.section {...reveal} className="panel story-booth">
          <div className="panel-head">
            <h2>Booth card</h2>
            <button className="btn ghost sm no-print" onClick={() => window.print()}>Print</button>
          </div>
          <BoothCard machine={story} url={url} />
          <p className="xs muted no-print">Stick the printed card on the machine. Scanning the code opens this page on a phone.</p>
        </motion.section>

        <p className="small muted no-print" style={{ textAlign: 'center' }}>
          Other machines: {MACHINES.filter((m) => m.id !== story.id).map((m, i) => (
            <span key={m.id}>{i > 0 && ' · '}<Link to={`/m/${m.id}`}>{m.name}</Link></span>
          ))} · <Link to="/about">How Grounds Up works</Link>
        </p>
      </div>
    </Page>
  );
}
