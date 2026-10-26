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

// Whether the opening intro plays on this page load. Decided before the first paint by the
// inline script in index.html (once per session, never under reduced motion), read once here.
export const INTRO =
  typeof document !== 'undefined' && document.documentElement.classList.contains('is-intro');

/*
 * Intro gate. Entrance animations wait for this so they play as the opening
 * leaves, not hidden underneath it. Resolved immediately when no intro runs.
 * It resolves with { handoff }: true when the intro has carried the NASAQ symbol
 * into the hero itself, so the hero must not bring its own symbol in again.
 */
let releaseIntro;
export const introDone = new Promise((resolve) => {
  releaseIntro = resolve;
});
export const finishIntro = ({ handoff = false } = {}) => releaseIntro({ handoff });

export { gsap, ScrollTrigger };
