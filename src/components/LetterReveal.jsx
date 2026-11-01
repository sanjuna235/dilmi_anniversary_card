import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { openingLetter } from '../data/content.js';
import Sparkles from './Sparkles.jsx';

const ease = [0.23, 1, 0.32, 1];

/** Scene 3: the letter unfolds and its words are written in, one line at a time. */
export default function LetterReveal({ onContinue }) {
  const base = 1.5; // wait for the unfold to finish
  const step = 0.85;
  const n = openingLetter.paragraphs.length;

  const reveal = (i) => ({
    initial: { opacity: 0, y: 8, clipPath: 'inset(0 100% 0 0)' },
    animate: { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)' },
    transition: { duration: 1.3, delay: base + i * step, ease },
  });

  return (
    <motion.section
      className="letter-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)', transition: { duration: 0.9 } }}
    >
      <div className="letter-scene__scroll" data-lenis-prevent>
        <div className="letter-scene__stage">
          <Sparkles count={18} />
          <motion.article
            className="paper paper--opening"
            initial={{ opacity: 0, scaleY: 0.34, rotateX: 55, y: 80 }}
            animate={{ opacity: 1, scaleY: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 1.4, ease: [0.32, 0.72, 0, 1] }}
            aria-label="A letter from Sanjuna"
          >
            <span className="paper__crease paper__crease--1" aria-hidden="true" />
            <span className="paper__crease paper__crease--2" aria-hidden="true" />
            <motion.h2 className="paper__greeting" {...reveal(-0.6)}>
              {openingLetter.greeting}
            </motion.h2>
            {openingLetter.paragraphs.map((p, i) => (
              <motion.p key={i} className="paper__p" {...reveal(i)}>
                {p}
              </motion.p>
            ))}
            <motion.p className="paper__closing" {...reveal(n + 0.2)}>
              {openingLetter.closing}
              <span className="paper__signature">{openingLetter.signature}</span>
            </motion.p>
          </motion.article>

          <motion.div
            className="letter-scene__next"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: base + (n + 1.4) * step, ease }}
          >
            <p className="letter-scene__more">There's more to our story…</p>
            <button type="button" className="btn btn--gold" onClick={onContinue}>
              Step Into Our Memories
              <ArrowRight size={18} strokeWidth={1.6} aria-hidden="true" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
