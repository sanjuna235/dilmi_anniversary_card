import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '../lib/scroll.js';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.2);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          className="to-top"
          aria-label="Back to the top"
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.15 } }}
          transition={{ duration: 0.25 }}
          onClick={scrollToTop}
        >
          <ArrowUp size={18} strokeWidth={1.6} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
