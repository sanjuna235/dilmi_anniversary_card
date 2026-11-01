import parkBench from '../assets/photos/01-park-bench.jpg';
import cameraWaterfall from '../assets/photos/02-camera-waterfall.jpg';
import greenHills from '../assets/photos/03-green-hills.jpg';
import goldenHillside from '../assets/photos/04-golden-hillside.jpg';
import closeSelfie from '../assets/photos/05-close-selfie.jpg';
import togetherIndoors from '../assets/photos/06-together-indoors.jpg';
import cafeSmiles from '../assets/photos/07-cafe-smiles.jpg';
import sunnyDay from '../assets/photos/08-sunny-day.jpg';
import sideBySide from '../assets/photos/09-side-by-side.jpg';
import sillyMoustache from '../assets/photos/10-silly-moustache.jpg';
import whiteSaree from '../assets/photos/11-white-saree.jpg';
import gardenHug from '../assets/photos/12-garden-hug.jpg';

/**
 * Every photograph of Sanjuna & Dilmi used across the site.
 * `pos` is the object-position used whenever a photo has to be cropped,
 * chosen so faces always stay in frame.
 * Captions are deliberately simple — no invented places, dates or events.
 */
export const photos = [
  { id: 'white-saree', src: whiteSaree, w: 1086, h: 1448, pos: '50% 22%', caption: 'Right where I belong', alt: 'Sanjuna in a suit and Dilmi in a white saree, smiling together under the trees' },
  { id: 'garden-hug', src: gardenHug, w: 1248, h: 1460, pos: '50% 25%', caption: 'My favourite place is next to you', alt: 'Sanjuna and Dilmi leaning their heads together on a sunny lawn' },
  { id: 'green-hills', src: greenHills, w: 779, h: 1035, pos: '50% 30%', caption: 'Always my favourite view', alt: 'Sanjuna holding Dilmi close in front of green hills' },
  { id: 'camera-waterfall', src: cameraWaterfall, w: 779, h: 1035, pos: '50% 30%', caption: 'Looking back at us', alt: 'Sanjuna and Dilmi laughing while looking at photos on a camera near a waterfall' },
  { id: 'park-bench', src: parkBench, w: 776, h: 1035, pos: '50% 30%', caption: 'Just us', alt: 'A selfie of Sanjuna and Dilmi on a park bench, her head on his shoulder' },
  { id: 'golden-hillside', src: goldenHillside, w: 1024, h: 769, pos: '50% 40%', caption: 'Golden light, golden company', alt: 'Sanjuna and Dilmi smiling in a selfie on a golden grassy hillside' },
  { id: 'close-selfie', src: closeSelfie, w: 778, h: 1035, pos: '50% 35%', caption: 'Held close', alt: 'Sanjuna with his arm around Dilmi in a close selfie surrounded by greenery' },
  { id: 'together-indoors', src: togetherIndoors, w: 655, h: 1035, pos: '50% 30%', caption: 'My person', alt: 'Sanjuna hugging Dilmi from behind, both smiling' },
  { id: 'side-by-side', src: sideBySide, w: 776, h: 1035, pos: '50% 25%', caption: 'Side by side', alt: 'Sanjuna and Dilmi standing side by side in front of a building' },
  { id: 'silly-moustache', src: sillyMoustache, w: 779, h: 1035, pos: '50% 30%', caption: 'Us, being us', alt: 'Sanjuna and Dilmi posing, Dilmi with a playful painted-on moustache' },
  { id: 'cafe-smiles', src: cafeSmiles, w: 283, h: 212, pos: '50% 40%', caption: 'A little moment', alt: 'Sanjuna and Dilmi smiling in a selfie indoors' },
  { id: 'sunny-day', src: sunnyDay, w: 290, h: 218, pos: '50% 40%', caption: 'Smiling in the sun', alt: 'Sanjuna and Dilmi smiling in a sunny outdoor selfie' },
];

export const byId = Object.fromEntries(photos.map((p) => [p.id, p]));
export const photoIndex = (id) => photos.findIndex((p) => p.id === id);
