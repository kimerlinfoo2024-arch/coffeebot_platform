import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ART, BEAN, Svg } from '../../data/art';
import './showcase.css';

/* What used grounds can become. In each case the grounds are one
   ingredient among others — the captions say so on purpose. */
const SLIDES = [
  { k: 'scrub', word: 'Scrub', bg: '#E9B79A', title: 'Body scrub',
    text: 'Dried grounds are the exfoliating part of a scrub, mixed with an oil and sugar.' },
  { k: 'soap', word: 'Soap', bg: '#B9D3A4', title: 'Soap bar',
    text: 'Grounds are stirred into a soap base to give the bar a gentle scrubbing texture.' },
  { k: 'candle', word: 'Candle', bg: '#F1CE86', title: 'Candle',
    text: 'A layer of dried grounds decorates a wax candle. The wax, not the grounds, does the burning.' },
  { k: 'planter', word: 'Planter', bg: '#A9D2CB', title: 'Planter pot',
    text: 'Grounds are pressed with a binder such as paper pulp or clay to form a small pot.' },
  { k: 'compost', word: 'Compost', bg: '#C9BEE8', title: 'Compost',
    text: 'Fresh grounds go into compost as one part of a mix with drier material like leaves.' },
];

/* floating beans — a different scatter per slide, like the reference */
const SCATTER = [
  [{ l: 14, t: 16, s: 9, r: -30 }, { l: 76, t: 12, s: 7, r: 40 }, { l: 84, t: 58, s: 10, r: 15 }, { l: 6, t: 60, s: 15, r: -12, blur: true }],
  [{ l: 20, t: 10, s: 8, r: 25 },  { l: 82, t: 20, s: 9, r: -20 }, { l: 70, t: 66, s: 7, r: 60 }, { l: 4, t: 54, s: 16, r: 30, blur: true }],
  [{ l: 10, t: 22, s: 8, r: 70 },  { l: 72, t: 10, s: 10, r: -45 }, { l: 88, t: 50, s: 8, r: 10 }, { l: 16, t: 66, s: 14, r: -25, blur: true }],
];

const EASE = [0.76, 0, 0.24, 1];
const DUR = 0.85;
const HOLD = 4500; // ms each product stays on screen while playing

function Slide({ slide, index, dir, animate }) {
  const beans = SCATTER[index % SCATTER.length];
  const from = (px) => (animate ? { x: dir * px, opacity: 0 } : false);
  return (
    <motion.div
      className="show-slide" style={{ background: slide.bg }}
      initial={animate ? { clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' } : false}
      animate={{ clipPath: 'inset(0 0 0 0)' }}
      transition={{ duration: DUR, ease: EASE }}
    >
      <motion.div className="show-word" aria-hidden="true"
        initial={from(220)} animate={{ x: 0, opacity: 1 }} transition={{ duration: DUR, ease: EASE }}>
        {slide.word}
      </motion.div>

      {beans.map((b, i) => (
        <motion.div key={i} className={`show-bean ${b.blur ? 'blur' : ''}`} aria-hidden="true"
          style={{ left: `${b.l}%`, top: `${b.t}%`, width: `${b.s}%`, '--r': `${b.r}deg`, '--d': `${i * -1.3}s` }}
          initial={animate ? { x: dir * (140 + i * 60), opacity: 0 } : false} animate={{ x: 0, opacity: 1 }}
          transition={{ duration: DUR + 0.1 * i, ease: EASE }}>
          <span dangerouslySetInnerHTML={{ __html: BEAN }} />
        </motion.div>
      ))}

      <motion.div className="show-product"
        initial={animate ? { x: dir * 120, rotate: dir * 8, opacity: 0 } : false} animate={{ x: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: DUR, ease: EASE, delay: 0.05 }}>
        <Svg markup={ART[slide.k]} />
      </motion.div>
    </motion.div>
  );
}

export default function GroundsShowcase() {
  const reduce = useReducedMotion();
  const [state, setState] = useState({ idx: 0, prev: 0, dir: 1 });
  const { idx, prev, dir } = state;
  const n = SLIDES.length;
  const slide = SLIDES[idx];

  const goTo = (to) => setState((s) => (to === s.idx ? s : { idx: to, prev: s.idx, dir: to > s.idx ? 1 : -1 }));
  const step = (d) => setState((s) => ({ idx: (s.idx + d + n) % n, prev: s.idx, dir: d }));
  const onKey = (e) => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  };

  /* Autoplay: runs while the carousel is on screen, and waits while the
     visitor is hovering, tabbing through it, or has the tab in the background.
     Off by default for reduced-motion visitors, who can still start it. */
  const root = useRef(null);
  const inView = useInView(root, { amount: 0.5 });
  const [playing, setPlaying] = useState(!reduce);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const running = playing && inView && tabVisible && !hover && !focus;

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => step(1), HOLD);
    return () => clearTimeout(t);
  }, [running, idx]);

  return (
    <section className="show" ref={root} aria-roledescription="carousel" aria-label="What used coffee grounds can become" onKeyDown={onKey}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHover(true); }} onPointerLeave={() => setHover(false)}
      onFocus={(e) => setFocus(e.target.matches(':focus-visible'))} onBlur={() => setFocus(false)}>
      <motion.div className="show-stage" onPanEnd={(e, info) => { if (Math.abs(info.offset.x) > 60) step(info.offset.x < 0 ? 1 : -1); }}>
        {/* the outgoing slide stays underneath while the new one wipes over it */}
        {!reduce && prev !== idx && <Slide key={`under-${prev}`} slide={SLIDES[prev]} index={prev} dir={dir} animate={false} />}
        <Slide key={idx} slide={slide} index={idx} dir={dir} animate={!reduce} />
      </motion.div>

      <div className="show-tabs" role="tablist" aria-label="Products">
        {SLIDES.map((s, i) => (
          <button key={s.k} role="tab" aria-selected={i === idx} onClick={() => goTo(i)}>
            {s.word}
            {i === idx && playing && <i key={idx} className="show-progress" style={{ animationDuration: `${HOLD}ms`, animationPlayState: running ? 'running' : 'paused' }} />}
          </button>
        ))}
      </div>

      <div className="show-caption" aria-live={playing ? 'off' : 'polite'}>
        <motion.div key={idx} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: reduce ? 0 : 0.35 }}>
          <b>{slide.title}</b>
          <span>{slide.text}</span>
        </motion.div>
      </div>

      <button className="show-toggle" onClick={() => setPlaying((v) => !v)} aria-label={playing ? 'Pause the slideshow' : 'Play the slideshow'}>
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="5" height="16" rx="1.5" fill="currentColor" /><rect x="14" y="4" width="5" height="16" rx="1.5" fill="currentColor" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8L7 4Z" fill="currentColor" /></svg>
        )}
      </button>
      <button className="show-arrow prev" onClick={() => step(-1)} aria-label="Previous product">←</button>
      <button className="show-arrow next" onClick={() => step(1)} aria-label="Next product">→</button>
    </section>
  );
}
