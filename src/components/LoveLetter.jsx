import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { loveLetter } from '../data/content.js';
import { byId } from '../data/photos.js';
import SplitText from './SplitText.jsx';
import Photo from './Photo.jsx';

const ease = [0.23, 1, 0.32, 1];

// Delicate line flowers for the paper's corners.
function Bloom({ className }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g fill="none" stroke="#c9a457" strokeWidth="1" strokeLinecap="round" opacity=".75">
        <path d="M6 114C30 86 52 62 96 30" />
        <path d="M30 86c-10-2-15-9-14-16 9 1 15 7 14 16zM46 68c-10-3-14-10-12-17 8 2 13 8 12 17zM62 52c-9-4-12-11-9-17 8 3 11 10 9 17z" />
        <path d="M34 83c10 1 16-3 19-10-9-1-15 3-19 10zM50 65c9-1 15-5 16-12-8 0-14 5-16 12z" />
      </g>
      <g transform="translate(96 30)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} rx="6" ry="11" cy="-10" fill="#e7b9c6" fillOpacity=".7" stroke="#c28a9c" strokeWidth=".8" transform={`rotate(${r})`} />
        ))}
        <circle r="4" fill="#d6b46a" />
      </g>
      <g transform="translate(74 16) scale(.55)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} rx="6" ry="11" cy="-10" fill="#d8c1f0" fillOpacity=".75" stroke="#a98bd0" strokeWidth=".8" transform={`rotate(${r})`} />
        ))}
        <circle r="4" fill="#d6b46a" />
      </g>
    </svg>
  );
}

/** Each paragraph is written in: it un-blurs and settles as it reaches the reader. */
function Line({ children, className = '' }) {
  return (
    <motion.p
      className={`paper__p ${className}`}
      initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.2, ease }}
    >
      {children}
    </motion.p>
  );
}

export default function LoveLetter({ onOpenPhoto }) {
  const paperRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: paperRef, offset: ['start 0.7', 'end 0.8'] });
  const ink = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const pinned = byId['side-by-side'];
  const small = byId['cafe-smiles'];
  const n = loveLetter.paragraphs.length;

  return (
    <section id="letter" className="love-letter">
      <div className="love-letter__glow" aria-hidden="true" />
      <div className="container container--narrow">
        <SplitText as="h2" text="From Sanjuna, to Dilmi" className="section-title section-title--light love-letter__title" inView stagger={0.03} />

        <motion.article
          ref={paperRef}
          className="paper paper--long"
          initial={{ opacity: 0, y: 80, rotate: -1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.4, ease }}
        >
          <span className="paper__ink" aria-hidden="true">
            <motion.span style={{ scaleY: ink }} />
          </span>
          <Bloom className="paper__bloom paper__bloom--tl" />
          <Bloom className="paper__bloom paper__bloom--br" />

          <motion.button
            type="button"
            className="polaroid paper__pinned"
            initial={{ rotate: 0, opacity: 0, y: -30 }}
            whileInView={{ rotate: 6, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', duration: 1.1, bounce: 0.35, delay: 0.5 }}
            whileHover={{ rotate: 1, scale: 1.04 }}
            onClick={() => onOpenPhoto(pinned.id)}
            aria-label="Open photo"
          >
            <span className="paper__tape" aria-hidden="true" />
            <span className="polaroid__img">
              <Photo photo={pinned} fit />
            </span>
          </motion.button>

          <p className="paper__greeting paper__greeting--big">{loveLetter.greeting}</p>
          <p className="paper__opener">{loveLetter.opener}</p>

          {loveLetter.paragraphs.map((p, i) => (
            <Line key={i} className={`${i >= n - 2 ? 'paper__p--strong' : ''} ${i === 1 ? 'paper__p--turn' : ''} ${i === 0 ? 'paper__p--drop' : ''}`}>
              {p}
            </Line>
          ))}

          <motion.div
            className="paper__sign-off"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease }}
          >
            <span className="paper__closing">{loveLetter.closing}</span>
            <svg className="paper__sig" viewBox="0 0 320 110" aria-label={loveLetter.signature}>
              <motion.text
                x="10"
                y="78"
                className="paper__sig-text"
                initial={{ strokeDashoffset: 900, fillOpacity: 0 }}
                whileInView={{ strokeDashoffset: 0, fillOpacity: 1 }}
                viewport={{ once: true }}
                transition={{ strokeDashoffset: { duration: 2.8, ease: 'easeInOut' }, fillOpacity: { duration: 1, delay: 2.2 } }}
              >
                {loveLetter.signature}
              </motion.text>
            </svg>
          </motion.div>

          <motion.button
            type="button"
            className="paper__corner-photo"
            initial={{ opacity: 0, rotate: -14, y: 20 }}
            whileInView={{ opacity: 1, rotate: -5, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease }}
            whileHover={{ rotate: 0, scale: 1.05 }}
            onClick={() => onOpenPhoto(small.id)}
            aria-label="Open photo"
          >
            <Photo photo={small} fit />
          </motion.button>
        </motion.article>
      </div>
    </section>
  );
}
