import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { photos } from '../data/photos.js';
import { lockScroll, unlockScroll } from '../lib/scroll.js';

const SWIPE = 70;

/** Full-screen photo viewer with keyboard, button and swipe navigation. */
export default function Lightbox({ index, onClose, onChange }) {
  const open = index !== null && index !== undefined;
  const [dir, setDir] = useState(0);
  const closeRef = useRef(null);
  const lastFocus = useRef(null);

  const go = useCallback(
    (delta) => {
      setDir(delta);
      onChange((i) => (i + delta + photos.length) % photos.length);
    },
    [onChange],
  );

  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    lockScroll();
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockScroll();
      lastFocus.current?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, go]);

  const photo = open ? photos[index] : null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <div className="lightbox__bar" onClick={(e) => e.stopPropagation()}>
            <span className="lightbox__count">
              {index + 1} / {photos.length}
            </span>
            <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Close photo viewer">
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          <div className="lightbox__stage">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.figure
                key={photo.id}
                className="lightbox__figure"
                custom={dir}
                initial={{ opacity: 0, x: dir * 60, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: dir * -60, scale: 0.97, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE || info.velocity.x < -400) go(1);
                  else if (info.offset.x > SWIPE || info.velocity.x > 400) go(-1);
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <img src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} draggable={false} />
                <figcaption>{photo.caption}</figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="icon-btn lightbox__nav lightbox__nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={26} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="icon-btn lightbox__nav lightbox__nav--next"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={26} strokeWidth={1.5} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
