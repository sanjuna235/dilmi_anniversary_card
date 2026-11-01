import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import OpeningScene from './components/OpeningScene.jsx';
import Anniversary from './pages/Anniversary.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';
import CursorGlow from './components/CursorGlow.jsx';
import { lockScroll, startSmoothScroll, unlockScroll } from './lib/scroll.js';

// `?skip` jumps straight to the main page (handy while editing).
const skipIntro = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('skip');

export default function App() {
  const [stage, setStage] = useState(skipIntro ? 'main' : 'opening');

  useEffect(() => {
    startSmoothScroll();
  }, []);

  useEffect(() => {
    // The opening is a fixed, full-screen experience: hold the page still until it is done.
    if (stage !== 'opening') {
      window.scrollTo(0, 0);
      return undefined;
    }
    lockScroll();
    return () => unlockScroll();
  }, [stage]);

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.23, 1, 0.32, 1] }}>
      <AnimatePresence mode="wait">
        {stage === 'opening' ? (
          <OpeningScene key="opening" onComplete={() => setStage('main')} />
        ) : (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
            <Anniversary />
          </motion.div>
        )}
      </AnimatePresence>
      <MusicPlayer />
      <CursorGlow />
    </MotionConfig>
  );
}
