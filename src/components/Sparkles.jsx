import { useMemo } from 'react';
import { motion } from 'framer-motion';

/** A handful of golden motes that drift gently around whatever they sit behind. */
export default function Sparkles({ count = 14 }) {
  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 3,
        dur: 4 + Math.random() * 4,
        drift: -20 - Math.random() * 40,
      })),
    [count],
  );

  return (
    <div className="sparkles" aria-hidden="true">
      {motes.map((m) => (
        <motion.span
          key={m.id}
          className="sparkles__mote"
          style={{ left: `${m.left}%`, top: `${m.top}%`, width: m.size, height: m.size }}
          initial={{ opacity: 0, y: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 0], y: m.drift, scale: [0.6, 1, 0.8] }}
          transition={{ duration: m.dur, delay: m.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
