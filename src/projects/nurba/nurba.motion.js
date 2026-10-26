import { gsap, introDone, MOTION_OK, ScrollTrigger } from '../../motion/gsap';
import logoParts from './logo-parts.json';

/*
 * NURBA's geometry and motion, shared by its page (components/), its Selected Work
 * scene (nurba.sequence.js) and its logo film (scripts/logo-motion/scenes/nurba.js
 * repeats the same moves).
 *
 * The identity is a jeweller's: a monogram set inside an octagon of two fine lines,
 * the outline of a step-cut stone, and a pattern in which N and B alternate with a
 * four-point glint. So the page moves the way a piece is set and then catches the
 * light, and nothing else:
 *   trace   a line travels round the octagon from its upper-left facet, as a setting
 *           is closed round a stone
 *   light   a soft band of light passes across the letters, revealing them
 *   set     letters come down a few pixels into their places and stop, one by one
 *   glint   the four-point star flares at a corner of the frame and goes out
 * Slow in, quiet at rest: no bounce, no spin, no scale beyond a breath.
 */
export const NB = {
  set: 'expo.out', // into place, then perfectly still
  trace: 'power2.inOut',
  light: 'sine.inOut',
};

export const COLOURS = {
  navy: '#1F354D',
  steel: '#385C7E',
  blue: '#7FA1C4',
  pale: '#A7C6DB',
  cream: '#F2ECE4',
  champagne: '#F5E3C3',
  gold: '#E6B964',
};

// the stacked logo's canvas and parts (scripts/logo-motion/export-parts.mjs)
export const LOGO = logoParts;
const [, , MW] = logoParts.parts['ring-0'];
// the octagon: each corner is cut 15.8% of the frame's side along both edges (measured on ring-0)
export const CHAMFER = 112 / 708;
// the monogram's centre on the logo canvas, and the NB part's own origin for scaling round it
export const MONO_CENTRE = [MW / 2, MW / 2];
const [nx, ny, nw, nh] = logoParts.parts.nb;
export const NB_ORIGIN = `${((MW / 2 - nx) / nw) * 100}% ${((MW / 2 - ny) / nh) * 100}%`;
// N and B share one stem: columns 202–248 of the NB part (of 399)
export const STEM = [202 / 399, 248 / 399];

// The octagon's eight corners round (cx, cy), half its side r, clockwise from the upper-left facet.
export function octagon(cx, cy, r) {
  const c = r * 2 * CHAMFER;
  return [
    [cx - r + c, cy - r],
    [cx + r - c, cy - r],
    [cx + r, cy - r + c],
    [cx + r, cy + r - c],
    [cx + r - c, cy + r],
    [cx - r + c, cy + r],
    [cx - r, cy + r - c],
    [cx - r, cy - r + c],
  ];
}

// A field with an octagonal opening in it (clip-path, px): the opening narrows as r falls.
export function opening(w, h, cx, cy, r) {
  const pts = octagon(cx, cy, Math.max(r, 0))
    .map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`)
    .join(', ');
  const first = pts.slice(0, pts.indexOf(','));
  return `polygon(evenodd, 0px 0px, ${w}px 0px, ${w}px ${h}px, 0px ${h}px, 0px 0px, ${pts}, ${first}, 0px 0px)`;
}

// Masks that combine an element's own shape (url) with a moving reveal, for `trace` and `light`.
// The reveal is driven by CSS variables (--nb-trace in degrees, --nb-light in %), which GSAP tweens.
export const traceMask = (src) =>
  `${src}, conic-gradient(from -45deg at 50% 50%, #000 var(--nb-trace, 360deg), transparent 0)`;
export const lightMask = (src) =>
  `${src}, linear-gradient(105deg, #000 calc(var(--nb-light, 100%) - 12%), transparent var(--nb-light, 100%))`;

export function applyMask(el, image) {
  el.style.webkitMaskImage = image;
  el.style.maskImage = image;
  el.style.webkitMaskSize = '100% 100%';
  el.style.maskSize = '100% 100%';
  el.style.webkitMaskRepeat = 'no-repeat';
  el.style.maskRepeat = 'no-repeat';
  el.style.webkitMaskComposite = 'source-in';
  el.style.maskComposite = 'intersect';
}

export function clearMask(el) {
  for (const p of ['webkitMaskImage', 'maskImage', 'webkitMaskSize', 'maskSize', 'webkitMaskRepeat', 'maskRepeat']) {
    el.style[p] = '';
  }
  el.style.webkitMaskComposite = '';
  el.style.maskComposite = '';
  el.style.removeProperty('--nb-trace');
  el.style.removeProperty('--nb-light');
}

export { gsap, introDone, MOTION_OK, ScrollTrigger };
