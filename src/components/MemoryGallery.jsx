import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { photos } from '../data/photos.js';
import Reveal from './Reveal.jsx';
import SplitText from './SplitText.jsx';
import PhotoDeck from './PhotoDeck.jsx';
import Photo from './Photo.jsx';

const wallTilt = [-1.2, 0.8, -0.5, 1.4, -1, 0.6, -1.5, 1, -0.4, 1.2, -0.8, 0.5];

/** A photo that tilts towards the pointer in 3D, like a print held in the hand. */
function TiltCard({ photo, i, onOpen }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });
  const shineX = useTransform(sry, [-10, 10], ['0%', '100%']);

  const move = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 16);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 16);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      className="wall__cell"
      initial={{ opacity: 0, y: 50, rotate: wallTilt[i] * 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: wallTilt[i] }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.1, delay: (i % 4) * 0.09, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.button
        type="button"
        className={`wall__item ${i % 3 === 1 ? 'wall__item--framed' : ''}`}
        style={{ rotateX: srx, rotateY: sry }}
        onPointerMove={move}
        onPointerLeave={leave}
        whileTap={{ scale: 0.98 }}
        onClick={() => onOpen(photo.id)}
        aria-label={`Open photo: ${photo.caption}`}
      >
        <span className="wall__img">
          <Photo photo={photo} />
          <motion.span className="wall__shine" style={{ '--shine-x': shineX }} aria-hidden="true" />
        </span>
        <span className="wall__caption">{photo.caption}</span>
      </motion.button>
    </motion.div>
  );
}

export default function MemoryGallery({ onOpenPhoto }) {
  return (
    <section className="memories" aria-labelledby="deck-title">
      <div className="container">
        <div className="memories__intro">
          <div className="memories__copy">
            <SplitText as="h2" text="Shuffle Through Us" className="section-title" inView stagger={0.03} />
            <Reveal as="p" className="memories__lead" delay={0.15}>
              A little pile of us, waiting to be picked up. Swipe one away to see the next, or tap it to hold it closer.
            </Reveal>
          </div>
          <Reveal delay={0.2} className="memories__deck">
            <PhotoDeck onOpenPhoto={onOpenPhoto} />
          </Reveal>
        </div>

        <div className="memories__wall-head">
          <SplitText as="h3" text="Every one of them" className="memories__wall-title" inView stagger={0.04} />
        </div>
        <div className="wall">
          {photos.map((p, i) => (
            <TiltCard key={p.id} photo={p} i={i} onOpen={onOpenPhoto} />
          ))}
        </div>
      </div>
    </section>
  );
}
