import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

/** Animated count-up that fires when scrolled into view. */
export default function Counter({ to, decimals = 0, suffix = '', prefix = '', className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1.4, bounce: 0 });

  useEffect(() => { if (inView) mv.set(to); }, [inView, to, mv]);

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) {
        const n = decimals ? v.toFixed(decimals) : Math.round(v);
        ref.current.textContent = prefix + Number(n).toLocaleString() + suffix;
      }
    });
  }, [spring, decimals, prefix, suffix]);

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
