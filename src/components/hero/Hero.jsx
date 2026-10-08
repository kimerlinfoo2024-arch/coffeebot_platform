import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { PRODUCTS } from '../../data/seed';
import { ART, BEAN, Svg } from '../../data/art';
import ShaderBackdrop from './ShaderBackdrop';
import './hero.css';

const BEAN_POS = [
  { l: '22%', t: '10%', s: 'clamp(54px,8vw,92px)',  r: -30, d: 0 },
  { l: '66%', t: '16%', s: 'clamp(48px,7vw,80px)',  r: 40,  d: 1.2 },
  { l: '86%', t: '56%', s: 'clamp(56px,8vw,96px)',  r: 15,  d: 0.6 },
  { l: '30%', t: '70%', s: 'clamp(36px,5vw,58px)',  r: 70,  d: 2 },
  { l: '-2%', t: '50%', s: 'clamp(110px,16vw,190px)', r: -12, d: 0.3, front: true },
];

export default function Hero({ tagline, children, autoTint = true }) {
  const [idx, setIdx] = useState(0);
  const p = PRODUCTS[idx];
  const heroRef = useRef(null);
  const beansRef = useRef([]);
  const go = (n) => setIdx((i) => (i + n + PRODUCTS.length) % PRODUCTS.length);

  // tint the hero (and optionally the page) to the product colour
  useEffect(() => {
    if (heroRef.current) heroRef.current.style.background = p.bg;
    if (autoTint) {
      document.body.style.background = p.bg;
      return () => { document.body.style.background = ''; };
    }
  }, [p.bg, autoTint]);

  // GSAP: idle float + subtle mouse parallax on the beans
  useLayoutEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      beansRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: -14, rotation: BEAN_POS[i].r + 6,
          duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1,
          delay: BEAN_POS[i].d,
        });
      });
    }, heroRef);

    const onMove = (e) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
      beansRef.current.forEach((el, i) => {
        if (!el) return;
        const depth = BEAN_POS[i].front ? 34 : 16;
        gsap.to(el, { x: dx * depth, overwrite: 'auto', duration: 0.6, ease: 'power2.out' });
        gsap.to(el, { '--py': `${dy * depth}px`, duration: 0.6, ease: 'power2.out' });
      });
    };
    const node = heroRef.current;
    node?.addEventListener('mousemove', onMove);
    return () => { node?.removeEventListener('mousemove', onMove); ctx.revert(); };
  }, []);

  // keyboard arrows
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="hero" ref={heroRef}>
      <div className="hero-bg-css" />
      <ShaderBackdrop />

      {tagline && (
        <div className="hero-tagline"><span className="tag">{tagline}</span></div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`w-${idx}`} className="word"
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 0.92, y: 0 }} exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {p.word}
        </motion.div>
      </AnimatePresence>

      {BEAN_POS.map((b, i) => (
        <div
          key={i}
          ref={(el) => (beansRef.current[i] = el)}
          className={`bean ${b.front ? 'front' : ''}`}
          style={{ left: b.l, top: b.t, '--s': b.s, transform: `rotate(${b.r}deg)` }}
          dangerouslySetInnerHTML={{ __html: BEAN }}
        />
      ))}

      <AnimatePresence mode="wait">
        <motion.div
          key={`p-${idx}`} className="product"
          initial={{ opacity: 0, scale: 0.86, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -16 }}
          transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <Svg markup={ART[p.k]} />
        </motion.div>
      </AnimatePresence>

      <button className="arrow prev" onClick={() => go(-1)} aria-label="Previous product">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button className="arrow next" onClick={() => go(1)} aria-label="Next product">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>

      <div className="dots">
        {PRODUCTS.map((x, i) => (
          <button key={x.k} aria-label={x.word} aria-current={i === idx} onClick={() => setIdx(i)} />
        ))}
      </div>

      <div className="hero-cta">{typeof children === 'function' ? children(p) : children}</div>
    </div>
  );
}
