import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/** Gently pulls its child towards the pointer on desktop, then springs back. */
export default function Magnetic({ children, strength = 0.3, className }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const move = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} className={className} style={{ x: sx, y: sy, display: 'inline-block' }} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </motion.div>
  );
}
