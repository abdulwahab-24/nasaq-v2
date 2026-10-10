/*
 * Builds every image the site uses from the original files in /brand.
 *
 *   npm i -D sharp      (once, only needed when adding/changing media)
 *   node scripts/build-media.mjs [key-prefix]
 *
 * Output: public/<key>-<width>.webp  (+ <key>-blur.webp backdrops where asked)
 *         src/data/media.json — dimensions + available widths, read by data/projects.js
 *
 * The supplied project files are mostly presentation screenshots, so each entry
 * is an art-directed derivative: crops remove slide edges and presentation
 * chrome, isolate a detail, or split composite slides. Artwork is never altered.
 *
 * Entry: [key, source, crop?, options?]
 *   crop    [x, y, w, h] in source pixels (absolute)
 *   options { blur: true } also writes a tiny blurred backdrop (<key>-blur.webp)
 *           { alpha: true } keeps transparency (cutouts)
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const WIDTHS = [480, 800, 1200, 1800];

const files = (dir) =>
  fs
    .readdirSync(path.join(ROOT, dir))
    .filter((f) => !f.startsWith('._') && /\.(png|jpe?g)$/i.test(f))
    .sort()
    .map((f) => path.join(dir, f));

const lew = files('brand/work/lew');
const rukaz = files('brand/work/rukaz');
const snaok = files('brand/work/snaok');
const rumhSlide = (n) => `brand/work/rumh/ملف الهوية البصرية-${String(n).padStart(2, '0')}.png`;
const rumhFile = (name) =>
  path.join(
    'brand/work/rumh',
    fs.readdirSync(path.join(ROOT, 'brand/work/rumh')).find((f) => f.normalize('NFC') === name.normalize('NFC')),
  );
const id = (n) => `brand/identity/nasaq [Recovered]-${String(n).padStart(2, '0')}.png`;
const BLUR = { blur: true };

const MANIFEST = [
  /* ---------------- Rumh (native 1366 × 768 guideline exports) ---------------- */
  ['work/rumh/cover', rumhSlide(1), [0, 150, 1366, 500], BLUR],
  ['work/rumh/cover-m', rumhSlide(1), [330, 150, 620, 505]],
  ['work/rumh/spear', rumhFile('674438650_17878340586560485_3346282150964408385_n.jpg')],
  ['work/rumh/concept', rumhSlide(5), [0, 0, 1366, 712]],
  ['work/rumh/traits', rumhSlide(4), [120, 150, 1130, 470]],
  ['work/rumh/elements', rumhSlide(22), [150, 180, 560, 420]],
  ['work/rumh/pattern-strip', rumhSlide(13), [452, 0, 462, 712]],
  ['work/rumh/colour', rumhSlide(13), [0, 0, 1366, 712]],
  ['work/rumh/logo-forms', rumhSlide(12), [0, 130, 1366, 582]],
  ['work/rumh/digital', rumhSlide(28), [0, 120, 1240, 588]],
  ['work/rumh/screen', rumhSlide(30), [215, 130, 1151, 582]],
  ['work/rumh/signage', rumhSlide(31), [0, 105, 1366, 607]],
  ['work/rumh/signage-d', rumhSlide(31), [560, 260, 700, 430]],
  ['work/rumh/keyring', rumhSlide(32), [330, 110, 720, 658]],
  ['work/rumh/interior', rumhSlide(35), [0, 110, 1250, 658]],
  ['work/rumh/badges', rumhSlide(36)],
  ['work/rumh/badges-d', rumhSlide(36), [330, 120, 720, 520]],

  /* ---------------- Louiza (folder: lew — screenshots) ---------------- */
  ['work/louiza/cover', lew[0], [6, 5, 1222, 845], BLUR],
  ['work/louiza/cover-p', lew[0], [330, 5, 640, 845]],
  ['work/louiza/logo', lew[1], [0, 9, 1267, 709], BLUR],
  ['work/louiza/construction', lew[2], [0, 5, 1267, 710]],
  ['work/louiza/mark', lew[3], [8, 8, 1262, 712], BLUR],
  ['work/louiza/pattern', lew[4], [0, 5, 1267, 706]],
  ['work/louiza/type', lew[5], [20, 60, 1221, 440]],
  ['work/louiza/badges', lew[7], [100, 110, 560, 560]],
  ['work/louiza/patterns', lew[8], [0, 10, 1264, 708]],
  ['work/louiza/hoodie', lew[9], [0, 12, 1267, 480]],
  ['work/louiza/label', lew[9], [320, 506, 640, 350]],
  ['work/louiza/tote', lew[10], [0, 4, 1264, 950]],
  ['work/louiza/tote-p', lew[10], [290, 4, 720, 950]],
  ['work/louiza/boxes', lew[11], [0, 0, 1264, 942]],
  ['work/louiza/app', lew[12], [2, 6, 1268, 835]],
  ['work/louiza/tags', lew[13], [8, 6, 1265, 944]],
  ['work/louiza/bags', lew[14], [2, 0, 1264, 946]],
  ['work/louiza/box', lew[15], [0, 0, 1264, 940]],

  /* ---------------- Rukaz (screenshots) ---------------- */
  ['work/rukaz/cover', rukaz[0], [6, 5, 1396, 933], BLUR],
  ['work/rukaz/cover-p', rukaz[0], [380, 5, 680, 933]],
  ['work/rukaz/lighters', rukaz[1], [40, 30, 520, 420]],
  ['work/rukaz/logo', rukaz[2], [200, 150, 1010, 440], BLUR],
  ['work/rukaz/type', rukaz[3], [100, 190, 1230, 420]],
  ['work/rukaz/type-m', rukaz[3], [100, 190, 560, 420]],
  ['work/rukaz/colour', rukaz[4], [590, 150, 760, 470]],
  ['work/rukaz/tote', rukaz[5], [24, 4, 500, 782]],
  ['work/rukaz/pattern', rukaz[5], [545, 175, 830, 320]],
  ['work/rukaz/applications', rukaz[6], [26, 66, 466, 1029]],

  /* ---------------- Snack Quest (folder: snaok — screenshots) ---------------- */
  ['work/snack-quest/cover', snaok[1], [0, 9, 1044, 694], BLUR],
  ['work/snack-quest/interior', snaok[0], [0, 0, 1048, 883], BLUR],
  ['work/snack-quest/logo', snaok[2], [0, 2, 1047, 529]],
  ['work/snack-quest/monogram', snaok[2], [140, 300, 770, 125]],
  ['work/snack-quest/type', snaok[3], [8, 30, 1049, 1100]],
  ['work/snack-quest/colour', snaok[4], [0, 2, 700, 948]],
  ['work/snack-quest/palette', snaok[5], [0, 0, 697, 459]],
  ['work/snack-quest/wall-a', snaok[6], [0, 0, 703, 520]],
  ['work/snack-quest/wall-b', snaok[6], [0, 532, 703, 519]],
  ['work/snack-quest/poster', snaok[7], [0, 3, 706, 888]],
  ['work/snack-quest/fries', snaok[8], [0, 5, 693, 899]],
  ['work/snack-quest/applications', snaok[9], [30, 33, 460, 767]],

  /* ---------------- NASAQ's own identity ---------------- */
  // Transparent cutout supplied for the Studio section (kept transparent)
  ['studio/portrait', 'public/studio/Blue-Rimmed Shadow Portrait.png', [0, 20, 1222, 1267], { alpha: true }],
  ['studio/badge', id(13), [230, 0, 500, 650]],
  ['studio/app', id(9)],
  ['studio/sign', id(10)],
  ['studio/silhouette', id(16)],
  ['studio/lockup', id(18)],
];

const out = {};

async function exportImage([key, source, crop, options = {}]) {
  const input = path.join(ROOT, source);
  const meta = await sharp(input).metadata();
  const region = crop
    ? { left: crop[0], top: crop[1], width: crop[2], height: crop[3] }
    : { left: 0, top: 0, width: meta.width, height: meta.height };

  const widths = WIDTHS.filter((w) => w < region.width);
  if (!widths.length || region.width - widths.at(-1) > 120) widths.push(Math.min(region.width, 2000));

  fs.mkdirSync(path.join(ROOT, 'public', path.dirname(key)), { recursive: true });

  let height = 0;
  for (const w of widths) {
    let pipeline = sharp(input);
    // slide exports carry transparent regions; cutouts keep theirs
    if (!options.alpha) pipeline = pipeline.flatten({ background: '#ffffff' });
    const info = await pipeline
      .extract(region)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: options.alpha ? 84 : 82, alphaQuality: 90, effort: 5 })
      .toFile(path.join(ROOT, 'public', `${key}-${w}.webp`));
    height = Math.round((info.height / info.width) * widths.at(-1));
  }

  // Tiny, pre-blurred backdrop: extends an image to the viewport without upscaling it.
  if (options.blur) {
    await sharp(input)
      .extract(region)
      .resize({ width: 48 })
      .blur(1.2)
      .webp({ quality: 70 })
      .toFile(path.join(ROOT, 'public', `${key}-blur.webp`));
  }

  out[key] = { widths, width: widths.at(-1), height, ...(options.blur ? { blur: true } : {}) };
  console.log(key, widths.join(','));
}

// Logos: trim the transparent artboard, keep geometry and colour untouched.
async function exportLogo(source, key, width) {
  const file = path.join(ROOT, 'public', `${key}.png`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const info = await sharp(path.join(ROOT, source))
    .trim()
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(file);
  out[key] = { width: info.width, height: info.height };
  console.log(key, info.width, info.height);
}

// The NASAQ slash pattern (black on white) → white-on-transparent mask.
async function exportPattern() {
  const src = path.join(ROOT, id(14));
  const { data, info } = await sharp(src).greyscale().negate().raw().toBuffer({ resolveWithObject: true });
  const file = path.join(ROOT, 'public/brand/slash-pattern.png');
  await sharp(Buffer.alloc(info.width * info.height * 3, 255), {
    raw: { width: info.width, height: info.height, channels: 3 },
  })
    .joinChannel(data, { raw: { width: info.width, height: info.height, channels: 1 } })
    .trim()
    .resize({ width: 1600 })
    .png({ compressionLevel: 9 })
    .toFile(file);
  const m = await sharp(file).metadata();
  out['brand/slash-pattern'] = { width: m.width, height: m.height };
}

const only = process.argv[2];
const manifestFile = path.join(ROOT, 'src/data/media.json');
if (only && fs.existsSync(manifestFile)) Object.assign(out, JSON.parse(fs.readFileSync(manifestFile, 'utf8')));

for (const entry of MANIFEST) if (!only || entry[0].startsWith(only)) await exportImage(entry);
await exportLogo(rumhFile('الشعار  بالاسم كامل أفقي بالابيض png@4x.png'), 'work/rumh/logo-white', 1400);
await exportLogo(rumhFile('الشعار  بالاسم كامل أفقي بالكحلي png@4x.png'), 'work/rumh/logo-navy', 1400);
await exportLogo(rumhFile('الشعار عامودي بالابيض png@4x.png'), 'work/rumh/mark-white', 900);
await exportPattern();

fs.writeFileSync(manifestFile, JSON.stringify(out, null, 2) + '\n');
console.log(`\n${Object.keys(out).length} assets → src/data/media.json`);

// Social sharing image (Open Graph): the NASAQ identity cover, 1200 × 630.
await sharp(path.join(ROOT, id(1)))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(ROOT, 'public/og.jpg'));
