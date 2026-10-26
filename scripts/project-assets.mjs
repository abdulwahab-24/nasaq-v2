/*
 * Identity pieces lifted from the supplied project files for the art-directed
 * project pages (Rumh, Louiza, Snack Quest). Complements build-media.mjs: that
 * script makes the photographs; this one isolates logos, lettering and sprites.
 *
 *   node scripts/project-assets.mjs
 *
 * Output: public/work/<slug>/<key>.png, merged into src/data/media.json.
 * Nothing is redrawn: every piece is cut from the original artwork, and only kept
 * where the cut is clean (flat backgrounds, hard pixel edges, solid lettering).
 *
 *   lockups   Rumh's supplied logo arrangements (white, 4× PNG), trimmed
 *   lettering Louiza's four words as set on its typography page, as masks the page
 *             can colour (soft luminance key: the words are darker than their field)
 *   sprites   Snack Quest's pixel coin and burger from its colour page, keyed off
 *             their flat colour field from the outside in (the black outline stops it)
 *   flames    Snack Quest's pixel flame band, keyed off its red field, written
 *             with its mirror image beside it so it tiles without a seam
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const manifestFile = path.join(ROOT, 'src/data/media.json');
const out = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));

const inDir = (dir, name) =>
  path.join(dir, fs.readdirSync(path.join(ROOT, dir)).find((f) => f.normalize('NFC') === name.normalize('NFC')));
const rumh = (name) => inDir('brand/work/rumh', name);
const lew = (name) => inDir('brand/work/lew', name);
const snaok = (name) => inDir('brand/work/snaok', name);
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));

async function write(key, pipeline, ext = 'png') {
  const file = path.join(ROOT, 'public', `${key}.${ext}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const info = await pipeline.toFile(file);
  out[key] = { width: info.width, height: info.height };
  console.log(key, info.width, info.height);
}

// A supplied logo file: trimmed, scaled, geometry and colour untouched.
const lockup = (source, key, width) =>
  write(key, sharp(path.join(ROOT, source)).trim().resize({ width, withoutEnlargement: true }).png({ compressionLevel: 9, palette: true }));

// Dark lettering on a light, soft field → white-on-transparent mask.
async function lettering(key, source, [left, top, width, height], { scale = 3, light = 205, dark = 165 } = {}) {
  const { data, info } = await sharp(path.join(ROOT, source))
    .flatten({ background: '#ffffff' })
    .extract({ left, top, width, height })
    .resize({ width: width * scale, kernel: 'lanczos3' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const alpha = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) alpha[i] = Math.round(255 * Math.min(1, Math.max(0, (light - data[i]) / (light - dark))));
  await write(
    key,
    sharp(Buffer.alloc(data.length * 3, 255), { raw: { width: info.width, height: info.height, channels: 3 } })
      .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
      .trim()
      .png({ compressionLevel: 9 }),
  );
}

// Flood fill from the crop's edges over the field colour(s): what the fill cannot reach stays.
async function keyed(source, [left, top, width, height], fields, tol = 60, minPiece = 0) {
  const { data, info } = await sharp(path.join(ROOT, source))
    .flatten({ background: '#ffffff' })
    .extract({ left, top, width, height })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const cols = fields.map(hex);
  const isField = (p) => cols.some(([r, g, b]) => Math.hypot(data[p * 3] - r, data[p * 3 + 1] - g, data[p * 3 + 2] - b) < tol);
  const gone = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const p = stack.pop();
    if (gone[p] || !isField(p)) continue;
    gone[p] = 1;
    const x = p % W;
    if (x > 0) stack.push(p - 1);
    if (x < W - 1) stack.push(p + 1);
    if (p >= W) stack.push(p - W);
    if (p < W * (H - 1)) stack.push(p + W);
  }
  // specks the fill left behind (smaller than minPiece pixels) go too
  if (minPiece) {
    const seen = new Uint8Array(W * H);
    for (let s = 0; s < W * H; s++) {
      if (gone[s] || seen[s]) continue;
      const piece = [];
      const todo = [s];
      seen[s] = 1;
      while (todo.length) {
        const p = todo.pop();
        piece.push(p);
        const x = p % W;
        for (const q of [x > 0 && p - 1, x < W - 1 && p + 1, p >= W && p - W, p < W * (H - 1) && p + W]) {
          if (q !== false && !gone[q] && !seen[q]) {
            seen[q] = 1;
            todo.push(q);
          }
        }
      }
      if (piece.length < minPiece) for (const p of piece) gone[p] = 1;
    }
  }
  const rgba = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    rgba.set([data[p * 3], data[p * 3 + 1], data[p * 3 + 2], gone[p] ? 0 : 255], p * 4);
  }
  return { rgba, W, H };
}

const sprite = async (key, source, crop, fields) => {
  const { rgba, W, H } = await keyed(source, crop, fields);
  await write(key, sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).trim().png({ compressionLevel: 9 }));
};

/* ---------- Rumh: the supplied logo arrangements (white) ---------- */
await lockup(rumh('الشعار أفقي بالابيض png@4x.png'), 'work/rumh/lockup-h', 1600);
await lockup(rumh('الشعار عامودي بالابيض png@4x.png'), 'work/rumh/lockup-v', 1000);
await lockup(rumh('الشعار بالاسم كامل عامودي بالابيض png@4x.png'), 'work/rumh/lockup-v-full', 1000);

/* ---------- Louiza: the four words of its typography page (Myriad Arabic) ---------- */
const typePage = lew('Screenshot 2026-10-09 112455.png');
await lettering('work/louiza/word-spirit', typePage, [672, 132, 496, 142]); // روح عصرية
await lettering('work/louiza/word-elegance', typePage, [106, 132, 470, 128]); // أناقة
await lettering('work/louiza/word-arabic', typePage, [872, 334, 296, 152]); // عربي
await lettering('work/louiza/word-detail', typePage, [100, 334, 752, 134]); // جمال التفاصيل

/* ---------- Snack Quest: sprites and flames ---------- */
const colourPage = snaok('Screenshot 2026-10-09 112214.png');
await sprite('work/snack-quest/sprite-coin', colourPage, [88, 132, 116, 116], ['#4d3468']);
await sprite('work/snack-quest/sprite-burger', colourPage, [62, 520, 150, 136], ['#8acc66']);
{
  const { rgba, W, H } = await keyed(snaok('Screenshot 2026-10-09 112200.png'), [8, 1022, 1042, 128], ['#ba2f2e', '#b22c2b', '#b02d2b'], 22, 60);
  const band = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  const flipped = await sharp(band).flop().toBuffer();
  await write(
    'work/snack-quest/flames',
    sharp({ create: { width: W * 2, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([
        { input: band, left: 0, top: 0 },
        { input: flipped, left: W, top: 0 },
      ])
      .png({ compressionLevel: 9 }),
  );
}

fs.writeFileSync(manifestFile, `${JSON.stringify(out, null, 2)}\n`);
