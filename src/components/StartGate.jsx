import { motion } from 'framer-motion';
import { Headphones } from 'lucide-react';
import Ambient from './Ambient.jsx';

const ease = [0.23, 1, 0.32, 1];

/**
 * The very first screen. Browsers only allow sound after the visitor taps,
 * so this tap is what lets the song begin together with the opening.
 */
export default function StartGate({ onStart }) {
  const begin = () => {
    // must run synchronously inside the tap, or phones block the audio
    window.dispatchEvent(new Event('dilmi:play'));
    onStart();
  };

  return (
    <motion.div
      className="gate"
      role="dialog"
      aria-label="Begin"
      exit={{ opacity: 0, transition: { duration: 1.1 } }}
      onClick={begin}
    >
      <div className="opening__sky" aria-hidden="true" />
      <div className="opening__light" aria-hidden="true" />
      <Ambient density={0.8} />

      <motion.div
        className="gate__inner"
        initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.6, delay: 0.2, ease }}
      >
        <p className="gate__for">For</p>
        <p className="gate__name">Dilmi</p>

        <button
          type="button"
          className="gate__btn"
          onClick={(e) => {
            e.stopPropagation();
            begin();
          }}
        >
          <span className="gate__ring" aria-hidden="true" />
          <span className="gate__ring gate__ring--2" aria-hidden="true" />
          <span className="gate__label">Tap to begin</span>
        </button>

        <p className="gate__sound">
          <Headphones size={16} strokeWidth={1.5} aria-hidden="true" />
          Turn your sound on
        </p>
      </motion.div>
    </motion.div>
  );
}
