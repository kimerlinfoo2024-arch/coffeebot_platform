import { AnimatePresence, motion } from 'framer-motion';

const COLORS = ['#6B4A2E', '#4C7A47', '#9A6414', '#24727A', '#E9A23B', '#A93C2B'];
const PIECES = Array.from({ length: 28 }, (_, i) => i);

/* Fires a one-shot burst whenever `fire` (a changing key) is truthy/changes. */
export default function Confetti({ fire }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 20 }} aria-hidden="true">
      <AnimatePresence>
        {fire && PIECES.map((i) => {
          const angle = (i / PIECES.length) * Math.PI * 2;
          const dist = 120 + Math.random() * 160;
          return (
            <motion.span
              key={`${fire}-${i}`}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              animate={{
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist + 120,
                opacity: 0, scale: 0.4, rotate: Math.random() * 540 - 270,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1 + Math.random() * 0.5, ease: 'easeOut' }}
              style={{
                position: 'absolute', left: '50%', top: '42%',
                width: 9, height: 13, borderRadius: 2,
                background: COLORS[i % COLORS.length],
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
