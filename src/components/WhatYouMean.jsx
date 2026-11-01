import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { byId } from '../data/photos.js';
import { meaningText } from '../data/content.js';
import SplitText from './SplitText.jsx';
import ScrollWords from './ScrollWords.jsx';
import Photo from './Photo.jsx';

export default function WhatYouMean({ onOpenPhoto }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const backY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const frontY = useTransform(scrollYProgress, [0, 1], ['26%', '-22%']);
  const frontR = useTransform(scrollYProgress, [0, 1], [10, -2]);
  const back = byId['camera-waterfall'];
  const front = byId['close-selfie'];

  return (
    <section id="meaning" className="meaning" ref={ref}>
      <div className="container meaning__grid">
        <div className="meaning__art">
          <div className="meaning__sticky">
            <motion.button
              type="button"
              className="meaning__back"
              style={{ y: backY }}
              onClick={() => onOpenPhoto(back.id)}
              aria-label="Open photo"
              initial={{ clipPath: 'inset(0% 0% 100% 0% round 220px 220px 20px 20px)' }}
              whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 220px 220px 20px 20px)' }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 1.6, ease: [0.77, 0, 0.175, 1] }}
            >
              <Photo photo={back} fit />
            </motion.button>
            <motion.button
              type="button"
              className="polaroid meaning__front"
              style={{ y: frontY, rotate: frontR }}
              onClick={() => onOpenPhoto(front.id)}
              aria-label="Open photo"
            >
              <span className="polaroid__img">
                <Photo photo={front} fit />
              </span>
              <span className="polaroid__caption">{front.caption}</span>
            </motion.button>
          </div>
        </div>

        <div className="meaning__text">
          <SplitText as="h2" text="If Only Words Could Explain…" className="section-title" inView stagger={0.022} />
          <ScrollWords paragraphs={meaningText} className="meaning__words" />
        </div>
      </div>
    </section>
  );
}
