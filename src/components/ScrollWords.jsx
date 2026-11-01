import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const blur = useTransform(progress, range, ['blur(3px)', 'blur(0px)']);
  return (
    <span className="sw__word">
      <motion.span style={{ opacity, filter: blur }}>{children}</motion.span>{' '}
    </span>
  );
}

/**
 * Paragraphs whose words light up one by one as they scroll through the screen,
 * as if being read aloud.
 */
export default function ScrollWords({ paragraphs, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.45'] });
  const all = paragraphs.map((p) => p.split(' '));
  const total = all.reduce((n, w) => n + w.length, 0);
  let k = 0;

  if (reduce) {
    return (
      <div className={className}>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {all.map((words, pi) => (
        <p key={pi}>
          {words.map((w) => {
            const start = k / total;
            const end = Math.min(1, start + 3 / total);
            k += 1;
            return (
              <Word key={k} progress={scrollYProgress} range={[start, end]}>
                {w}
              </Word>
            );
          })}
        </p>
      ))}
    </div>
  );
}
