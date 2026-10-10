import { useCallback, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap, prefersReducedMotion } from '../motion/gsap';
import { scrollToY } from '../motion/lenis';
import { scrollToSection } from '../utils/scroll';
import { TransitionContext } from './context';

/*
 * Page transitions.
 *
 *   go(to, { from })    — `from` is the clicked project image. Its exact crop
 *                         expands to fill the screen and becomes the project
 *                         hero: the work literally opens into its page.
 *   go(to, { section }) — no image: a navy panel carrying the NASAQ symbol
 *                         crosses the screen while the route changes.
 *
 * Reduced motion: plain navigation.
 */
const SYMBOL = '/brand/nasaq-symbol-white.png';

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

// Navigation commits asynchronously; wait (briefly) for an element of the new page.
function waitFor(selector, timeout = 1200) {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      const el = document.querySelector(selector);
      if (el || performance.now() - start > timeout) resolve(el);
      else requestAnimationFrame(tick);
    };
    tick();
  });
}

export default function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const layerRef = useRef(null);
  const busy = useRef(false);
  const heroReady = useRef(null);
  // Resolves when the incoming page is uncovered, so it can start its entrance.
  const settled = useRef(null);
  const whenSettled = useCallback(() => settled.current?.promise ?? Promise.resolve(), []);

  // The project hero calls this with a promise that resolves when its image is decoded.
  const registerHero = useCallback((promise) => {
    heroReady.current = promise;
  }, []);

  const land = useCallback((section) => {
    if (section) scrollToSection(section, { instant: true });
    else scrollToY(0, { instant: true });
  }, []);

  const go = useCallback(
    async (to, { from, section, color } = {}) => {
      const samePage = to === location.pathname;
      if (samePage && section) {
        scrollToSection(section);
        return;
      }
      if (busy.current || samePage) return;

      const layer = layerRef.current;
      if (prefersReducedMotion() || !layer) {
        navigate(to, { state: { section } });
        return;
      }

      busy.current = true;
      let release;
      settled.current = { promise: new Promise((r) => (release = r)) };
      heroReady.current = null;
      layer.replaceChildren();
      layer.style.display = 'block';

      const source = from?.querySelector('img');

      if (source) {
        // Media transition (FLIP): the clicked crop travels into the hero frame
        // of the next page, over the project's own colour.
        const rect = source.getBoundingClientRect();
        const clone = document.createElement('img');
        clone.src = source.currentSrc || source.src;
        clone.alt = '';
        clone.className = 'pt__media';
        clone.style.objectPosition = getComputedStyle(source).objectPosition;
        const backdrop = document.createElement('div');
        backdrop.className = 'pt__backdrop';
        if (color) backdrop.style.background = color;
        layer.append(backdrop, clone);
        gsap.set(clone, { top: rect.top, left: rect.left, width: rect.width, height: rect.height });

        // 1 — the project's field takes over around the image
        await gsap.to(backdrop, { opacity: 1, duration: 0.45, ease: 'power2.inOut' });

        navigate(to);
        const target = await waitFor('[data-hero-target]');
        scrollToY(0, { instant: true });
        await nextFrame();
        await Promise.race([heroReady.current ?? Promise.resolve(), new Promise((r) => setTimeout(r, 700))]);

        // 2 — the image settles exactly where the new page shows it
        const t = target?.isConnected
          ? target.getBoundingClientRect()
          : { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        await gsap
          .timeline()
          .to(clone, { top: t.top, left: t.left, width: t.width, height: t.height, duration: 0.9, ease: 'expo.inOut' })
          .to(backdrop, { opacity: 0, duration: 0.45, ease: 'power1.inOut' }, 0.45);
        release();
        await gsap.to(clone, { opacity: 0, duration: 0.25, ease: 'power1.out' });
      } else {
        // Panel transition
        const panel = document.createElement('div');
        panel.className = 'pt__panel';
        const mark = document.createElement('img');
        mark.src = SYMBOL;
        mark.alt = '';
        mark.className = 'pt__mark';
        panel.append(mark);
        layer.append(panel);

        await gsap
          .timeline()
          .fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: 'expo.inOut' })
          .fromTo(mark, { scale: 0.6, rotate: -45, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.5 }, 0.2);

        navigate(to, { state: { section } });
        await nextFrame();
        land(section);
        release();
        await gsap
          .timeline()
          .to(mark, { scale: 0.6, opacity: 0, duration: 0.3, ease: 'power2.in' })
          .to(panel, { yPercent: -100, duration: 0.6, ease: 'expo.inOut' }, 0.1);
      }

      layer.style.display = 'none';
      layer.style.opacity = '';
      layer.replaceChildren();
      busy.current = false;
      settled.current = null;
    },
    [land, location.pathname, navigate],
  );

  const isTransitioning = useCallback(() => busy.current, []);
  const value = useMemo(
    () => ({ go, registerHero, whenSettled, isTransitioning }),
    [go, registerHero, whenSettled, isTransitioning],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div className="pt" ref={layerRef} aria-hidden="true" />
    </TransitionContext.Provider>
  );
}
