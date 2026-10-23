/* clip-path helpers for project shapes (e.g. Rumh's spearhead: projects/rumh/components/Aperture.jsx) */

// Corner points of a clip-path polygon, in % of the frame.
export const RECT = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100],
];

export const polygon = (points) => `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(', ')})`;

/*
 * A project shape (points in % of its own box) centred inside a frame of any
 * proportion, `size` being the shape's height as a share of the frame height.
 */
export function shapeIn(frame, shape, size = 0.62) {
  const { width, height } = frame.getBoundingClientRect();
  if (!width || !height) return polygon(shape);
  const h = size * 100;
  const w = (h * height) / width;
  return polygon(shape.map(([x, y]) => [50 - w / 2 + (x / 100) * w, 50 - h / 2 + (y / 100) * h]));
}
