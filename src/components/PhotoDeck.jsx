import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Hand, Maximize2 } from 'lucide-react';
import { photos } from '../data/photos.js';

// Each card gets a fixed little tilt so the pile looks hand-placed.
const tilts = [-4, 3, -2, 5, -6, 2, -3, 4, -5, 1, 6, -1];

/**
 * A pile of polaroids. Flick (or tap "next") to send the top one
 * to the back of the pile; tap the photo to see it full screen.
 */
export default function PhotoDeck({ onOpenPhoto }) {
  const [order, setOrder] = useState(() => {
    // start the pile on a different photo from the hero
    const ids = photos.map((_, i) => i);
    return [...ids.slice(3), ...ids.slice(0, 3)];
  });
  const [exitX, setExitX] = useState(300);
  const dragged = useRef(false);

  const next = (x = 300) => {
    setExitX(x);
    setOrder((o) => [...o.slice(1), o[0]]);
  };

  const visible = order.slice(0, 4);

  return (
    <div className="deck">
      <div className="deck__pile">
        <AnimatePresence initial={false} custom={exitX}>
          {visible
            .map((idx, depth) => {
              const p = photos[idx];
              const top = depth === 0;
              return (
                <motion.div
                  key={p.id}
                  className="deck__card polaroid"
                  style={{ zIndex: 10 - depth }}
                  custom={exitX}
                  initial={{ opacity: 0, scale: 0.9, y: 30, rotate: tilts[idx] }}
                  animate={{
                    opacity: 1,
                    scale: 1 - depth * 0.04,
                    y: depth * -12,
                    rotate: top ? 0 : tilts[idx],
                  }}
                  exit={(x) => ({ x, opacity: 0, rotate: x > 0 ? 18 : -18, transition: { duration: 0.35 } })}
                  transition={{ type: 'spring', duration: 0.6, bounce: 0.2 }}
                  drag={top ? 'x' : false}
                  dragSnapToOrigin
                  dragElastic={0.7}
                  whileDrag={{ scale: 1.03, cursor: 'grabbing' }}
                  onDragStart={() => {
                    dragged.current = true;
                  }}
                  onDragEnd={(_, info) => {
                    setTimeout(() => {
                      dragged.current = false;
                    }, 80);
                    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) {
                      next(info.offset.x > 0 ? 400 : -400);
                    }
                  }}
                >
                  <button
                    type="button"
                    className="polaroid__img deck__img"
                    onClick={() => !dragged.current && onOpenPhoto(p.id)}
                    tabIndex={top ? 0 : -1}
                    aria-label={`Open photo: ${p.caption}`}
                  >
                    <img src={p.src} alt={p.alt} width={p.w} height={p.h} loading="lazy" draggable={false} style={{ objectPosition: p.pos }} />
                    {top && (
                      <span className="deck__zoom" aria-hidden="true">
                        <Maximize2 size={16} strokeWidth={1.6} />
                      </span>
                    )}
                  </button>
                  <span className="polaroid__caption">{p.caption}</span>
                </motion.div>
              );
            })
            .reverse()}
        </AnimatePresence>
      </div>
      <div className="deck__controls">
        <p className="deck__hint">
          <Hand size={16} strokeWidth={1.5} aria-hidden="true" /> Swipe the photo away, or
        </p>
        <button type="button" className="btn btn--ghost-dark" onClick={() => next()}>
          Show me another
        </button>
      </div>
    </div>
  );
}
