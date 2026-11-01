import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Ambient from './Ambient.jsx';
import EnvelopeAnimation from './EnvelopeAnimation.jsx';
import LetterReveal from './LetterReveal.jsx';
import CinematicTransition from './CinematicTransition.jsx';
import { ANNIVERSARY_LABEL } from '../data/content.js';
import { photos } from '../data/photos.js';

const ease = [0.23, 1, 0.32, 1];

const fadeUp = (delay, dur = 1.4) => ({
  initial: { opacity: 0, y: 14, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, filter: 'blur(6px)', transition: { duration: 0.6 } },
  transition: { duration: dur, delay, ease },
});

/**
 * Scenes 1–4: the world, the envelope, the letter and the cinematic transition.
 */
export default function OpeningScene({ onComplete }) {
  // world: the lines appear · envelope: the envelope waits · letter · cinema
  const [phase, setPhase] = useState('world');
  const [openSignal, setOpenSignal] = useState(0);

  // Warm the browser cache with the photos used in the transition.
  useEffect(() => {
    photos.slice(0, 8).forEach((p) => {
      const img = new Image();
      img.src = p.src;
    });
  }, []);

  useEffect(() => {
    if (phase !== 'world') return undefined;
    const t = setTimeout(() => setPhase('envelope'), 5600);
    return () => clearTimeout(t);
  }, [phase]);

  const inWorld = phase === 'world' || phase === 'envelope';

  return (
    <motion.div
      className="opening"
      exit={{ opacity: 0, transition: { duration: 0.9 } }}
      role="dialog"
      aria-label="A little something for Dilmi"
    >
      <div className="opening__sky" aria-hidden="true" />
      <div className="opening__light" aria-hidden="true" />
      <Ambient density={phase === 'cinema' ? 0.7 : 1} />

      <AnimatePresence mode="wait">
        {inWorld && (
          <motion.section
            key="world"
            className="world"
            data-lenis-prevent
            exit={{ opacity: 0, scale: 1.25, filter: 'blur(10px)', transition: { duration: 1, ease: [0.77, 0, 0.175, 1] } }}
          >
            <div className={`world__words ${phase === 'envelope' ? 'is-compact' : ''}`}>
              <AnimatePresence>
                {phase === 'world' && (
                  <motion.p key="l1" className="world__line world__line--small" {...fadeUp(0.6)}>
                    A little something…
                  </motion.p>
                )}
                {phase === 'world' && (
                  <motion.p key="l2" className="world__line" {...fadeUp(2.1)}>
                    Made with love, just for you.
                  </motion.p>
                )}
              </AnimatePresence>
              <motion.h1
                layout
                className="world__name"
                initial={{ opacity: 0, scale: 0.92, filter: 'blur(14px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 2, delay: phase === 'world' ? 3.5 : 0, ease, layout: { duration: 1.1, ease: [0.77, 0, 0.175, 1] } }}
              >
                Dilmi
              </motion.h1>
            </div>

            <AnimatePresence>
              {phase === 'envelope' && (
                <motion.div
                  key="env"
                  className="world__envelope"
                  initial={{ opacity: 0, y: 40, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1.6, delay: 0.5, ease }}
                >
                  <motion.p className="world__whisper" {...fadeUp(1.4, 1.2)}>
                    Someone has written something for you.
                  </motion.p>
                  <EnvelopeAnimation openSignal={openSignal} onOpened={() => setPhase('letter')} />
                  <motion.button
                    type="button"
                    className="btn btn--gold"
                    {...fadeUp(2.2, 1)}
                    onClick={() => setOpenSignal((n) => n + 1)}
                  >
                    <Mail size={18} strokeWidth={1.6} aria-hidden="true" />
                    Open Your Letter
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.footer className="world__foot" {...fadeUp(4.6, 1.4)}>
              <span className="world__date">{ANNIVERSARY_LABEL}</span>
              <span className="world__hint">There's something waiting for you…</span>
            </motion.footer>
          </motion.section>
        )}

        {phase === 'letter' && <LetterReveal key="letter" onContinue={() => setPhase('cinema')} />}

        {phase === 'cinema' && <CinematicTransition key="cinema" onComplete={onComplete} />}
      </AnimatePresence>
    </motion.div>
  );
}
