import { motion } from 'framer-motion';

/** Standard page wrapper: max-width container + enter/exit transition. */
export default function Page({ children, wide = false, bare = false }) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
  if (bare) return content;
  return <div className="page" style={wide ? { maxWidth: '100%' } : undefined}>{content}</div>;
}
