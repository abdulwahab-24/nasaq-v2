/*
 * Splits an official logo file into its own parts, without redrawing anything.
 *
 * Every part is written on the same canvas as the trimmed logo, transparent
 * everywhere except its own pixels, so stacking the parts at one origin gives
 * back the supplied logo exactly. Pixels are assigned by connected shape:
 * a solid pixel belongs to the shape it is part of; an anti-aliased edge pixel
 * to the nearest solid one.
 */
import sharp from 'sharp';

const NEIGHBOURS = 3; // search radius (px) for edge pixels that belong to no solid shape

// Connected shapes of the pixels for which `solid(r, g, b, a)` is true.
function label(data, W, H, solid) {
  const lab = new Int32Array(W * H).fill(-1);
  const shapes = [];
  const on = (i) => solid(data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]);
  for (let s = 0; s < W * H; s++) {
    if (lab[s] !== -1 || !on(s)) continue;
    const id = shapes.length;
    const stack = [s];
    lab[s] = id;
    let n = 0;
    let [x0, y0, x1, y1] = [W, H, 0, 0];
    while (stack.length) {
      const p = stack.pop();
      const x = p % W;
      const y = (p / W) | 0;
      n++;
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
      for (const q of [p - 1, p + 1, p - W, p + W]) {
        if (q < 0 || q >= W * H || Math.abs((q % W) - x) > 1) continue;
        if (lab[q] === -1 && on(q)) {
          lab[q] = id;
          stack.push(q);
        }
      }
    }
    shapes.push({ id, n, box: [x0, y0, x1, y1] });
  }
  return { lab, shapes };
}

// The label of the nearest solid pixel within NEIGHBOURS, or -1.
function nearest(lab, W, H, i) {
  const x = i % W;
  const y = (i / W) | 0;
  for (let r = 1; r <= NEIGHBOURS; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        const l = lab[yy * W + xx];
        if (l !== -1) return l;
      }
    }
  }
  return -1;
}

/*
 * split(file, { solid, group, layer?, width })
 *   solid(r,g,b,a)  which pixels form the shapes that are grouped
 *   group(shape)    → part name for a shape ({ id, n, box }), or null to drop it
 *   layer           optional: (r,g,b,a, part) → [r,g,b,a] for the part's pixel, and
 *                   `base` — a part that receives every visible pixel (e.g. the plate
 *                   the letters sit on)
 *   width           output width (all parts resized identically)
 * Returns { width, height, parts: { name: pngBuffer } }.
 */
export async function split(file, { solid, group, layer, base, width }) {
  const { data, info } = await sharp(file).trim().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const { lab, shapes } = label(data, W, H, solid);
  const partOf = shapes.map((s) => group(s));
  const names = [...new Set([...partOf.filter(Boolean), ...(base ? [base] : [])])];
  const out = Object.fromEntries(names.map((n) => [n, Buffer.alloc(W * H * 4)]));

  for (let i = 0; i < W * H; i++) {
    const a = data[i * 4 + 3];
    if (!a) continue;
    const px = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], a];
    if (base) out[base].set(layer(...px, base), i * 4);
    let l = lab[i];
    if (l === -1) l = nearest(lab, W, H, i);
    const name = l === -1 ? null : partOf[l];
    if (!name || name === base) continue;
    out[name].set(layer ? layer(...px, name) : px, i * 4);
  }

  const scale = width / W;
  const height = Math.round(H * scale);
  const parts = {};
  for (const name of names) {
    parts[name] = await sharp(out[name], { raw: { width: W, height: H, channels: 4 } })
      .resize(width, height, { kernel: 'lanczos3' })
      .png()
      .toBuffer();
  }
  return { width, height, scale, parts, shapes };
}
