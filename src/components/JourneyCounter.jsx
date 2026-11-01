import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { START_DATE, journeyText } from '../data/content.js';
import { byId } from '../data/photos.js';
import Reveal from './Reveal.jsx';
import SplitText from './SplitText.jsx';
import Photo from './Photo.jsx';

function since(start, now) {
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  // count calendar days in UTC so daylight-saving shifts never drop a day
  const days = Math.round(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / 86400000,
  );
  return { years: Math.floor(months / 12), months, days };
}

function Count({ to, start }) {
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!start) return undefined;
    if (reduce) {
      setValue(to);
      return undefined;
    }
    const c = animate(0, to, { duration: 2.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) });
    return () => c.stop();
  }, [to, start, reduce]);
  return <>{value.toLocaleString('en-GB')}</>;
}

/** A ring that draws itself as the number counts up. */
function Ring({ start, delay }) {
  return (
    <svg className="stat__ring" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="56" className="stat__ring-track" />
      <motion.circle
        cx="60"
        cy="60"
        r="56"
        className="stat__ring-fill"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: start ? 1 : 0 }}
        transition={{ duration: 2.6, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

/** A clock that keeps counting every second we've had. */
function Ticker() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.max(0, Math.floor((now - START_DATE) / 1000));
  const parts = [
    { v: Math.floor(s / 3600).toLocaleString('en-GB'), l: 'hours' },
    { v: String(Math.floor((s % 3600) / 60)).padStart(2, '0'), l: 'minutes' },
    { v: String(s % 60).padStart(2, '0'), l: 'seconds' },
  ];
  return (
    <div className="ticker">
      <p className="ticker__lead">…and still counting</p>
      <div className="ticker__row" aria-live="off">
        {parts.map((p) => (
          <span key={p.l} className="ticker__part">
            <span className="ticker__num">{p.v}</span>
            <span className="ticker__label">{p.l}</span>
          </span>
        ))}
      </div>
      <p className="ticker__tail">of us.</p>
    </div>
  );
}

export default function JourneyCounter({ onOpenPhoto }) {
  const ref = useRef(null);
  const storyRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start end', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.04, 1]);
  const t = since(START_DATE, new Date());
  const wide = byId['golden-hillside'];

  const stats = [
    { value: Math.max(t.years, 3), label: 'Years', note: 'of you and me' },
    { value: Math.max(t.months, 36), label: 'Months', note: 'of little moments' },
    { value: Math.max(t.days, 1095), label: 'Days', note: 'and every one counted', plus: true },
  ];

  return (
    <section id="journey" className="journey">
      <div className="container">
        <SplitText as="h2" text="How Far We've Come…" className="section-title journey__title" inView stagger={0.025} />

        <div className="journey__stats" ref={ref}>
          {stats.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 0.14}>
              <Ring start={inView} delay={i * 0.14} />
              <span className="stat__value">
                <Count to={s.value} start={inView} />
                {s.plus ? '+' : ''}
              </span>
              <span className="stat__label">{s.label}</span>
              <span className="stat__note">{s.note}</span>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <Ticker />
        </Reveal>

        <div className="journey__story" ref={storyRef}>
          <motion.button
            type="button"
            className="journey__wide"
            onClick={() => onOpenPhoto(wide.id)}
            aria-label="Open photo"
            initial={{ clipPath: 'inset(18% 12% 18% 12% round 24px)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
            viewport={{ once: true, margin: '0px 0px -20% 0px' }}
            transition={{ duration: 1.6, ease: [0.77, 0, 0.175, 1] }}
          >
            <motion.span className="journey__wide-img" style={{ scale: imgScale }}>
              <Photo photo={wide} fit />
            </motion.span>
          </motion.button>
          <div className="journey__text">
            {journeyText.map((p, i) => (
              <Reveal as="p" key={i} delay={i * 0.12} className={i === 2 ? 'journey__em' : ''}>
                {i === 2 ? (
                  <>
                    We haven't had a perfect journey, but it has been <em>our</em> journey.
                  </>
                ) : (
                  p
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
