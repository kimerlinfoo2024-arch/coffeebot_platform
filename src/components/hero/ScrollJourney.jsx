import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../store/useStore';
import { batchTotals } from '../../lib/calc';
import { JCUP, JPILE, JSCRUB, BEAN, Svg } from '../../data/art';
import './scroll.css';

gsap.registerPlugin(ScrollTrigger);

const BEANS = [
  { l: '18%', t: '22%', s: 70,  r: -30 },
  { l: '74%', t: '28%', s: 56,  r: 40 },
  { l: '82%', t: '64%', s: 64,  r: 15 },
  { l: '24%', t: '68%', s: 44,  r: 70 },
];

const SCENES = [
  { step: 'Step 1 · Brew', text: 'Every cup from a CoffeeBot machine leaves about 20 g of used grounds.' },
  { step: 'Step 2 · Collect', text: 'CoffeeBot collects and dries only what upcoming activities need — around the weather.' },
  { step: 'Step 3 · Transform', text: 'Those grounds become scrubs, soaps, candles and planters — made by schools and partners.' },
  { step: 'Step 4 · Impact', text: 'And every gram is counted as measurable sustainability impact.' },
];

export default function ScrollJourney() {
  const reusedKg = useStore((s) => batchTotals(s.batches).reused);
  const people = useStore((s) => s.reach.people);
  const partners = useStore((s) => s.partners.length);

  const root = useRef(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const mobile = typeof window !== 'undefined' && window.matchMedia?.('(max-width: 760px)').matches;
  const stacked = reduce || mobile;

  useLayoutEffect(() => {
    if (stacked) return;
    const ctx = gsap.context((self) => {
      const q = self.selector;
      const [cup] = q('.cup');
      const [pile] = q('.pile');
      const [product] = q('.product');
      const [metrics] = q('.jmetrics');
      const [word] = q('.journey-word');
      const [hint] = q('.journey-hint');
      const beans = q('.jbeans .bean');
      const caps = q('.jcaption');

      gsap.set(cup, { xPercent: -50, yPercent: -50 });
      gsap.set(pile, { xPercent: -50, yPercent: -50, scale: 0.3, opacity: 0 });
      gsap.set(product, { xPercent: -50, yPercent: -50, scale: 0.35, opacity: 0, rotation: -22 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.journey-track',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          pin: '.journey-stage',
          anticipatePin: 1,
        },
      });

      // captions crossfade across four equal segments
      caps.forEach((c, i) => {
        tl.fromTo(c, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, i)
          .to(c, { opacity: 0, y: -24, duration: 0.6 }, i + 0.9);
      });

      // scene 1 -> 2 : cup tips out, grounds pile rises
      tl.to(cup, { y: 60, rotation: 10, scale: 0.8, opacity: 0, duration: 1 }, 0.9)
        .to(pile, { scale: 1, opacity: 1, duration: 1 }, 1.0);

      // scene 2 -> 3 : pile morphs into a product (the "open & move")
      tl.to(pile, { scale: 0.45, y: -30, opacity: 0, duration: 1 }, 2.0)
        .to(product, { opacity: 1, scale: 1, rotation: 0, duration: 1.2 }, 2.0)
        .to(product, { y: -16, duration: 0.5, yoyo: true, repeat: 1 }, 3.0);

      // scene 3 -> 4 : product lifts away, metrics resolve in
      tl.to(product, { y: -160, scale: 0.6, opacity: 0, duration: 1 }, 3.2)
        .fromTo(metrics, { opacity: 0, scale: 0.9, yPercent: -40 }, { opacity: 1, scale: 1, yPercent: -50, duration: 1 }, 3.5);

      // ambient: wordmark + beans parallax across the whole journey
      tl.to(word, { yPercent: -18, opacity: 0.04, duration: 4 }, 0);
      beans.forEach((b, i) => {
        tl.to(b, { y: (i % 2 ? -1 : 1) * (120 + i * 40), rotation: `+=${30 + i * 10}`, duration: 4 }, 0);
      });
      if (hint) tl.to(hint, { opacity: 0, duration: 0.4 }, 0.2);
    }, root);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); ctx.revert(); };
  }, [stacked]);

  if (stacked) {
    const art = [JCUP, JPILE, JSCRUB, null];
    const bg = ['var(--bg)', '#E7DED0', '#E5E3D6', 'var(--brew)'];
    return (
      <div className="journey-fallback" ref={root}>
        {SCENES.map((s, i) => (
          <motion.section
            key={i} className="jscene" style={{ background: bg[i], color: i === 3 ? '#fff' : undefined }}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }} transition={{ duration: 0.5 }}
          >
            {art[i] && <div className="art"><Svg markup={art[i]} /></div>}
            {i === 3 && (
              <div className="row wrap" style={{ justifyContent: 'center', gap: 'var(--s6)', color: '#fff' }}>
                <div><b className="display-xl">{reusedKg.toLocaleString()} kg</b><div className="small">confirmed reused</div></div>
                <div><b className="display-xl">{people.toLocaleString()}</b><div className="small">people reached</div></div>
              </div>
            )}
            <div><span className="eyebrow">{s.step}</span><h2>{s.text}</h2></div>
          </motion.section>
        ))}
      </div>
    );
  }

  return (
    <div className="journey" ref={root}>
      <div className="journey-track">
        <div className="journey-stage">
          <div className="journey-bg-css" />
          <div className="journey-word" aria-hidden="true">GROUNDS</div>

          <div className="jbeans" aria-hidden="true">
            {BEANS.map((b, i) => (
              <div key={i} className="bean" style={{ left: b.l, top: b.t, width: b.s, transform: `rotate(${b.r}deg)` }}
                dangerouslySetInnerHTML={{ __html: BEAN }} />
            ))}
          </div>

          <div className="jlayer cup"><Svg markup={JCUP} /></div>
          <div className="jlayer pile"><Svg markup={JPILE} /></div>
          <div className="jlayer product"><Svg markup={JSCRUB} /></div>

          <div className="jmetrics" aria-hidden="true">
            <div className="m"><b>{reusedKg.toLocaleString()} kg</b><span>confirmed reused</span></div>
            <div className="m"><b>{people.toLocaleString()}</b><span>people reached</span></div>
            <div className="m"><b>{partners}</b><span>reuse partners</span></div>
          </div>

          <div className="jcaptions" aria-hidden="true">
            {SCENES.map((s, i) => (
              <div key={i} className="jcaption"><span className="step">{s.step}</span>{s.text}</div>
            ))}
          </div>

          <div className="journey-hint"><span className="mouse" /><span>Scroll</span></div>
        </div>
      </div>
    </div>
  );
}
