/*
 * The official logos the motion work is built from, and how each divides into
 * its own parts (./parts.mjs). Shared by render.mjs (the logo films) and
 * export-parts.mjs (the parts the Selected Work sequence animates live).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '../..');

const file = (dir, name) =>
  path.join(ROOT, dir, fs.readdirSync(path.join(ROOT, dir)).find((f) => f.normalize('NFC') === name.normalize('NFC')));

const solidAlpha = (r, g, b, a) => a >= 128;
const byX = (shapes) => [...shapes].sort((a, b) => a.box[0] - b.box[0]).map((s) => s.id);

/*
 * The logos. `source` is the supplied file, `split` how it divides into parts.
 * Groups are decided from each shape's bounding box in the trimmed file.
 */
export const LOGOS = {
  rumh: {
    source: () => file('brand/work/rumh', 'الشعار أفقي بالابيض png@4x.png'),
    width: 1400,
    split: {
      solid: solidAlpha,
      // the spearhead mark stands left of the wordmark
      group: (s) => (s.box[2] < 800 ? 'mark' : 'word'),
    },
  },
  louiza: {
    source: () => file('brand/work/lew/logo', 'Minimalist White Arabic Leaf Logo.png'),
    width: 493,
    split: {
      solid: solidAlpha,
      // single anti-aliased specks join the tall leaf rather than stretching the small one's box
      group: (s) => (s.box[1] >= 745 ? 'word' : s.n > 60000 || s.n < 50 ? 'leafBig' : 'leafSmall'),
    },
  },
  rukaz: {
    source: () => path.join(ROOT, 'public/work/rukaz/logo-mask.png'),
    width: 1600,
    split: {
      solid: solidAlpha,
      group: (s) => {
        const [x0, y0] = s.box;
        if (x0 < 800) return `piece-${y0 < 380 ? 't' : 'b'}${x0 < 350 ? 'l' : 'r'}`;
        return y0 < 380 ? 'ar' : `latin-${s.box[0]}`; // renamed by order below
      },
    },
  },
  'snack-quest': {
    source: () => path.join(ROOT, 'brand/work/snaok/logo/Pixel Snack Quest Logo.png'),
    width: 1095,
    split: {
      // the white letters are the shapes; the black plate receives every pixel
      solid: (r, g, b, a) => a >= 128 && r + g + b > 500,
      group: (s) => (s.n > 2000 ? `letter-${s.box[1] < 280 ? 'a' : 'b'}-${s.box[0]}` : null),
      base: 'plate',
      // plate: black at the pixel's own coverage; letter: white at its share of the light
      layer: (r, g, b, a, part) =>
        part === 'plate' ? [0, 0, 0, a] : [255, 255, 255, Math.round((a * (r + g + b)) / 765)],
    },
  },
  nurba: {
    // traced from the supplied logo board by scripts/nurba-extract.mjs: the monogram beside NURBA over نوربا
    source: () => path.join(ROOT, 'brand/work/nurba/extracted/logo-stacked.png'),
    width: 2400,
    split: {
      solid: solidAlpha,
      // left: the monogram's two frame lines (outer first) and its NB; right: five letters over the Arabic
      group: (s) => {
        const [x0, y0, x1] = s.box;
        if (x0 < 720) return x1 - x0 > 600 ? `ring-${x0}` : 'nb';
        return y0 < 330 ? `latin-${x0}` : 'ar';
      },
    },
  },
  datoura: {
    // rendered from the packaged .ai by scripts/datoura-extract.mjs
    source: () => path.join(ROOT, 'brand/work/DATOURA_Folder/extracted/logo-white.png'),
    width: 1600,
    split: {
      solid: solidAlpha,
      // three concentric rings left of the wordmark (outermost starts furthest left), then seven letters
      group: (s) => (s.box[0] < 450 ? `ring-${s.box[0]}` : `letter-${s.box[0]}`),
    },
  },
};

// Part names whose order matters get a stable index: latin-0…4, letter-a-0…, letter-b-0…,
// ring-0…2 (outermost first), letter-0…6
export function renameByOrder(parts) {
  const out = {};
  const groups = {};
  for (const name of Object.keys(parts)) {
    const m = name.match(/^(latin|letter-a|letter-b|letter|ring)-(\d+)$/);
    if (!m) out[name] = parts[name];
    else (groups[m[1]] ??= []).push([+m[2], parts[name]]);
  }
  for (const [prefix, list] of Object.entries(groups)) {
    list.sort((a, b) => a[0] - b[0]).forEach(([, buf], i) => (out[`${prefix}-${i}`] = buf));
  }
  return out;
}

