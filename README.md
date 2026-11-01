# Three Years of Us — a little world made for Dilmi

A 3rd-anniversary gift from Sanjuna to Dilmi · November 01, 2026.

Built with React, Vite, Framer Motion and Lucide icons. No backend, no paid APIs, and every photo and font is bundled locally.

## The experience

1. **A world made for you**: a midnight-purple sky with gold dust, stars and drifting petals. The lines appear one by one, ending with *Dilmi*.
2. **The envelope**: an ivory envelope with gold borders and a purple wax seal pressed with *S&D*. Tap it, and the seal cracks, the flap opens to show a lilac lining, and the letter slides out.
3. **The letter**: an ivory page unfolds and the words are written in line by line.
4. **The transition**: warm gold light, then the photographs drift in and settle around the title.
5. **The main page** (with weighted smooth scrolling throughout):
   - **Hero**: *Three Years of Us* written in letter by letter, with a photo collage that follows the mouse.
   - **Name ribbon**: a moving band that speeds up as she scrolls.
   - **Our journey**: counters inside rings that draw themselves, plus a live clock of every hour together.
   - **Memories reel**: the page pins and every photograph glides sideways as she scrolls.
   - **Shuffle Through Us**: a pile of polaroids she can swipe through, then a wall with all 12 photos that tilt in 3D. Tap any photo to open it full screen, then use the arrows, swipe or the keyboard.
   - **What you mean to me**: the words light up one by one as she reads.
   - **The full letter**: each paragraph is written in, a gold line tracks her reading, and the signature draws itself.
   - **Final surprise**: the *One Last Hug?* button.
6. **Music**: the player in the bottom-left corner never starts on its own. By default it plays an original music-box lullaby, synthesised live in the browser, so there are no copyright issues.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:5173. Helpful URL flags while editing:

- `?skip`: skip the opening and go straight to the main page.
- `?static`: render every animation at its final state (useful for screenshots).

## Deploy to Netlify

`netlify.toml` already contains the right settings:

- Build command: `npm run build`
- Publish directory: `dist`

You can deploy in either of two ways:

- **Drag and drop**: run `npm run build`, then drag the `dist` folder onto https://app.netlify.com/drop.
- **From Git**: push this folder to GitHub, then choose *Add new site → Import an existing project* in Netlify. Netlify reads the settings from `netlify.toml`.

## Editing

| What | Where |
| --- | --- |
| All text (letters, dates) | `src/data/content.js` |
| Relationship start date (used by the counters) | `START_DATE` in `src/data/content.js` (currently 1 Nov 2023) |
| Photos, captions and crop focus | `src/data/photos.js` + `src/assets/photos/` |
| Colours and fonts | the `:root` tokens at the top of `src/styles/global.css` |
| Use your own song | drop one `.mp3` / `.m4a` / `.ogg` instrumental into `src/assets/music/`. It replaces the music box automatically. |

## Structure

```
src/
  assets/photos/        the 12 real photographs
  assets/music/         (optional) your own instrumental track
  components/
    OpeningScene.jsx    scenes 1–4 orchestration
    EnvelopeAnimation.jsx, WaxSeal.jsx, LetterReveal.jsx, CinematicTransition.jsx
    AnniversaryHero.jsx, Marquee.jsx, JourneyCounter.jsx, FilmReel.jsx, MemoryGallery.jsx,
    PhotoDeck.jsx, WhatYouMean.jsx, ScrollWords.jsx, LoveLetter.jsx, FinalSurprise.jsx
    Lightbox.jsx, Navigation.jsx, MusicPlayer.jsx, musicBox.js, BackToTop.jsx
    Ambient.jsx (particles canvas), Sparkles.jsx, SplitText.jsx, Magnetic.jsx, CursorGlow.jsx, Reveal.jsx, Photo.jsx
  lib/scroll.js         smooth scrolling (Lenis) + scroll lock
  data/                 content.js, photos.js
  pages/Anniversary.jsx
  styles/global.css
```

Motion respects the device's *reduce motion* setting. When it is on, movement is removed and the fades stay.
