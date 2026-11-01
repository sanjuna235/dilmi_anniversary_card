import { motion } from 'framer-motion';

const ease = [0.23, 1, 0.32, 1];

/**
 * Reveals text one letter at a time, each letter rising out of its own line.
 * Words never break across lines. `inView` waits for scroll instead of playing on mount.
 */
export default function SplitText({ text, as = 'span', className, delay = 0, stagger = 0.035, inView = false }) {
  const Tag = motion[as];
  const words = text.split(' ');
  let i = 0;
  const trigger = inView
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }
    : { initial: 'hidden', animate: 'show' };

  return (
    <Tag className={className} aria-label={text} {...trigger}>
      {words.map((word, w) => [
        <span key={w} className="split__word" aria-hidden="true">
          {[...word].map((ch) => {
            const d = delay + i++ * stagger;
            return (
              <span key={i} className="split__mask">
                <motion.span
                  className="split__char"
                  variants={{
                    hidden: { y: '105%', rotate: 6, opacity: 0 },
                    show: { y: '0%', rotate: 0, opacity: 1, transition: { duration: 1.1, delay: d, ease } },
                  }}
                >
                  {ch}
                </motion.span>
              </span>
            );
          })}
        </span>,
        w < words.length - 1 ? ' ' : null,
      ])}
    </Tag>
  );
}
