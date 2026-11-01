import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

const wrap = (min, max, v) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/**
 * An endless ribbon of words that drifts on its own and speeds up
 * (or reverses) with the way she scrolls.
 */
export default function Marquee({ items, speed = 2.2, tone = 'plum' }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const dir = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    base.set(base.get() - dir.current * speed * (delta / 1000) * (1 + Math.abs(f)));
  });

  const row = (
    <>
      {items.map((t, i) => (
        <span key={i} className={`marquee__item ${i % 2 ? 'marquee__item--serif' : ''}`}>
          {t}
          <svg viewBox="0 0 24 24" className="marquee__star" aria-hidden="true">
            <path d="M12 2l1.8 7.2L21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-2.8z" />
          </svg>
        </span>
      ))}
    </>
  );

  return (
    <div className={`marquee marquee--${tone}`} aria-label={items.join(', ')}>
      <motion.div className="marquee__track" style={{ x }} aria-hidden="true">
        <div className="marquee__row">{row}</div>
        <div className="marquee__row">{row}</div>
      </motion.div>
    </div>
  );
}
