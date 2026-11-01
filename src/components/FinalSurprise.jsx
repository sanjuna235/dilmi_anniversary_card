import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { byId } from '../data/photos.js';
import { ANNIVERSARY_LABEL } from '../data/content.js';
import Reveal from './Reveal.jsx';
import Photo from './Photo.jsx';
import Magnetic from './Magnetic.jsx';
import Ambient from './Ambient.jsx';

const ease = [0.23, 1, 0.32, 1];
const HEART = 'M12 21s-7.5-4.6-9.6-9.3C.9 8.4 2.9 4.5 6.6 4.5c2.2 0 3.7 1.3 5.4 3.3 1.7-2 3.2-3.3 5.4-3.3 3.7 0 5.7 3.9 4.2 7.2C19.5 16.4 12 21 12 21z';

function FloatingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: 5 + Math.random() * 90,
        size: 12 + Math.random() * 22,
        delay: Math.random() * 1.6,
        dur: 3.5 + Math.random() * 2.5,
        sway: (Math.random() - 0.5) * 120,
        color: ['#ffffff', '#D6B46A', '#e04a6a', '#f3d9e4'][i % 4],
      })),
    [],
  );
  return (
    <div className="float-hearts" aria-hidden="true">
      {hearts.map((h) => (
        <motion.svg
          key={h.id}
          viewBox="0 0 24 24"
          className="float-hearts__h"
          style={{ left: `${h.left}%`, width: h.size, height: h.size }}
          initial={{ y: 0, x: 0, opacity: 0, scale: 0.6 }}
          animate={{ y: '-110vh', x: h.sway, opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.9] }}
          transition={{ duration: h.dur, delay: h.delay, ease: 'easeOut' }}
        >
          <path d={HEART} fill={h.color} />
        </motion.svg>
      ))}
    </div>
  );
}

export default function FinalSurprise() {
  const [hugged, setHugged] = useState(false);
  const bg = byId['garden-hug'];
  const left = byId['silly-moustache'];
  const right = byId['sunny-day'];

  return (
    <section id="surprise" className="finale">
      <div className="finale__bg" aria-hidden="true">
        <Photo photo={bg} fit />
      </div>
      <div className="finale__veil" aria-hidden="true" />
      <Ambient tone="night" density={0.6} stars={false} />

      <AnimatePresence>
        {hugged && (
          <motion.div
            key="light"
            className="finale__bloom"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0.55], scale: [0.6, 1.4, 1.2] }}
            transition={{ duration: 2.4, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
      {hugged && <FloatingHearts />}

      <div className="container finale__inner">
        <Reveal as="h2" className="finale__title">
          Three Years Down…
        </Reveal>
        <Reveal as="p" className="finale__sub" delay={0.15}>
          A Lifetime of Memories Still Waiting to Be Made.
        </Reveal>
        <Reveal as="p" className="finale__thanks" delay={0.3}>
          Thank you for being part of my world, Dilmi.
        </Reveal>

        <Reveal delay={0.4} className="finale__heart-wrap">
          <motion.svg
            viewBox="0 0 24 24"
            className="finale__heart"
            aria-hidden="true"
            animate={hugged ? { scale: [1, 1.35, 1.15] } : { scale: [1, 1.08, 1, 1.12, 1] }}
            transition={hugged ? { duration: 0.9, ease } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <defs>
              <linearGradient id="heartFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f6e3b0" />
                <stop offset="1" stopColor="#c99a3e" />
              </linearGradient>
            </defs>
            <path d={HEART} fill="url(#heartFill)" />
          </motion.svg>
        </Reveal>

        <AnimatePresence mode="wait">
          {!hugged ? (
            <motion.div key="ask" exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3 } }}>
              <Reveal delay={0.5}>
                <Magnetic strength={0.35}>
                  <button type="button" className="btn btn--gold btn--big btn--pulse" onClick={() => setHugged(true)}>
                    One Last Hug?
                  </button>
                </Magnetic>
              </Reveal>
            </motion.div>
          ) : (
            <motion.div
              key="msg"
              className="finale__message"
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.4, delay: 0.6, ease }}
            >
              <p className="finale__quote">
                If I could go back and choose again, I would still want to meet you, know you, and create this little world with you.
              </p>
              <div className="finale__pair">
                <motion.span
                  className="polaroid finale__mini"
                  initial={{ opacity: 0, rotate: 0, y: 20 }}
                  animate={{ opacity: 1, rotate: -8, y: 0 }}
                  transition={{ duration: 1.1, delay: 1.4, ease }}
                >
                  <span className="polaroid__img">
                    <Photo photo={left} fit />
                  </span>
                </motion.span>
                <motion.span
                  className="polaroid finale__mini"
                  initial={{ opacity: 0, rotate: 0, y: 20 }}
                  animate={{ opacity: 1, rotate: 7, y: 0 }}
                  transition={{ duration: 1.1, delay: 1.6, ease }}
                >
                  <span className="polaroid__img">
                    <Photo photo={right} fit />
                  </span>
                </motion.span>
              </div>
              <motion.p className="finale__happy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, delay: 2.2 }}>
                Happy 3rd Anniversary, My Love.
              </motion.p>
              <motion.p className="finale__sign" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 2.8 }}>
                With love, Sanjuna.
                <span className="finale__date">{ANNIVERSARY_LABEL}</span>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
