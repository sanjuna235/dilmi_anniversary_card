import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Music2, Pause, Play } from 'lucide-react';
import { createMusicBox } from './musicBox.js';

// Drop a track (mp3 / m4a / ogg) into src/assets/music/ and it is used instead of the music box.
const tracks = Object.values(
  import.meta.glob('../assets/music/*.{mp3,m4a,ogg,wav}', { eager: true, query: '?url', import: 'default' }),
);
const trackUrl = tracks[0] || null;
// Shown under the play button when a track is used.
const TRACK_LABEL = 'Sriyawe · Krishan Karunarathna';

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const boxRef = useRef(null);
  const userPaused = useRef(false);

  // Start the song as soon as the page loads. Most browsers block sound until the
  // visitor has touched the page, so if that happens the song starts on her first
  // tap, click or key press instead (unless she has paused it herself).
  useEffect(() => {
    const a = audioRef.current;
    if (!trackUrl || !a) return undefined;

    const fadeIn = () => {
      a.volume = 0;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / 2500);
        a.volume = t;
        if (t < 1 && !a.paused) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const events = ['pointerdown', 'keydown', 'touchend'];
    const remove = () => events.forEach((e) => window.removeEventListener(e, onGesture, true));
    function onGesture(e) {
      // a tap on the player itself is handled by its own button
      if (e.target.closest?.('.player') || userPaused.current || !a.paused) {
        remove();
        return;
      }
      a.play()
        .then(() => {
          fadeIn();
          remove();
        })
        .catch(() => {});
    }

    a.play()
      .then(fadeIn)
      .catch(() => events.forEach((e) => window.addEventListener(e, onGesture, true)));

    return remove;
  }, []);

  useEffect(() => {
    if (!playing) return undefined;
    let raf;
    const tick = () => {
      if (trackUrl && audioRef.current) {
        const a = audioRef.current;
        setProgress(a.duration ? a.currentTime / a.duration : 0);
      } else if (boxRef.current) {
        setProgress(boxRef.current.progress() ?? 0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = async () => {
    if (trackUrl) {
      const a = audioRef.current;
      if (a.paused) {
        userPaused.current = false;
        a.volume = 1;
        await a.play().catch(() => {});
      } else {
        userPaused.current = true;
        a.pause();
      }
      return;
    }
    if (!boxRef.current) boxRef.current = createMusicBox();
    if (!boxRef.current) return;
    if (playing) {
      boxRef.current.stop();
      setPlaying(false);
    } else {
      await boxRef.current.start();
      setPlaying(true);
    }
  };

  return (
    <motion.div
      className={`player ${playing ? 'is-playing' : ''}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.2 }}
    >
      {trackUrl && (
        <audio ref={audioRef} src={trackUrl} loop preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      )}
      <button
        type="button"
        className="player__btn"
        onClick={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
        aria-pressed={playing}
      >
        {playing ? <Pause size={18} strokeWidth={1.8} /> : <Play size={18} strokeWidth={1.8} className="player__play" />}
      </button>
      <div className="player__meta">
        <span className="player__title">
          <Music2 size={13} strokeWidth={1.8} aria-hidden="true" />
          {playing ? 'Now playing' : 'Play our song'}
        </span>
        <span className="player__sub">{trackUrl ? TRACK_LABEL : 'A little music box, for you'}</span>
        <span className="player__track" aria-hidden="true">
          <span className="player__fill" style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>
      <span className="player__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </motion.div>
  );
}
