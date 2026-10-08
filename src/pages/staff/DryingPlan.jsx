import { motion } from 'framer-motion';
import Page from '../../components/ui/Page';
import { useStore } from '../../store/useStore';
import { WEEKS } from '../../data/seed';
import { weekRow, fmt } from '../../lib/calc';
import { ACTS } from '../../data/seed';

const reveal = {
  initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' }, transition: { duration: 0.4 },
};

export default function DryingPlan() {
  const bookings = useStore((s) => s.bookings);
  const partners = useStore((s) => s.partners);
  const rows = WEEKS.map((w, i) => ({ w, ...weekRow(bookings, partners, i) }));
  const sorted = [...bookings].sort((a, b) => a.week - b.week);

  return (
    <Page>
      <div className="pagehead">
        <span className="eyebrow">Operations</span>
        <h1>Bookings and drying plan</h1>
        <p>Plan drying around the weather. Anything not booked or taken by a partner is at risk of being thrown away. Assumes about 80 kg of grounds collected per week.</p>
      </div>

      <div className="stack">
        <motion.div {...reveal} className="panel">
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Week</th><th>Weather</th><th className="r">Dry booked</th><th className="r">Dry capacity</th>
                  <th className="r">Wet booked</th><th className="r">To partners</th><th className="r">At risk</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td><b>{r.w.w}</b></td>
                    <td>{r.w.outlook}, {r.w.hum}%</td>
                    <td className="r">{fmt(r.dry)} kg</td>
                    <td className="r">{r.w.dryCap} kg</td>
                    <td className="r">{fmt(r.wet)} kg</td>
                    <td className="r">{fmt(r.part)} kg</td>
                    <td className={`r ${r.risk ? 'badc' : ''}`}>{fmt(r.risk)} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="grid2">
          <motion.div {...reveal} className="panel">
            <div className="panel-head"><h2>Upcoming bookings</h2></div>
            <div className="list">
              {sorted.map((b) => (
                <div key={b.id}>
                  <span><b>{b.org}</b><br /><span className="small">{ACTS[b.act].name}, {b.people} people, {b.kg} kg</span></span>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span className="small muted">{WEEKS[b.week].w}</span>
                    <span className={`tag ${ACTS[b.act].wet ? 't-wet' : 't-dry'}`}>{ACTS[b.act].wet ? 'Wet' : 'Dry'}</span>
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...reveal} className="panel">
            <div className="panel-head"><h2>Keeping grounds clean</h2></div>
            <p className="muted small">Activity kits only use grounds from black-coffee drinks. IoT drink logs flag collections with milk or chocolate powder, and those go to compost partners instead.</p>
            <div className="list">
              <div><span>Clean batches this week</span><b className="num">62 kg</b></div>
              <div><span>Mixed batches (compost only)</span><b className="num">18 kg</b></div>
            </div>
          </motion.div>
        </div>
      </div>
    </Page>
  );
}
