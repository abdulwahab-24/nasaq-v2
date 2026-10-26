import { gsap, introDone, MOTION_OK, ScrollTrigger } from '../../motion/gsap';
import logoParts from './logo-parts.json';

/*
 * Snack Quest's motion and logo geometry, shared by its page sections (components/).
 *
 * The identity is an 8-bit game: a pixel logo plate, a pixel typeface, pixel flames
 * and sprites. So nothing on its page moves smoothly. Things appear in whole
 * pixels and whole frames: eases are steps, letters are typed, pictures arrive as a
 * pixel dissolve, loops tick rather than glide.
 */
export const SQ = {
  frame: (n) => `steps(${n})`,
  type: 0.07, // one letter typed
};

// where each part of the logo sits, as CSS percentages of the plate
const { width: W, height: H, parts } = logoParts;
export const LOGO_RATIO = `${W} / ${H}`;
export const partBox = (name) => {
  const [x, y, w, h] = parts[name];
  return { left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, width: `${(w / W) * 100}%`, height: `${(h / H) * 100}%` };
};
export const LETTERS = ['a', 'b'].flatMap((row) => [0, 1, 2, 3, 4].map((i) => `letter-${row}-${i}`));

// a fixed, scattered order for a dissolve's pixels (the same on every visit)
export const order = (i) => (((Math.sin(i * 12.9898) * 43758.5453) % 1) + 1) % 1;

/*
 * A pixel cover: a canvas of square pixels in `colour` over its parent, removed pixel
 * by pixel as `state.p` runs from 0 to 1. One canvas pixel per cover pixel, scaled up
 * without smoothing (CSS: image-rendering: pixelated), so it costs almost nothing.
 */
export function pixelCover(canvas, colour, cellsAcross = 14) {
  const ctx = canvas.getContext('2d');
  const state = { p: 0 };
  const draw = () => {
    const { width: cols, height: rows } = canvas;
    ctx.clearRect(0, 0, cols, rows);
    ctx.fillStyle = colour;
    for (let i = 0; i < cols * rows; i++) if (order(i) >= state.p) ctx.fillRect(i % cols, Math.floor(i / cols), 1, 1);
  };
  const fit = () => {
    const { width, height } = canvas.parentElement.getBoundingClientRect();
    const size = Math.max(14, Math.min(width, height) / cellsAcross);
    canvas.width = Math.max(1, Math.ceil(width / size));
    canvas.height = Math.max(1, Math.ceil(height / size));
    draw();
  };
  fit();
  return { state, draw, fit };
}

export { gsap, introDone, MOTION_OK, ScrollTrigger };
