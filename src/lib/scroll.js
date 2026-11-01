import Lenis from 'lenis';

/**
 * Smooth, weighted page scrolling (Lenis) plus a shared scroll lock,
 * so the opening, the menu and the lightbox can all pause the page safely.
 */
let lenis = null;
let locks = 0;

export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined') return lenis;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  lenis = new Lenis({
    duration: 1.25,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    touchMultiplier: 1.1,
  });
  if (import.meta.env.DEV) window.__lenis = lenis;
  const raf = (time) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  if (locks > 0) lenis.stop();
  return lenis;
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.6 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Glide to a section by id (used by the menu and the scroll cue). */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: id === 'us' ? 0 : -60, duration: 1.6 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export function lockScroll() {
  locks += 1;
  document.documentElement.classList.add('is-locked');
  lenis?.stop();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.documentElement.classList.remove('is-locked');
    lenis?.start();
  }
}
