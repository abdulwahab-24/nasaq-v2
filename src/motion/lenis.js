import Lenis from 'lenis';
import { gsap, prefersReducedMotion, ScrollTrigger } from './gsap';

/*
 * Smooth scrolling (Lenis), one instance for the whole app.
 *
 *   startLenis / stopLenis  — called once by <SmoothScroll /> in App. Both are
 *                             idempotent, so React StrictMode's mount → unmount
 *                             → mount leaves exactly one instance, one ticker
 *                             callback and one scroll listener.
 *   scrollToY               — every programmatic scroll goes through here, so
 *                             Lenis never keeps easing towards a stale target
 *                             after a route change.
 *   lockScroll              — page scroll on/off (open menu, intro). Counted, so
 *                             overlapping locks release correctly.
 *
 * Lenis drives the native window scroll, so ScrollTrigger needs no scroller
 * proxy: it is told to update on every Lenis frame, which keeps pins and scrubs
 * in step with the eased position. Reduced motion: no instance is created and
 * everything falls back to native scrolling.
 */
let lenis = null;
let locks = 0;
let inFrame = false;

// gsap's ticker runs Lenis (its time is in seconds).
const onTick = (time) => {
  if (!lenis) return;
  inFrame = true;
  lenis.raf(time * 1000);
  inFrame = false;
};

/*
 * Only frames update ScrollTrigger. An instant jump (route change) also emits
 * "scroll", but synchronously — in the middle of React mounting the next page
 * and creating its triggers — and updating ScrollTrigger there breaks its
 * trigger list. The native scroll event that follows the jump covers that case.
 */
const onScroll = () => {
  if (inFrame) ScrollTrigger.update();
};

export function startLenis() {
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({ autoRaf: false });
  lenis.on('scroll', onScroll);
  gsap.ticker.add(onTick);
  if (locks > 0) lenis.stop();
  return lenis;
}

export function stopLenis() {
  if (!lenis) return;
  gsap.ticker.remove(onTick);
  lenis.destroy(); // also removes its listeners
  lenis = null;
}

export function scrollToY(top, { instant = false } = {}) {
  // force: also while locked, so a page can be placed under an overlay
  if (lenis) lenis.scrollTo(top, { immediate: instant, force: true });
  else window.scrollTo({ top, behavior: instant || prefersReducedMotion() ? 'instant' : 'smooth' });
  // ScrollTrigger remembers the scroll position and puts it back when it
  // refreshes; after a jump that memory is stale and would undo the jump.
  if (instant) ScrollTrigger.clearScrollMemory();
}

export function lockScroll(locked) {
  locks = Math.max(0, locks + (locked ? 1 : -1));
  if (!lenis) return;
  if (locks > 0) lenis.stop();
  else lenis.start();
}

// After content changes height (route change, pins created): re-measure both.
export function refreshScroll() {
  ScrollTrigger.refresh();
  lenis?.resize();
}
