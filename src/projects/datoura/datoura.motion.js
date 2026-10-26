/*
 * DATOURA's case study draws its identity live, so it uses two more GSAP plugins
 * (both ship with the installed gsap package): MorphSVG, to turn the concept's
 * shield into the symbol's outer contour, and DrawSVG, to draw contours and
 * construction lines as strokes. Registered here, for this project only.
 */
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { gsap } from '../../motion/gsap';

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin);

// The page's shared timings: one ease for arrivals, one for drawn lines.
export const DT = { ease: 'power3.out', draw: 'power2.inOut' };

// Union of SVG elements' boxes, in the SVG's own user units: [x, y, w, h].
export function boxOf(elements, pad = 0) {
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const el of elements) {
    const b = el.getBBox();
    x0 = Math.min(x0, b.x);
    y0 = Math.min(y0, b.y);
    x1 = Math.max(x1, b.x + b.width);
    y1 = Math.max(y1, b.y + b.height);
  }
  return [x0 - pad, y0 - pad, x1 - x0 + pad * 2, y1 - y0 + pad * 2];
}

export { gsap };
