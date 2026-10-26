/*
 * NURBA's identity is supplied as exported boards (brand/work/nurba/Nurba11-NN.png) and
 * the package of its Illustrator file without the file itself (Nurba11_Folder: fonts,
 * one linked mockup, the package report). The cleanest logo source is board 16: the
 * logo arrangements on a transparent artboard, at about 1×. This script lifts from it,
 * without redrawing anything, the vector pieces the case study and the Selected Work
 * scene draw:
 *
 *   brand/work/nurba/extracted/<name>.svg   the shape traced from the board (Potrace at 8×
 *                                           the board's resolution), one path per shape
 *   brand/work/nurba/extracted/<name>.png   the same, rendered large, white on transparent
 *
 *   logo-stacked     the monogram beside NURBA over نوربا (board 16, centre left)
 *   logo-horizontal  NURBA · monogram · نوربا (board 16, top)
 *   monogram         the monogram alone (from logo-stacked)
 *   glint            the four-point star of the pattern (board 6)
 *
 * Each trace is checked against the board: the traced shape, rendered back at the
 * board's size, must cover the same pixels (intersection over union ≥ 0.95; 0.9 for the
 * 14 px star).
 *
 * Then: node scripts/build-media.mjs work/nurba   (web images and masks)
 *       node scripts/logo-motion/export-parts.mjs nurba   (logo parts)
 *       node scripts/logo-motion/render.mjs nurba   (logo film)
 *
 * Needs Potrace for JavaScript, which the site does not depend on. Install it
 * anywhere and point POTRACE at it, e.g.
 *   npm i --prefix /tmp/potrace potrace
 *   POTRACE=/tmp/potrace/node_modules/potrace node scripts/nurba-extract.mjs
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'brand/work/nurba');
const OUT = path.join(SRC, 'extracted');
const potrace = createRequire(import.meta.url)(process.env.POTRACE ?? 'potrace');

const SCALE = 8; // trace at 8× the board: the curves follow the anti-aliased edge, not the pixel grid
const PAD = 6;
// a slight blur at 8× (under a fifth of a board pixel) before the threshold: without it the
// enlarged edge keeps faint steps of the board's pixel grid
const SMOOTH = 1.4;

// [x, y, w, h] on the board, measured from its alpha (see the box of each arrangement)
const PIECES = {
  'logo-stacked': { board: 'Nurba11-16.png', box: [262, 740, 524, 157], width: 2400 },
  'logo-horizontal': { board: 'Nurba11-16.png', box: [339, 241, 1256, 141], width: 3200 },
  monogram: { board: 'Nurba11-16.png', box: [262, 740, 154, 157], width: 1600 },

  // one star of the pattern (light blue on navy): its shape is the lightness above the field
  glint: { board: 'Nurba11-06.png', box: [126, 117, 16, 17], width: 600, fromLight: true, min: 0.9 },
};

// The piece's coverage (0–255) on its own padded canvas, at the board's size.
async function coverage({ board, box: [x, y, w, h], fromLight }) {
  const img = sharp(path.join(SRC, board)).extract({
    left: x - PAD,
    top: y - PAD,
    width: w + PAD * 2,
    height: h + PAD * 2,
  });
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height);
  if (fromLight) {
    // field #1F354D, star #7FA1C4: coverage is the share of the way from one to the other
    for (let i = 0; i < out.length; i++)
      out[i] = Math.max(0, Math.min(255, ((data[i * 4 + 2] - 77) / (196 - 77)) * 255));
  } else {
    for (let i = 0; i < out.length; i++) out[i] = data[i * 4 + 3];
  }
  return { data: out, width: info.width, height: info.height };
}

const trace = (png) =>
  new Promise((resolve, reject) =>
    potrace.trace(png, { threshold: 128, turdSize: 4, alphaMax: 1, optCurve: true, optTolerance: 0.3 }, (e, svg) =>
      e ? reject(e) : resolve(svg),
    ),
  );

async function lift(name, piece) {
  const cov = await coverage(piece);
  const [W, H] = [cov.width * SCALE, cov.height * SCALE];
  // black shape on white, enlarged with a smooth filter so the threshold finds the true edge
  const big = await sharp(Buffer.from(cov.data.map((v) => 255 - v)), {
    raw: { width: cov.width, height: cov.height, channels: 1 },
  })
    .resize(W, H, { kernel: 'cubic' })
    .blur(SMOOTH)
    .png()
    .toBuffer();
  const svg = await trace(big);
  const d = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join(' ');

  // trimmed to the shape: the viewBox is the shape's own box, in 8× board px
  const vb = [PAD * SCALE, PAD * SCALE, (cov.width - PAD * 2) * SCALE, (cov.height - PAD * 2) * SCALE];
  const file = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}"><path fill="#fff" fill-rule="evenodd" d="${d}"/></svg>\n`;
  fs.writeFileSync(path.join(OUT, `${name}.svg`), file);

  // check: rendered back at the board's size, against the board's own pixels
  const back = await sharp(Buffer.from(file))
    .resize(cov.width - PAD * 2, cov.height - PAD * 2)
    .ensureAlpha()
    .raw()
    .toBuffer();
  let [and, or] = [0, 0];
  for (let y = 0; y < cov.height - PAD * 2; y++) {
    for (let x = 0; x < cov.width - PAD * 2; x++) {
      const a = cov.data[(y + PAD) * cov.width + x + PAD] >= 128;
      const b = back[(y * (cov.width - PAD * 2) + x) * 4 + 3] >= 128;
      and += a && b;
      or += a || b;
    }
  }
  const iou = and / or;

  const png = await sharp(Buffer.from(file), { density: Math.ceil((72 * piece.width) / vb[2]) })
    .resize({ width: piece.width })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(OUT, `${name}.png`), png);
  const meta = await sharp(png).metadata();
  console.log(`${name}: ${meta.width}×${meta.height}, IoU ${iou.toFixed(3)}, svg ${Math.round(file.length / 1024)} KB`);
  if (iou < (piece.min ?? 0.95)) throw new Error(`${name}: the trace does not match the board closely enough`);
}

fs.mkdirSync(OUT, { recursive: true });
for (const [name, piece] of Object.entries(PIECES)) await lift(name, piece);
