import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import WaxSeal from './WaxSeal.jsx';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// A fine gold sprig used in the envelope corners.
function Sprig({ className }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true">
      <g fill="none" stroke="#c9a457" strokeWidth=".9" strokeLinecap="round" opacity=".8">
        <path d="M4 56C14 40 26 26 52 8" />
        <path d="M14 42c-6-1-9-5-9-9 5 0 9 3 9 9zM22 33c-6-2-8-7-7-11 5 1 8 5 7 11zM31 24c-5-3-6-8-4-12 5 2 7 7 4 12zM40 17c-4-3-4-8-2-11 4 2 5 7 2 11z" />
        <path d="M17 40c6 1 10-1 12-5-5-1-9 1-12 5zM26 31c6 0 9-3 10-7-5 0-8 3-10 7zM35 22c5-1 8-4 8-8-4 1-7 4-8 8z" />
      </g>
      <circle cx="52" cy="8" r="2.2" fill="#d6b46a" opacity=".8" />
    </svg>
  );
}

/**
 * A three-dimensional ivory envelope with a purple wax seal.
 * Opening runs as a sequence: lean forward → seal breaks → flap opens → letter slides out.
 */
export default function EnvelopeAnimation({ onOpened, openSignal = 0 }) {
  const [step, setStep] = useState('idle'); // idle | forward | seal | flap | letter
  const started = useRef(false);

  const open = async () => {
    if (started.current) return;
    started.current = true;
    setStep('forward');
    await wait(550);
    setStep('seal');
    await wait(650);
    setStep('flap');
    await wait(900);
    setStep('letter');
    await wait(1300);
    onOpened?.();
  };

  useEffect(() => {
    if (openSignal > 0) open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSignal]);

  const opened = step === 'flap' || step === 'letter';

  return (
    <div className="envelope-wrap">
      <motion.button
        type="button"
        className={`envelope ${step !== 'idle' ? 'is-opening' : ''}`}
        onClick={open}
        aria-label="Open your letter"
        disabled={step !== 'idle'}
        animate={
          step === 'idle'
            ? { y: [0, -8, 0], rotateX: 8, rotateZ: [-0.6, 0.6, -0.6], scale: 1 }
            : { y: step === 'letter' ? 40 : 0, rotateX: 4, rotateZ: 0, scale: 1.06 }
        }
        transition={
          step === 'idle'
            ? { duration: 5, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
        }
        whileHover={step === 'idle' ? { scale: 1.02 } : undefined}
        whileTap={step === 'idle' ? { scale: 0.97 } : undefined}
      >
        <span className="envelope__glow" aria-hidden="true" />
        <span className="envelope__shadow" aria-hidden="true" />

        {/* inside of the envelope */}
        <span className="envelope__back" aria-hidden="true" />

        {/* the folded letter waiting inside */}
        <motion.span
          className="envelope__letter"
          aria-hidden="true"
          initial={false}
          animate={step === 'letter' ? { y: '-62%' } : { y: '0%' }}
          transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
        >
          <span className="envelope__letter-script">For Dilmi</span>
          <span className="envelope__letter-lines" />
        </motion.span>

        {/* front pocket */}
        <svg className="envelope__front" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="pocketL" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fbf3e3" />
              <stop offset="1" stopColor="#f1e4cb" />
            </linearGradient>
            <linearGradient id="pocketR" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#f8efdc" />
              <stop offset="1" stopColor="#ecdcbf" />
            </linearGradient>
            <linearGradient id="pocketB" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#fffaf0" />
              <stop offset="1" stopColor="#f3e7d0" />
            </linearGradient>
          </defs>
          <path d="M0 0 L150 112 L0 200 Z" fill="url(#pocketL)" />
          <path d="M300 0 L150 112 L300 200 Z" fill="url(#pocketR)" />
          <path d="M0 200 L150 96 L300 200 Z" fill="url(#pocketB)" />
          <path d="M0 200 L150 96 L300 200" fill="none" stroke="#d6b46a" strokeOpacity=".55" strokeWidth=".8" />
          <rect x="5" y="5" width="290" height="190" fill="none" stroke="#d6b46a" strokeOpacity=".7" strokeWidth=".9" />
          <rect x="9" y="9" width="282" height="182" fill="none" stroke="#d6b46a" strokeOpacity=".35" strokeWidth=".5" />
        </svg>
        <Sprig className="envelope__sprig envelope__sprig--bl" />
        <Sprig className="envelope__sprig envelope__sprig--br" />

        {/* top flap: ivory outside, lilac floral lining inside */}
        <motion.span
          className="envelope__flap"
          aria-hidden="true"
          initial={false}
          animate={{ rotateX: opened ? 180 : 0 }}
          transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
          style={{ zIndex: step === 'letter' ? 1 : 5 }}
        >
          <svg className="envelope__flap-face envelope__flap-face--out" viewBox="0 0 300 116" preserveAspectRatio="none">
            <defs>
              <linearGradient id="flapOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f6ecd8" />
                <stop offset="1" stopColor="#fffaf1" />
              </linearGradient>
            </defs>
            <path d="M0 0 L300 0 L150 116 Z" fill="url(#flapOut)" />
            <path d="M5 4 L295 4 L150 110 Z" fill="none" stroke="#d6b46a" strokeOpacity=".75" strokeWidth=".9" />
          </svg>
          <svg className="envelope__flap-face envelope__flap-face--in" viewBox="0 0 300 116" preserveAspectRatio="none">
            <defs>
              <pattern id="liner" width="22" height="22" patternUnits="userSpaceOnUse">
                <rect width="22" height="22" fill="#d9c2f2" />
                <circle cx="11" cy="11" r="2.4" fill="#b892e6" />
                <circle cx="11" cy="7" r="1.4" fill="#c7a6ef" />
                <circle cx="11" cy="15" r="1.4" fill="#c7a6ef" />
                <circle cx="7" cy="11" r="1.4" fill="#c7a6ef" />
                <circle cx="15" cy="11" r="1.4" fill="#c7a6ef" />
                <circle cx="0" cy="0" r="1" fill="#d6b46a" />
                <circle cx="22" cy="22" r="1" fill="#d6b46a" />
              </pattern>
            </defs>
            <path d="M0 116 L300 116 L150 0 Z" fill="url(#liner)" />
          </svg>
        </motion.span>

        <span className="envelope__seal-pos">
          <WaxSeal broken={step !== 'idle' && step !== 'forward'} />
        </span>
      </motion.button>
    </div>
  );
}
