/*
 * Builds every image the site uses from the original files in /brand.
 *
 *   npm i -D sharp      (once, only needed when adding/changing media)
 *   node scripts/build-media.mjs [key-prefix]
 *
 * Output: public/<key>-<width>.webp  (+ <key>-blur.webp backdrops where asked)
 *         src/data/media.json — dimensions + available widths, read by utils/media.js (img / asset)
 *
 * The supplied project files are mostly presentation screenshots, so each entry
 * is an art-directed derivative: crops remove slide edges and presentation
 * chrome, isolate a detail, or split composite slides. Artwork is never altered.
 *
 * Entry: [key, source, crop?, options?]
 *   crop    [x, y, w, h] in source pixels (absolute)
 *   options { blur: true } also writes a tiny blurred backdrop (<key>-blur.webp)
 *           { alpha: true } keeps transparency (cutouts)
 *           { background } colour behind transparent artwork (default white)
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
// DATOURA: the photographs are the high-resolution mockups linked into its .ai file
const nurba = (n) => `brand/work/nurba/Nurba11-${String(n).padStart(2, '0')}.png`;
const datoura = (name) => `brand/work/DATOURA_Folder/DATOURA_Folder/Links/${name}`;

/*
 * The Rukaz applications collage (513 × 1225 screenshot) holds fourteen separate
 * mockups plus the embroidered logo. Each tile is cropped just inside its rounded
 * corners; the site rounds them again in CSS. Tiles are small (142 px tall) and
 * are always shown at their own size, never enlarged.
 * Lossless copies are also written to brand/work/rukaz/extracted/.
 */
const RUKAZ_APPS = [
  ['backpack', [27, 92, 140, 140]],
  ['mug', [189, 92, 186, 140]],
  ['bottles', [398, 92, 93, 140]],
  ['carabiner', [27, 248, 249, 140]],
  ['lighters', [299, 248, 192, 140]],
  ['tote-pattern', [27, 403, 140, 140]],
  ['tote-logo', [189, 403, 140, 140]],
  ['sling-bag', [351, 403, 140, 140]],
  ['tote-green', [27, 557, 140, 140]],
  ['bottle-steel', [189, 557, 140, 140]],
  ['cap-teal', [351, 557, 140, 140]],
  ['cap-green', [27, 711, 140, 140]],
  ['duffel', [189, 714, 302, 138]],
  ['logo-textile', [27, 864, 464, 177]],
];

const MANIFEST = [
  /* ---------------- Rumh (native 1366 × 768 guideline exports) ---------------- */
  ['work/rumh/cover', rumhSlide(1), [0, 150, 1366, 500], BLUR],
  ['work/rumh/cover-m', rumhSlide(1), [330, 150, 620, 505]],
  ['work/rumh/spear', rumhFile('674438650_17878340586560485_3346282150964408385_n.jpg')],
  ['work/rumh/concept', rumhSlide(5), [0, 0, 1366, 712]],
  ['work/rumh/elements', rumhSlide(22), [150, 180, 560, 420]],
  ['work/rumh/pattern-strip', rumhSlide(13), [452, 0, 462, 712]],
  ['work/rumh/colour', rumhSlide(13), [0, 0, 1366, 712]],
  ['work/rumh/logo-forms', rumhSlide(12), [0, 130, 1366, 582]],
  ['work/rumh/digital', rumhSlide(28), [0, 120, 1240, 588]],
  ['work/rumh/screen', rumhSlide(30), [215, 130, 1151, 582]],
  ['work/rumh/signage', rumhSlide(31), [0, 105, 1366, 607]],
  ['work/rumh/signage-d', rumhSlide(31), [560, 260, 700, 430]],
  // the acrylic wall sign (the page heading above and the footer below cropped away)
  ['work/rumh/sign', rumhSlide(34), [0, 110, 1366, 600]],
  ['work/rumh/keyring', rumhSlide(32), [330, 110, 720, 658]],
  ['work/rumh/interior', rumhSlide(35), [0, 110, 1250, 658]],
  ['work/rumh/badges', rumhSlide(36)],
  ['work/rumh/badges-d', rumhSlide(36), [330, 120, 720, 520]],
  ['work/rumh/card', rumhSlide(25), [0, 112, 1366, 600], BLUR],

  /* ---------------- Louiza (folder: lew — screenshots) ---------------- */
  ['work/louiza/cover', lew[0], [6, 5, 1222, 845], BLUR],
  ['work/louiza/cover-p', lew[0], [330, 5, 640, 845]],
  ['work/louiza/construction', lew[2], [0, 5, 1267, 710]],
  ['work/louiza/mark', lew[3], [8, 8, 1262, 712], BLUR],
  ['work/louiza/pattern', lew[4], [0, 5, 1267, 706]],
  ['work/louiza/type', lew[5], [20, 60, 1221, 440]],
  ['work/louiza/badges', lew[7], [100, 110, 560, 560]],
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
  // the mug and its rock, nothing cropped: for narrow screens
  ['work/rukaz/cover-m', rukaz[0], [290, 150, 840, 788]],
  ['work/rukaz/lighters', rukaz[1], [40, 30, 520, 420]],
  // the mountain photograph from the colour page (the palette's stated source)
  ['work/rukaz/mountain', rukaz[4], [0, 0, 520, 778]],
  ['work/rukaz/tote', rukaz[5], [24, 4, 500, 782]],
  // the applications collage, tile by tile (see RUKAZ_APPS above)
  ...RUKAZ_APPS.map(([name, crop]) => [`work/rukaz/apps/${name}`, rukaz[6], crop]),

  /* ---------------- Snack Quest (folder: snaok — screenshots) ---------------- */
  ['work/snack-quest/cover', snaok[1], [0, 9, 1044, 694], BLUR],
  ['work/snack-quest/interior', snaok[0], [0, 0, 1048, 883], BLUR],
  ['work/snack-quest/monogram', snaok[2], [140, 300, 770, 125]],
  ['work/snack-quest/type', snaok[3], [8, 30, 1049, 1100]],
  ['work/snack-quest/colour', snaok[4], [0, 2, 700, 948]],
  ['work/snack-quest/palette', snaok[5], [0, 0, 697, 459]],
  ['work/snack-quest/wall-a', snaok[6], [0, 0, 703, 520]],
  ['work/snack-quest/wall-b', snaok[6], [0, 532, 703, 519]],
  ['work/snack-quest/poster', snaok[7], [0, 3, 706, 888]],
  ['work/snack-quest/fries', snaok[8], [0, 5, 693, 899]],
  ['work/snack-quest/applications', snaok[9], [30, 33, 460, 767]],
  // packaging only (the logo above it is now the real logo file)
  ['work/snack-quest/products', snaok[1], [0, 305, 1044, 398]],
  ['work/snack-quest/products-m', snaok[1], [262, 305, 520, 398]],

  /* ---------------- DATOURA (artboards rendered from DATOURA.ai) ---------------- */
  ['work/datoura/cover', datoura('STADIUM-ADVERTISING-BOARD-MOCKUP.jpg'), [0, 300, 4000, 2250], BLUR],
  ['work/datoura/cover-p', datoura('STADIUM-ADVERTISING-BOARD-MOCKUP.jpg'), [230, 200, 2100, 2700]],
  // the phone on its own violet gradient: the page lays the same gradient around it
  ['work/datoura/phone', datoura('iPhone-15-Pro-Max---Hand-Mockup.jpg')],
  // the front card only (the back carries a sample name and contact details)
  ['work/datoura/card-print', datoura('Business-Card-Mockup.jpg'), [300, 100, 1500, 1075]],

  /* ---------------- NURBA (exported boards; logos traced by scripts/nurba-extract.mjs) ---------------- */
  // the two bangles, engraved in gold and silver: the cover
  ['work/nurba/cover', nurba(12), null, BLUR],
  ['work/nurba/card', nurba(11)],
  ['work/nurba/envelopes', nurba(13)],
  ['work/nurba/subway', nurba(10)],
  // the poster alone, in its lightbox
  ['work/nurba/poster', nurba(10), [660, 260, 600, 1100]],
  // board 14, object by object (the ID badge carries a person's photograph and name, the receipt sample prices)
  ['work/nurba/cases', nurba(14), [300, 120, 1320, 860]],
  ['work/nurba/gift', nurba(14), [820, 1400, 800, 430]],
  ['work/nurba/necklace', nurba(14), [420, 2200, 1080, 860]],
  // the shopping bags, supplied as a transparent mockup (the file linked in the package)
  ['work/nurba/bags', 'brand/work/nurba/Nurba11_Folder/Nurba11_Folder/Links/Shopping Bags Mockup (7).png', [500, 700, 4100, 2000], { alpha: true }],

  /* ---------------- NASAQ's own identity ---------------- */
  // Transparent cutout supplied for the Studio section (kept transparent)
  ['studio/portrait', 'brand/identity/Blue-Rimmed Shadow Portrait.png', [0, 20, 1222, 1267], { alpha: true }],
  // identity applications chosen for the Studio chapter
  ['studio/billboard', id(7), null, { background: '#000000' }],
  ['studio/badge', id(13), [130, 0, 700, 1080]],
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
    if (!options.alpha) pipeline = pipeline.flatten({ background: options.background ?? '#ffffff' });
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
// `webp`: for logo files with soft, textured edges, where PNG is several times heavier.
async function exportLogo(source, key, width, { webp = false } = {}) {
  const file = path.join(ROOT, 'public', `${key}.${webp ? 'webp' : 'png'}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const pipeline = sharp(path.join(ROOT, source)).trim().resize({ width, withoutEnlargement: true });
  const info = await (webp
    ? pipeline.webp({ quality: 92, alphaQuality: 100, effort: 6 })
    : pipeline.png({ compressionLevel: 9, palette: true })
  ).toFile(file);
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

/*
 * Signature assets — the pieces of each identity the interface is built from.
 * Shapes are lifted from the supplied artwork (never redrawn):
 *   mask   a flat-colour shape on a slide → white-on-transparent PNG, used with
 *          CSS mask-image so the interface can colour and repeat it
 *   strip  an opaque crop that tiles horizontally
 */
async function exportMask(key, source, [left, top, width, height], colour, { scale = 4, near = 28, far = 70 } = {}) {
  const { data, info } = await sharp(path.join(ROOT, source))
    .flatten({ background: '#ffffff' })
    .extract({ left, top, width, height })
    .resize({ width: width * scale, kernel: 'lanczos3' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(colour.slice(i, i + 2), 16));
  const alpha = Buffer.alloc(info.width * info.height);
  for (let i = 0; i < alpha.length; i++) {
    const d = Math.hypot(data[i * 3] - r, data[i * 3 + 1] - g, data[i * 3 + 2] - b);
    alpha[i] = Math.round(255 * Math.min(1, Math.max(0, (far - d) / (far - near))));
  }
  const file = path.join(ROOT, 'public', `${key}.png`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await sharp(Buffer.alloc(info.width * info.height * 3, 255), {
    raw: { width: info.width, height: info.height, channels: 3 },
  })
    .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png({ compressionLevel: 9, palette: true })
    .toFile(file);
  out[key] = { width: info.width, height: info.height };
  console.log(key, info.width, info.height);
}

// Bounding box of a flat colour inside a search window (keeps crops tight to the artwork).
async function boundsOf(source, [left, top, width, height], colour, pad = 4) {
  const { data, info } = await sharp(path.join(ROOT, source))
    .flatten({ background: '#ffffff' })
    .extract({ left, top, width, height })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(colour.slice(i, i + 2), 16));
  let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 3;
      if (Math.hypot(data[i] - r, data[i + 1] - g, data[i + 2] - b) < 40) {
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
    }
  return [left + x0 - pad, top + y0 - pad, x1 - x0 + 1 + pad * 2, y1 - y0 + 1 + pad * 2];
}

async function exportSignatures() {
  // Rumh — the spearhead alone, in its own colour (top of the vertical logo file)
  {
    const key = 'work/rumh/mark';
    const logo = await sharp(path.join(ROOT, rumhFile('الشعار عامودي بالابيض png@4x.png'))).trim().toBuffer();
    const info = await sharp(logo)
      .extract({ left: 584, top: 0, width: 736, height: 737 })
      .resize({ width: 640 })
      .png({ compressionLevel: 9, palette: true })
      .toFile(path.join(ROOT, 'public', `${key}.png`));
    out[key] = { width: info.width, height: info.height };
  }
  // Rumh — the flag from the graphic-elements page
  await exportMask('work/rumh/flag', rumhSlide(22), await boundsOf(rumhSlide(22), [150, 180, 320, 220], '#FF3C55'), '#FF3C55', { scale: 3, near: 60, far: 180 });

  // Louiza — one leaf mark from the pattern page (rose on cream)
  await exportMask('work/louiza/leaf', lew[8], [679, 51, 84, 98], '#BC8F8F', { scale: 6, near: 30, far: 80 });

  // Rukaz — six periods of the pattern (30 px period), and the logo lockup
  await exportMask('work/rukaz/pattern-tile', rukaz[5], [900, 300, 180, 180], '#CFCBBA', { scale: 4, near: 40, far: 95 });
  // the type specimen (Aa + alphabet) as a shape, so it can be set large and stay sharp
  await exportMask('work/rukaz/type-mask', rukaz[3], [120, 238, 1150, 326], '#CFCBBA', { scale: 3, near: 30, far: 75 });
  await exportMask('work/rukaz/logo-mask', rukaz[2], await boundsOf(rukaz[2], [250, 180, 900, 340], '#CFCBBA'), '#CFCBBA', { scale: 3, near: 30, far: 75 });

  // Snack Quest — one period (625 px) of the slogan ticker with its pixel flames
  {
    const key = 'work/snack-quest/ticker';
    const info = await sharp(path.join(ROOT, snaok[0]))
      .flatten({ background: '#ffffff' })
      .extract({ left: 0, top: 791, width: 625, height: 92 })
      .resize({ width: 1875, kernel: 'lanczos3' })
      .webp({ quality: 88, effort: 5 })
      .toFile(path.join(ROOT, 'public', `${key}.webp`));
    out[key] = { width: info.width, height: info.height };
  }
}

const only = process.argv[2];
const manifestFile = path.join(ROOT, 'src/data/media.json');
if (only && fs.existsSync(manifestFile)) Object.assign(out, JSON.parse(fs.readFileSync(manifestFile, 'utf8')));

for (const entry of MANIFEST) if (!only || entry[0].startsWith(only)) await exportImage(entry);
await exportLogo(rumhFile('الشعار  بالاسم كامل أفقي بالابيض png@4x.png'), 'work/rumh/logo-white', 1400);
await exportLogo(rumhFile('الشعار  بالاسم كامل أفقي بالكحلي png@4x.png'), 'work/rumh/logo-navy', 1400);
// Clean logo files supplied separately (transparent artboards, trimmed here)
await exportLogo('brand/work/lew/logo/Minimalist White Arabic Leaf Logo.png', 'work/louiza/logo-white', 493, { webp: true });
await exportLogo('brand/work/snaok/logo/Pixel Snack Quest Logo.png', 'work/snack-quest/logo', 1095, { webp: true });
await exportLogo('brand/work/DATOURA_Folder/extracted/logo-white.png', 'work/datoura/logo-white', 1200);
// NURBA: the traced logo pieces (white on transparent, painted by the page as masks)
await exportLogo('brand/work/nurba/extracted/logo-horizontal.png', 'work/nurba/logo-horizontal', 2400);
await exportLogo('brand/work/nurba/extracted/logo-stacked.png', 'work/nurba/logo-stacked', 1800);
await exportLogo('brand/work/nurba/extracted/monogram.png', 'work/nurba/monogram', 1200);
await exportLogo('brand/work/nurba/extracted/glint.png', 'work/nurba/glint', 240);
await exportPattern();
await exportSignatures();

// Lossless copies of the collage tiles, beside the untouched collage
{
  const dir = path.join(ROOT, 'brand/work/rukaz/extracted');
  fs.mkdirSync(dir, { recursive: true });
  for (const [i, [name, [left, top, width, height]]] of RUKAZ_APPS.entries()) {
    await sharp(path.join(ROOT, rukaz[6]))
      .extract({ left, top, width, height })
      .png({ compressionLevel: 9 })
      .toFile(path.join(dir, `${String(i + 1).padStart(2, '0')}-${name}.png`));
  }
}

fs.writeFileSync(manifestFile, JSON.stringify(out, null, 2) + '\n');
console.log(`\n${Object.keys(out).length} assets → src/data/media.json`);

// Social sharing image (Open Graph): the NASAQ identity cover, 1200 × 630.
await sharp(path.join(ROOT, id(1)))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(ROOT, 'public/og.jpg'));
