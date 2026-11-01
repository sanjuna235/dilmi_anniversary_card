import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { photos } from '../data/photos.js';
import Reveal from './Reveal.jsx';

// Different heights and lifts so the reel feels hand-arranged, not gridded.
const layout = [
  { h: 'tall', lift: 0, tilt: -2 },
  { h: 'mid', lift: 1, tilt: 2 },
  { h: 'tall', lift: -1, tilt: -1 },
  { h: 'wide', lift: 1, tilt: 1.5 },
  { h: 'mid', lift: -1, tilt: -2.5 },
  { h: 'tall', lift: 0, tilt: 1 },
  { h: 'mid', lift: 1, tilt: -1.5 },
  { h: 'tall', lift: -1, tilt: 2 },
  { h: 'mid', lift: 0, tilt: -1 },
  { h: 'tall', lift: 1, tilt: 1.5 },
  { h: 'small', lift: -1, tilt: -2 },
  { h: 'small', lift: 1, tilt: 2.5 },
];

// The reel shows the photos in a different order from the wall below.
const order = ['camera-waterfall', 'park-bench', 'green-hills', 'golden-hillside', 'together-indoors', 'white-saree', 'close-selfie', 'side-by-side', 'silly-moustache', 'garden-hug', 'cafe-smiles', 'sunny-day'];

function Frame({ photo, i, progress, onOpen }) {
  const l = layout[i];
  // each picture drifts a little against the reel for depth
  const imgX = useTransform(progress, [0, 1], ['-7%', '7%']);
  return (
    <motion.button
      type="button"
      className={`reel__frame reel__frame--${l.h} reel__frame--lift${l.lift}`}
      style={{ rotate: l.tilt }}
      whileHover={{ rotate: 0, scale: 1.03, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
      onClick={() => onOpen(photo.id)}
      aria-label={`Open photo: ${photo.caption}`}
    >
      <span className="reel__img">
        <motion.img
          src={photo.src}
          alt={photo.alt}
          width={photo.w}
          height={photo.h}
          decoding="async"
          draggable={false}
          style={{ x: imgX, objectPosition: photo.pos }}
        />
      </span>
      <span className="reel__caption">{photo.caption}</span>
    </motion.button>
  );
}

/**
 * "Little Moments, Forever Memories": the page pins, and scrolling down
 * glides a reel of every photograph sideways across the screen.
 */
export default function FilmReel({ onOpenPhoto }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [dims, setDims] = useState({ track: 0, vw: 0, vh: 0 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const distance = Math.max(0, dims.track - dims.vw);
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const bar = useTransform(smooth, [0, 1], [0, 1]);
  const items = order.map((id) => photos.find((p) => p.id === id));

  useLayoutEffect(() => {
    if (reduce) return undefined;
    const measure = () => setDims({ track: trackRef.current.scrollWidth, vw: window.innerWidth, vh: window.innerHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [reduce]);

  const intro = (
    <div className="reel__intro">
      <Reveal as="h2" className="reel__title">
        Little Moments, <em>Forever Memories</em>
      </Reveal>
      <Reveal as="p" className="reel__quote" delay={0.15}>
        Sometimes I look at our photographs and realise that some of my happiest memories are simply the moments I got to spend with
        you.
      </Reveal>
      <Reveal as="p" className="reel__hint" delay={0.3}>
        Keep scrolling <span aria-hidden="true">→</span>
      </Reveal>
    </div>
  );

  if (reduce) {
    return (
      <section id="memories" className="reel reel--static">
        {intro}
        <div className="reel__track reel__track--scroll">
          {items.map((p, i) => (
            <Frame key={p.id} photo={p} i={i} progress={scrollYProgress} onOpen={onOpenPhoto} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="memories"
      ref={sectionRef}
      className="reel"
      style={{ height: dims.vh ? distance + dims.vh : '400vh' }}
    >
      <div className="reel__sticky">
        <div className="reel__glow" aria-hidden="true" />
        <motion.div ref={trackRef} className="reel__track" style={{ x }}>
          {intro}
          {items.map((p, i) => (
            <Frame key={p.id} photo={p} i={i} progress={smooth} onOpen={onOpenPhoto} />
          ))}
          <div className="reel__end">
            <p>…and so many more still to come.</p>
          </div>
        </motion.div>
        <div className="reel__progress" aria-hidden="true">
          <motion.span style={{ scaleX: bar }} />
        </div>
      </div>
    </section>
  );
}
