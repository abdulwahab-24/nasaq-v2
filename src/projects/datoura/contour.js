/*
 * The outer contour of DATOURA's symbol (symbol.json, traced from the supplied
 * artwork), shared by everything that opens or ripples in its shape: the
 * Selected Work scene (datoura.sequence.js) and the case study's apertures.
 */
import symbol from './symbol.json';

const NS = 'http://www.w3.org/2000/svg';
const SAMPLES = 72;
let cached = null;

/*
 * { d, viewBox, points }: the outer edge of the outer ring (of the band's two
 * subpaths, the larger), its own box as a viewBox (y flipped: the artwork's y
 * axis points up), and SAMPLES points round it, normalised to that box (0…1).
 */
export function outerContour() {
  if (cached) return cached;
  const probe = document.createElementNS(NS, 'svg');
  probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  document.body.append(probe);
  const sized = symbol.rings[0].d.split(/(?=M)/).map((d) => {
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    probe.append(path);
    const { x, y, width, height } = path.getBBox();
    return { d, path, box: { x, y, width, height } };
  });
  const edge = sized.reduce((a, b) => (b.box.width * b.box.height > a.box.width * a.box.height ? b : a));
  const { x, y, width, height } = edge.box;
  const length = edge.path.getTotalLength();
  const points = Array.from({ length: SAMPLES }, (_, i) => {
    const p = edge.path.getPointAtLength((length * i) / SAMPLES);
    return [(p.x - x) / width, (y + height - p.y) / height];
  });
  probe.remove();
  cached = { d: edge.d, viewBox: `${x} ${-(y + height)} ${width} ${height}`, points };
  return cached;
}

// A clip-path polygon of the contour: centred at (cx, cy) px, w × h px at scale 1, scaled by k.
export const contourPolygon = (points, cx, cy, w, h, k) =>
  `polygon(${points
    .map(([nx, ny]) => `${(cx + (nx - 0.5) * w * k).toFixed(1)}px ${(cy + (ny - 0.5) * h * k).toFixed(1)}px`)
    .join(',')})`;

// The scale at which a contour w × h centred at (cx, cy) covers a box W × H entirely.
export const coverScale = (cx, cy, w, h, W, H) =>
  (Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) / (0.36 * Math.min(w, h))) * 1.05;

export const SHUT = 'polygon(50% 50%, 50% 50%, 50% 50%)';
