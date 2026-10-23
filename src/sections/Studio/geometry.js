/* Construction geometry of the official symbol, in its own pixel units (470 × 470).
   t = cap thickness = gap; R = t / (1 − 1/√2); circle centres sit R + t/2 from
   the middle; the inscribed squares have side R√2. Verified against the artwork. */
export const SIZE = 470;
const T = SIZE / 12.657;
export const R = T / (1 - Math.SQRT1_2);
const C = R + T / 2;
export const HALF_SQ = R * Math.SQRT1_2;
const MID = SIZE / 2;
export const CIRCLES = [
  { id: 'tl', x: MID - C, y: MID - C },
  { id: 'tr', x: MID + C, y: MID - C },
  { id: 'bl', x: MID - C, y: MID + C },
  { id: 'br', x: MID + C, y: MID + C },
];
// Guides through the mark's outer edges and either side of its central gap.
export const GUIDES = [0, MID - T / 2, MID + T / 2, SIZE];
export const LONG = 6000;

/* Fragmented state, in symbol units from each circle's resting place: far
   apart and much larger, so they read as sweeping arcs rather than rings. */
export const SCATTER = {
  tl: { x: -1.5 * SIZE, y: -0.55 * SIZE, scale: 5.2 },
  tr: { x: 1.9 * SIZE, y: -1.1 * SIZE, scale: 3.6 },
  bl: { x: -2.3 * SIZE, y: 0.9 * SIZE, scale: 6.4 },
  br: { x: 1.3 * SIZE, y: 0.7 * SIZE, scale: 4.4 },
};
// Each quarter of the symbol arrives along its own diagonal.
export const OUT = { tl: [-1, -1], tr: [1, -1], bl: [-1, 1], br: [1, 1] };
