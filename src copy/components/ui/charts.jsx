import { motion } from 'framer-motion';

/* ============================================================
   Lightweight SVG charts in the coffee palette.
   StackedBars · Donut · Ring — all animate in on mount.
   ============================================================ */

const EASE = [0.22, 0.61, 0.36, 1];

/* ---- Stacked vertical bars ---------------------------------
   data: [{ label, segments: [{ value, color, name }] }]           */
export function StackedBars({ data, unit = '', max: forcedMax, height = 200 }) {
  const totals = data.map((d) => d.segments.reduce((a, s) => a + s.value, 0));
  const max = forcedMax || Math.max(1, ...totals);
  const legend = [];
  data.forEach((d) => d.segments.forEach((s) => { if (!legend.find((l) => l.name === s.name)) legend.push(s); }));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--s3)', height, padding: '0 2px' }}>
        {data.map((d, i) => {
          const total = totals[i];
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
              <span className="xs num" style={{ color: 'var(--muted)' }}>{total ? total.toFixed(total % 1 ? 1 : 0) : 0}{unit}</span>
              <div style={{ flex: 1, width: '100%', maxWidth: 54, display: 'flex', flexDirection: 'column-reverse', gap: 2 }}>
                {d.segments.map((s, j) => (
                  <motion.div key={j}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(s.value / max) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.06 + j * 0.04, ease: EASE }}
                    title={`${s.name}: ${s.value}${unit}`}
                    style={{ background: s.color, borderRadius: j === d.segments.length - 1 ? '5px 5px 0 0' : 0, minHeight: s.value > 0 ? 3 : 0 }}
                  />
                ))}
              </div>
              <span className="xs" style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>{d.label}</span>
            </div>
          );
        })}
      </div>
      <div className="chart-legend">
        {legend.map((s) => (
          <span key={s.name} className="leg"><i style={{ background: s.color }} />{s.name}</span>
        ))}
      </div>
    </div>
  );
}

/* ---- Donut -------------------------------------------------
   segments: [{ value, color, name }]                            */
export function Donut({ segments, size = 160, thickness = 22, centerLabel, centerSub }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s5)', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: size, height: size, flex: '0 0 auto' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} style={{ stroke: 'var(--line)' }} />
          {segments.map((s, i) => {
            const len = (s.value / total) * c;
            const el = (
              <motion.circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
                strokeWidth={thickness} strokeLinecap="butt" style={{ stroke: s.color }}
                strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }} />
            );
            offset += len;
            return el;
          })}
        </svg>
        {centerLabel != null && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 26, lineHeight: 1 }}>{centerLabel}</div>
              {centerSub && <div className="xs muted">{centerSub}</div>}
            </div>
          </div>
        )}
      </div>
      <div className="chart-legend col">
        {segments.map((s) => (
          <span key={s.name} className="leg"><i style={{ background: s.color }} />{s.name}<b className="num" style={{ marginLeft: 'auto' }}>{s.value}</b></span>
        ))}
      </div>
    </div>
  );
}

/* ---- Progress ring (Apple-watch style) --------------------- */
export function Ring({ value, max = 100, size = 120, thickness = 12, color = 'var(--leaf)', label, sub }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} style={{ stroke: 'var(--line)' }} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} strokeLinecap="round" style={{ stroke: color }}
          strokeDasharray={c} initial={{ strokeDashoffset: c }} whileInView={{ strokeDashoffset: c * (1 - pct) }}
          viewport={{ once: true }} transition={{ duration: 1, ease: EASE }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{label}</div>
          {sub && <div className="xs muted">{sub}</div>}
        </div>
      </div>
    </div>
  );
}
