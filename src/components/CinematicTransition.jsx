import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { byId } from '../data/photos.js';

const ease = [0.23, 1, 0.32, 1];

// The photographs that drift in and settle into a scattered composition.
const scatter = ['green-hills', 'camera-waterfall', 'park-bench', 'together-indoors', 'side-by-side', 'close-selfie'];
// Where each one comes from before it settles.
const origins = [
  { x: -260, y: -120 },
  { x: 260, y: -140 },
  { x: -300, y: 60 },
  { x: 300, y: 80 },
  { x: -180, y: 220 },
  { x: 200, y: 240 },
];

/** Scene 4: warm light, photographs gathering, then the title. */
export default function CinematicTransition({ onComplete }) {
  const [ready, setReady] = useState(false);
  const hero = byId['garden-hug'];
  const photoStart = 1.0;
  const photoStep = 0.42;
  const centerAt = photoStart + scatter.length * photoStep + 0.2;
  const titleAt = centerAt + 1.1;

  useEffect(() => {
    const t = setTimeout(() => setReady(true), (titleAt + 2.6) * 1000);
    return () => clearTimeout(t);
  }, [titleAt]);

  return (
    <motion.section
      className="cinema"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      {/* warm golden light washes over the screen, then settles */}
      <motion.div
        className="cinema__flash"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.95, 0.18] }}
        transition={{ duration: 2.4, times: [0, 0.35, 1], ease: 'easeInOut' }}
      />
      {/* lavender light streaks drifting across */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="cinema__streak"
          aria-hidden="true"
          style={{ top: `${22 + i * 26}%` }}
          initial={{ x: '-60vw', opacity: 0 }}
          animate={{ x: '120vw', opacity: [0, 0.7, 0] }}
          transition={{ duration: 4.5 + i, delay: 0.4 + i * 0.6, ease: 'easeInOut' }}
        />
      ))}

      <div className="cinema__stage">
        {scatter.map((id, i) => {
          const p = byId[id];
          return (
            <motion.figure
              key={id}
              className={`cinema__photo cinema__photo--${i + 1}`}
              initial={{ opacity: 0, x: origins[i].x, y: origins[i].y, scale: 1.25, filter: 'blur(14px)' }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.6, delay: photoStart + i * photoStep, ease }}
            >
              <img src={p.src} alt={p.alt} width={p.w} height={p.h} style={{ objectPosition: p.pos }} />
            </motion.figure>
          );
        })}

        <div className="cinema__center">
          <motion.figure
            className="cinema__hero"
            initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.8, delay: centerAt, ease }}
          >
            <img src={hero.src} alt={hero.alt} width={hero.w} height={hero.h} style={{ objectPosition: hero.pos }} />
          </motion.figure>

          <motion.h2
            className="cinema__title"
            initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.6, delay: titleAt, ease }}
          >
            Three Years of Us
          </motion.h2>
          <motion.p
            className="cinema__names"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: titleAt + 0.7, ease }}
          >
            Sanjuna &amp; Dilmi
          </motion.p>
          <motion.p
            className="cinema__quote"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: titleAt + 1.4, ease }}
          >
            Some memories become part of who we are. You're part of mine.
          </motion.p>
          <motion.button
            type="button"
            className="btn btn--gold cinema__enter"
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 1, ease }}
            onClick={onComplete}
            tabIndex={ready ? 0 : -1}
          >
            Enter Our Little World
            <ChevronDown size={18} strokeWidth={1.6} aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
