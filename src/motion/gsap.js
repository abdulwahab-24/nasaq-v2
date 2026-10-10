import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// The app places the scroll itself on every navigation (see App.jsx). ScrollTrigger
// otherwise hands restoration back to the browser after each refresh, and
// back/forward would land wherever that page was last left.
if (typeof window !== 'undefined') ScrollTrigger.clearScrollMemory('manual');
gsap.defaults({ ease: 'power3.out' });

// Keep these in sync with the matching media queries in the stylesheets.
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const STAGED =
  '(min-width: 1024px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)';
export const COMPACT =
  '(max-width: 1023.98px) and (prefers-reduced-motion: no-preference), (max-height: 559.98px) and (prefers-reduced-motion: no-preference)';
export const DESKTOP = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
 * Intro gate. Entrance animations wait for this so they play as the opening
 * overlay leaves, not hidden underneath it. Resolved immediately when no intro runs.
 */
let releaseIntro;
export const introDone = new Promise((resolve) => {
  releaseIntro = resolve;
});
export const finishIntro = () => releaseIntro();

export { gsap, ScrollTrigger };
