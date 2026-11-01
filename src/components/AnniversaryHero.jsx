import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { byId } from '../data/photos.js';
import { ANNIVERSARY_LABEL } from '../data/content.js';
import Photo from './Photo.jsx';
import Ambient from './Ambient.jsx';
import SplitText from './SplitText.jsx';
import { scrollToId } from '../lib/scroll.js';

const ease = [0.23, 1, 0.32, 1];

/** Each layer of the collage follows the pointer by a different amount, for depth. */
function useDepth(mx, my, amount) {
  const x = useSpring(useTransform(mx, [-1, 1], [-amount, amount]), { stiffness: 90, damping: 20 });
  const y = useSpring(useTransform(my, [-1, 1], [-amount, amount]), { stiffness: 90, damping: 20 });
  return { x, y };
}

export default function AnniversaryHero({ onOpenPhoto }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const artY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);

  const main = byId['white-saree'];
  const pol = byId['green-hills'];
  const oval = byId['park-bench'];
  const d1 = useDepth(mx, my, 10);
  const d2 = useDepth(mx, my, 26);
  const d3 = useDepth(mx, my, 38);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return undefined;
    const move = (e) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [mx, my]);

  return (
    <section id="us" className="hero" ref={ref}>
      <div className="hero__wash" aria-hidden="true" />
      <Ambient tone="day" density={0.5} />

      <div className="hero__inner">
        <motion.div className="hero__text" style={{ y: textY, opacity: textFade }}>
          <motion.p
            className="hero__kicker"
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.32em' }}
            transition={{ duration: 1.8, delay: 0.2, ease }}
          >
            {ANNIVERSARY_LABEL}
          </motion.p>
          <h1 className="hero__title">
            <SplitText text="Three Years" className="hero__line" delay={0.35} />
            <SplitText text="of Us" className="hero__line hero__line--italic" delay={0.75} />
          </h1>
          <motion.p
            className="hero__names"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, delay: 1.2, ease }}
          >
            Sanjuna <span className="hero__amp">&amp;</span> Dilmi
          </motion.p>
          <motion.span
            className="hero__rule"
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 1.5, ease }}
          />
          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.7, ease }}
          >
            Every beautiful story has its favourite chapter. Mine is the one with you.
          </motion.p>
        </motion.div>

        <motion.div className="hero__art" style={{ y: artY }}>
          <motion.div className="hero__halo" style={d1} aria-hidden="true" />
          <motion.button
            type="button"
            className="hero__frame"
            style={d1}
            initial={{ opacity: 0, clipPath: 'inset(100% 0% 0% 0% round 999px 999px 28px 28px)' }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 999px 999px 28px 28px)' }}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.77, 0, 0.175, 1] }}
            onClick={() => onOpenPhoto(main.id)}
            aria-label="Open photo"
          >
            <motion.span className="hero__frame-img" initial={{ scale: 1.3 }} animate={{ scale: 1 }} transition={{ duration: 2.6, delay: 0.3, ease }}>
              <Photo photo={main} eager fit />
            </motion.span>
          </motion.button>

          <motion.button
            type="button"
            className="hero__oval"
            style={d3}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 1.3, ease }}
            onClick={() => onOpenPhoto(oval.id)}
            aria-label="Open photo"
          >
            <Photo photo={oval} eager fit />
          </motion.button>

          <motion.div className="hero__pol-wrap" style={d2}>
            <motion.button
              type="button"
              className="polaroid hero__polaroid"
              initial={{ opacity: 0, rotate: 0, y: 60 }}
              animate={{ opacity: 1, rotate: -8, y: 0 }}
              transition={{ duration: 1.5, delay: 1.0, ease }}
              whileHover={{ rotate: -2, scale: 1.04 }}
              onClick={() => onOpenPhoto(pol.id)}
              aria-label="Open photo"
            >
              <span className="polaroid__img">
                <Photo photo={pol} eager fit />
              </span>
              <span className="polaroid__caption">us</span>
            </motion.button>
          </motion.div>

          <motion.svg
            className="hero__script-heart"
            viewBox="0 0 120 60"
            aria-hidden="true"
            style={d3}
          >
            <motion.path
              d="M6 44 C 30 44, 40 10, 60 22 C 70 28, 62 44, 54 38 C 46 32, 58 8, 76 14 C 92 20, 84 42, 114 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.4, delay: 1.8, ease: [0.65, 0, 0.35, 1] }}
            />
          </motion.svg>
        </motion.div>
      </div>

      <a
        href="#journey"
        className="scroll-cue"
        aria-label="Scroll to our journey"
        onClick={(e) => {
          e.preventDefault();
          scrollToId('journey');
        }}
      >
        <span className="scroll-cue__label">scroll</span>
        <span className="scroll-cue__line" />
      </a>
    </section>
  );
}
