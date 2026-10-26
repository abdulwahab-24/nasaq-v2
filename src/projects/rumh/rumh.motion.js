import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { gsap, introDone, MOTION_OK, ScrollTrigger } from '../../motion/gsap';

gsap.registerPlugin(DrawSVGPlugin);

/*
 * Rumh's geometry and motion, shared by its page sections (components/).
 *
 * The whole identity runs on two angles: the spearhead's top edge (17.2° from the
 * horizontal) and its left edge (72.8°). The pattern's arms follow the same two
 * angles, so the page's rays, cuts and lattice are drawn on them too.
 *
 * Motion moves the way a spear does: still, then fast, then a hard stop. No bounce,
 * no overshoot, no drift. Things travel along the two angles or along a straight line
 * to one point.
 */
export const RM = {
  throw: 'expo.out', // out of stillness, landing dead on
  cut: 'power4.inOut', // a clean cut across
  scrub: 0.5,
};

// the mark, in % of its own box (the corners measured from the logo file; also theme.shape)
export const MARK = [
  [0, 0],
  [100, 31],
  [100, 100],
  [31, 100],
];
// the square it is built from: the same shape before its upper-left corner is raised
export const SQUARE = [
  [31, 31],
  [100, 31],
  [100, 100],
  [31, 100],
];

const RAD = Math.PI / 180;
export const ANGLE = Math.atan2(31, 100) / RAD; // 17.2°, the top edge; the left edge is 90° − that
// the eight directions of the system (screen y points down): an asterisk at any scale
export const DIRECTIONS = [ANGLE, 90 - ANGLE, 90 + ANGLE, 180 - ANGLE, 180 + ANGLE, 270 - ANGLE, 270 + ANGLE, 360 - ANGLE].map(
  (a) => [Math.cos(a * RAD), Math.sin(a * RAD)],
);

export const pointsOf = (pts, s = 1, [ox, oy] = [0, 0]) => pts.map(([x, y]) => `${ox + x * s},${oy + y * s}`).join(' ');

export { gsap, introDone, MOTION_OK, ScrollTrigger };
