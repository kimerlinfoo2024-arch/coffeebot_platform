import { useState } from 'react';
import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import { useStore } from '../../store/useStore';
import { BATCH_STATUS, BATCH_USES, BATCH_SOURCES } from '../../data/seed';
import { batchTotals, fmt } from '../../lib/calc';
import { toCSV, downloadFile, today, BATCH_COLS } from '../../lib/download';
import './grounds.css';

const reveal = {
  initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' }, transition: { duration: 0.4 },
};

const STATUS_TAG = { Collected: 't-gen', Drying: 't-dry', Dispatched: 't-wet', Reused: 't-ok', Disposed: 't-bad' };
const BLANK = { date: today(), source: BATCH_SOURCES[0], kg: 10, partner: '', use: 'Unassigned', status: 'Collected', notes: '' };
const shortDate = (d) => new Date(`${d}T00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

/** status picker shared by the new-batch form and the batch editor */
function StatusPicker({ value, onChange }) {
  return (
    <div className="subnav status-pick" role="radiogroup" aria-label="Status" style={{ marginBottom: 0 }}>
      {BATCH_STATUS.map((s) => (
        <button key={s} type="button" role="radio" aria-checked={value === s}onClick={() => onChange(s)}>{s}</button>
      ))}
    </div>
  );
}

function BatchEditor({ batch, partners, onChange, onClose }) {
  return (
    <div className="panel glass grounds-side">
      <div className="panel-head">
        <h2>Batch #{batch.id}</h2>
        <button className="btn ghost sm" onClick={onClose}>Done</button>
      </div>
      <div className="list">
        <div><span className="muted">Collected</span><b>{shortDate(batch.date)}</b></div>
        <div><span className="muted">Source</span><b style={{ textAlign: 'right' }}>{batch.source}</b></div>
        <div><span className="muted">Weight</span><b className="num">{fmt(batch.kg)} kg</b></div>
      </div>
      <div className="field"><label>Status</label><StatusPicker value={batch.status} onChange={(status) => onChange({ status })} /></div>
      <div className="grid2" style={{ gap: 'var(--s3)' }}>
        <div className="field"><label htmlFor="eUse">Use</label>
          <select id="eUse" value={batch.use} onChange={(e) => onChange({ use: e.target.value })}>
            {BATCH_USES.map((u) => <option key={u}>{u}</option>)}
          </select></div>
        <div className="field"><label htmlFor="ePartner">Partner</label>
          <select id="ePartner" value={batch.partner} onChange={(e) => onChange({ partner: e.target.value })}>
            <option value="">None</option>
            {partners.map((p) => <option key={p.name}>{p.name}</option>)}
          </select></div>
      </div>
      <div className="field"><label htmlFor="eNotes">Notes</label>
        <textarea id="eNotes" value={batch.notes} placeholder="e.g. black coffee only, milk contamination"
          onChange={(e) => onChange({ notes: e.target.value })} /></div>
      <p className="xs muted">Changes save as you make them.</p>
    </div>
  );
}

function NewBatch({ partners, onAdd }) {
  const [form, setForm] = useState(BLANK);
  const [err, setErr] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const kg = Number(form.kg);
    if (!form.source.trim()) return setErr('Add where the grounds came from.');
    if (!(kg > 0)) return setErr('Enter the batch weight in kg.');
    onAdd({ ...form, source: form.source.trim(), kg, notes: form.notes.trim() });
    setForm({ ...BLANK, date: form.date, source: form.source });
    setErr('');
  };

  return (
    <form className="panel glass grounds-side" noValidate onSubmit={submit}>
      <h2>Log a batch</h2>
      <p className="small muted">Weigh the grounds at collection, then follow the batch through to reuse.</p>
      <div className="grid2" style={{ gap: 'var(--s3)' }}>
        <div className="field"><label htmlFor="bDate">Date</label>
          <input type="date" id="bDate" value={form.date} onChange={set('date')} /></div>
        <div className="field"><label htmlFor="bKg">Weight (kg)</label>
          <input type="number" id="bKg" min="0.5" step="0.5" value={form.kg} onChange={set('kg')} /></div>
      </div>
      <div className="field"><label htmlFor="bSrc">Source</label>
        <input type="text" id="bSrc" list="bSources" value={form.source} onChange={set('source')} />
        <datalist id="bSources">{BATCH_SOURCES.map((s) => <option key={s} value={s} />)}</datalist></div>
      <div className="field"><label>Status</label><StatusPicker value={form.status} onChange={(status) => setForm((f) => ({ ...f, status }))} /></div>
      <div className="grid2" style={{ gap: 'var(--s3)' }}>
        <div className="field"><label htmlFor="bUse">Use</label>
          <select id="bUse" value={form.use} onChange={set('use')}>{BATCH_USES.map((u) => <option key={u}>{u}</option>)}</select></div>
        <div className="field"><label htmlFor="bPartner">Partner</label>
          <select id="bPartner" value={form.partner} onChange={set('partner')}>
            <option value="">None yet</option>
            {partners.map((p) => <option key={p.name}>{p.name}</option>)}
          </select></div>
      </div>
      <div className="field"><label htmlFor="bNotes">Notes</label>
        <input type="text" id="bNotes" value={form.notes} onChange={set('notes')} placeholder="Optional" /></div>
      <button className="btn block" type="submit">Log batch</button>
      {err && <div className="msg bad">{err}</div>}
    </form>
  );
}

export default function Grounds() {
  const batches = useStore((s) => s.batches);
  const partners = useStore((s) => s.partners);
  const addBatch = useStore((s) => s.addBatch);
  const updateBatch = useStore((s) => s.updateBatch);

  const [filter, setFilter] = useState('All');
  const [selId, setSelId] = useState(null);

  const t = batchTotals(batches);
  const shown = filter === 'All' ? batches : batches.filter((b) => b.status === filter);
  const selected = batches.find((b) => b.id === selId);
  const kgIn = (s) => batches.filter((b) => b.status === s).reduce((a, b) => a + b.kg, 0);

  // on phones the editor sits below the table, so bring it into view
  const select = (id) => {
    setSelId(id);
    if (window.matchMedia('(max-width: 960px)').matches) {
      requestAnimationFrame(() => document.querySelector('.grounds-aside')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  };

  const exportCSV = () => downloadFile(`coffeebot-grounds-${today()}.csv`, toCSV(shown, BATCH_COLS));

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">Operations</span>
        <h1>Grounds log</h1>
        <p>Every batch of grounds, from the machine it came from to where it ended up. Reuse only counts once a batch is marked Reused.</p>
      </div>

      <div className="stack">
        <motion.div {...reveal} className="stats">
          <div className="stat lead"><b className="num">{fmt(t.logged)} kg</b><span className="lbl">Logged across {batches.length} batches</span></div>
          <div className="stat"><b className="num">{fmt(t.reused)} kg</b><span className="lbl">Confirmed reused</span></div>
          <div className="stat"><b className="num">{fmt(t.inProgress)} kg</b><span className="lbl">Still in progress</span></div>
          <div className={`stat ${t.disposed ? 'warn' : ''}`}><b className="num">{t.reuseRate}%</b><span className="lbl">Of closed batches reused · {fmt(t.disposed)} kg disposed</span></div>
        </motion.div>

        <div className="grounds-grid">
          <motion.div {...reveal} className="panel">
            <div className="panel-head">
              <h2>Batches</h2>
              <button className="btn ghost sm" onClick={exportCSV}>Export CSV</button>
            </div>
            <div className="subnav filter-chips" role="tablist">
              {['All', ...BATCH_STATUS].map((s) => (
                <button key={s} role="tab" aria-selected={filter === s} onClick={() => setFilter(s)}>
                  {s} <span className="chip-kg">{fmt(s === 'All' ? t.logged : kgIn(s))} kg</span>
                </button>
              ))}
            </div>
            <div className="scroll">
              <table className="batch-table">
                <thead>
                  <tr><th>Batch</th><th>Source</th><th className="r">Kg</th><th>Destination</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {shown.map((b) => (
                    <tr key={b.id} tabIndex={0} aria-selected={b.id === selId}
                      onClick={() => select(b.id)} onKeyDown={(e) => { if (e.key === 'Enter') select(b.id); }}>
                      <td className="c-id"><b>#{b.id}</b><br /><span className="small muted">{shortDate(b.date)}</span></td>
                      <td className="c-src">
                        {b.source}
                        {b.notes && <><br /><span className="small muted">{b.notes}</span></>}
                      </td>
                      <td className="r c-kg"><b>{fmt(b.kg)}</b><span className="c-unit"> kg</span></td>
                      <td className="c-dest">{b.use}{b.partner && <><br /><span className="small muted">{b.partner}</span></>}</td>
                      <td className="c-status"><span className={`tag ${STATUS_TAG[b.status]}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!shown.length && <p className="small muted" style={{ paddingTop: 'var(--s3)' }}>No batches with this status.</p>}
            </div>
            <p className="xs muted">Select a batch to update its status, destination or notes.</p>
          </motion.div>

          <div className="grounds-aside">
            {selected ? (
              <BatchEditor key={selected.id} batch={selected} partners={partners}
                onChange={(patch) => updateBatch(selected.id, patch)} onClose={() => setSelId(null)} />
            ) : (
              <NewBatch partners={partners} onAdd={addBatch} />
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}
