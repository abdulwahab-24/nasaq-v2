/*
 * The official logos as separate parts, for the Selected Work sequence to animate live.
 *
 *   node scripts/logo-motion/export-parts.mjs [slug ...]
 *
 * For each project the supplied logo is split into its own parts (./parts.mjs,
 * nothing redrawn) and every part is cropped to its own box:
 *   public/work/<slug>/parts/<part>.png   the part's shape (used as a CSS mask, so the
 *                                         site paints it in the identity's own colour)
 *   src/projects/<slug>/logo-parts.json   { width, height, parts: { name: [x, y, w, h] } }
 *                                         boxes in px of the logo canvas (imported by the
 *                                         project's data module)
 * Laid back on that canvas at their boxes, the parts give the supplied logo exactly.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { LOGOS, renameByOrder, ROOT } from './logos.mjs';
import { split } from './parts.mjs';

// The box of a part's visible pixels (sharp's trim reads its background from the
// top-left pixel, which is solid when a part starts at the canvas corner).
async function bounds(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let [x0, y0, x1, y1] = [info.width, info.height, -1, -1];
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] < 8) continue; // stray, invisible edge pixels
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  return [x0, y0, x1 - x0 + 1, y1 - y0 + 1];
}

async function exportParts(slug) {
  const logo = LOGOS[slug];
  const cut = await split(logo.source(), { ...logo.split, width: logo.width });
  const parts = renameByOrder(cut.parts);
  const dir = path.join(ROOT, 'public/work', slug, 'parts');
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  const boxes = {};
  let bytes = 0;
  for (const [name, buf] of Object.entries(parts)) {
    const [left, top, width, height] = await bounds(buf);
    const data = await sharp(buf).extract({ left, top, width, height }).png({ compressionLevel: 9 }).toBuffer();
    boxes[name] = [left, top, width, height];
    fs.writeFileSync(path.join(dir, `${name}.png`), data);
    bytes += data.length;
  }
  const manifest = { width: cut.width, height: cut.height, parts: boxes };
  fs.writeFileSync(path.join(ROOT, 'src/projects', slug, 'logo-parts.json'), `${JSON.stringify(manifest)}\n`);
  console.log(`${slug}: ${Object.keys(boxes).length} parts, ${cut.width}×${cut.height}, ${Math.round(bytes / 1024)} KB`);
}

const wanted = process.argv.slice(2);
for (const slug of wanted.length ? wanted : Object.keys(LOGOS)) {
  if (!LOGOS[slug]) throw new Error(`Unknown logo "${slug}"`);
  await exportParts(slug);
}
