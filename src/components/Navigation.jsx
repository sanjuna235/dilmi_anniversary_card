import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { lockScroll, scrollToId, unlockScroll } from '../lib/scroll.js';

const go = (e, id, after) => {
  e.preventDefault();
  after?.();
  // wait a frame so a closing menu has released the scroll lock
  requestAnimationFrame(() => scrollToId(id));
};

export const sections = [
  { id: 'us', label: 'Us' },
  { id: 'journey', label: 'Our Journey' },
  { id: 'memories', label: 'Memories' },
  { id: 'meaning', label: 'You' },
  { id: 'letter', label: 'The Letter' },
  { id: 'surprise', label: 'For You' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('us');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    lockScroll();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <a href="#us" className="nav__mark" aria-label="Back to the top" onClick={(e) => go(e, 'us')}>
          S <span>&amp;</span> D
        </a>
        <nav className="nav__links" aria-label="Sections">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'is-active' : ''} onClick={(e) => go(e, s.id)}>
              {s.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="nav__toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-sheet"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
          >
            <nav aria-label="Sections">
              {sections.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => go(e, s.id, () => setOpen(false))}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 + i * 0.045, ease: [0.23, 1, 0.32, 1] }}
                >
                  {s.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
