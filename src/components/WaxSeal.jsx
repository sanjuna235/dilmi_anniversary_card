import { motion } from 'framer-motion';

// Irregular wax outline, so it reads as poured wax rather than a perfect circle.
const WAX_PATH =
  'M50 3c6 0 9 4 14 5s10-1 13 3 2 9 6 13 9 5 10 10-3 9-2 14 5 10 2 14-9 4-11 9-1 11-6 14-10 0-14 3-7 8-13 8-9-4-14-5-10 2-13-2-2-9-6-13-9-4-10-9 3-9 2-14-5-10-2-14 9-4 11-9 1-11 6-14 10 0 14-3 7-8 13-8z';

function SealFace() {
  return (
    <svg viewBox="0 0 100 100" className="seal__svg" aria-hidden="true">
      <defs>
        <radialGradient id="wax" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#8a4cc0" />
          <stop offset="45%" stopColor="#5b2289" />
          <stop offset="100%" stopColor="#2e0f4d" />
        </radialGradient>
        <radialGradient id="waxInner" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#6a2e9c" />
          <stop offset="100%" stopColor="#3d1563" />
        </radialGradient>
      </defs>
      <path d={WAX_PATH} fill="url(#wax)" />
      <circle cx="50" cy="50" r="31" fill="url(#waxInner)" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#2a0c45" strokeOpacity=".55" strokeWidth="2.2" />
      <circle cx="50" cy="50" r="27.5" fill="none" stroke="#d6b46a" strokeOpacity=".55" strokeWidth=".7" strokeDasharray="1.2 2.2" />
      {/* little laurel sprigs pressed into the wax */}
      <g stroke="#d6b46a" strokeOpacity=".5" strokeWidth=".9" fill="none" strokeLinecap="round">
        <path d="M30 63c5 5 12 8 20 8M70 63c-5 5-12 8-20 8" />
        <path d="M34 66l-1 4M38 68.5l-.5 4M62 68.5l.5 4M66 66l1 4" />
      </g>
      <text x="50" y="57" textAnchor="middle" className="seal__initials">S&amp;D</text>
      <ellipse cx="36" cy="28" rx="10" ry="5" fill="#fff" opacity=".14" transform="rotate(-25 36 28)" />
    </svg>
  );
}

/** The wax seal. When `broken`, it cracks down the middle and both halves fall away. */
export default function WaxSeal({ broken }) {
  return (
    <div className="seal" aria-hidden="true">
      <motion.div
        className="seal__half seal__half--left"
        animate={broken ? { rotate: -24, x: -26, y: 70, opacity: 0 } : { rotate: 0, x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.55, 0, 0.75, 0.2] }}
      >
        <SealFace />
      </motion.div>
      <motion.div
        className="seal__half seal__half--right"
        animate={broken ? { rotate: 20, x: 24, y: 80, opacity: 0 } : { rotate: 0, x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.95, delay: 0.05, ease: [0.55, 0, 0.75, 0.2] }}
      >
        <SealFace />
      </motion.div>
    </div>
  );
}
