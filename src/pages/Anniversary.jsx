import { useCallback, useState } from 'react';
import Navigation from '../components/Navigation.jsx';
import AnniversaryHero from '../components/AnniversaryHero.jsx';
import Marquee from '../components/Marquee.jsx';
import JourneyCounter from '../components/JourneyCounter.jsx';
import FilmReel from '../components/FilmReel.jsx';
import MemoryGallery from '../components/MemoryGallery.jsx';
import WhatYouMean from '../components/WhatYouMean.jsx';
import LoveLetter from '../components/LoveLetter.jsx';
import FinalSurprise from '../components/FinalSurprise.jsx';
import Lightbox from '../components/Lightbox.jsx';
import BackToTop from '../components/BackToTop.jsx';
import { photoIndex } from '../data/photos.js';

export default function Anniversary() {
  const [lightbox, setLightbox] = useState(null);
  const openPhoto = useCallback((id) => setLightbox(photoIndex(id)), []);
  const close = useCallback(() => setLightbox(null), []);

  return (
    <>
      <Navigation />
      <main>
        <AnniversaryHero onOpenPhoto={openPhoto} />
        <Marquee items={['Sanjuna & Dilmi', 'three years of us', 'November 01, 2026', 'my favourite chapter']} />
        <JourneyCounter onOpenPhoto={openPhoto} />
        <FilmReel onOpenPhoto={openPhoto} />
        <MemoryGallery onOpenPhoto={openPhoto} />
        <WhatYouMean onOpenPhoto={openPhoto} />
        <LoveLetter onOpenPhoto={openPhoto} />
        <Marquee tone="blush" speed={1.6} items={['I love you, Dilmi', 'always', 'happy 3rd anniversary', 'to many more']} />
        <FinalSurprise />
      </main>
      <footer className="site-foot">
        <p className="site-foot__names">Sanjuna &amp; Dilmi</p>
        <p>Made with love by Sanjuna, for Dilmi · November 01, 2026</p>
      </footer>
      <BackToTop />
      <Lightbox index={lightbox} onClose={close} onChange={setLightbox} />
    </>
  );
}
