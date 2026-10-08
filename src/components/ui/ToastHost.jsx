import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

export default function ToastHost() {
  const toast = useStore((s) => s.toast);
  const [shown, setShown] = useState(null);

  useEffect(() => {
    if (!toast) return;
    setShown(toast);
    const t = setTimeout(() => setShown(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          className="toast" role="status" aria-live="polite"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {shown.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
