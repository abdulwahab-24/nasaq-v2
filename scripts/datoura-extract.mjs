/*
 * DATOURA's identity is supplied as one packaged Illustrator file
 * (brand/work/DATOURA_Folder/DATOURA_Folder/DATOURA.ai, PDF-compatible, 16
 * artboards). Its artwork is vector, so the site takes it as vector: this script
 * lifts the pieces the case study and the Selected Work scene draw, without
 * altering anything:
 *
 *   src/projects/datoura/art.json                      the artboards' drawings as absolute
 *                                                      paths, grouped by role (see ART below)
 *   brand/work/DATOURA_Folder/extracted/logo-white.svg the horizontal lockup, vector,
 *                                                      exactly as drawn (artboard 9)
 *   brand/work/DATOURA_Folder/extracted/logo-white.png the same, 2400 px wide, transparent
 *   src/projects/datoura/symbol.json                   the symbol's three rings (vector),
 *                                                      for the Selected Work motion
 *
 * Then: node scripts/build-media.mjs work/datoura  (web images)
 *       node scripts/logo-motion/export-parts.mjs datoura  (logo parts)
 *
 * Needs MuPDF (WebAssembly), which the site does not depend on. Install it
 * anywhere and point MUPDF at its entry, e.g.
 *   npm i --prefix /tmp/mupdf mupdf
 *   MUPDF=file:///tmp/mupdf/node_modules/mupdf/dist/mupdf.js node scripts/datoura-extract.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'brand/work/DATOURA_Folder/DATOURA_Folder/DATOURA.ai');
const OUT = path.join(ROOT, 'brand/work/DATOURA_Folder/extracted');
const mupdf = await import(process.env.MUPDF ?? 'mupdf');

// Artboards not used: 2 (moodboard of third-party references), 8 and 14 (business cards
// carrying a sample name and contact details), 10 (a raster screenshot; the high-resolution
// phone mockup in Links/ is used instead), 12 ("Thank you"), 16 (a fragment). The palette (6)
// and logo variations (9) are read off the artboards into datoura.data.js.
// The photographs are the mockups in DATOURA_Folder/Links/, read by scripts/build-media.mjs.

fs.mkdirSync(OUT, { recursive: true });
const doc = mupdf.Document.openDocument(fs.readFileSync(SRC), 'application/pdf');

/* ---------- the lockup, from the logo-variations artboard (9) ---------- */
const svgOf = (n) => {
  const page = doc.loadPage(n - 1);
  const buf = new mupdf.Buffer();
  const writer = new mupdf.DocumentWriter(buf, 'svg', 'text=path');
  const dev = writer.beginPage(page.getBounds());
  page.run(dev, mupdf.Matrix.identity);
  writer.endPage();
  writer.close();
  return buf.asString();
};

// The top-left tile holds the lockup in Soft White (#f4f4f4) on black: seven
// letters (D Λ T O U R Λ) and the symbol's three rings, every one an outlined path.
const paths = [...svgOf(9).matchAll(/<path transform="matrix\(1,0,0,-1,([\d.]+),([\d.]+)\)" d="([^"]+)" fill="#f4f4f4"\/>/g)]
  .map(([, tx, ty, d]) => ({ tx: +tx, ty: +ty, d }))
  .filter(({ tx, ty }) => tx > 290 && tx < 640 && ty > 190 && ty < 290);
if (paths.length !== 10) throw new Error(`expected 10 lockup paths, found ${paths.length}`);

const body = (fill) =>
  paths.map(({ tx, ty, d }) => `<path transform="matrix(1,0,0,-1,${tx},${ty})" d="${d}" fill="${fill}"/>`).join('\n');

// measure the drawn extent: render a generous window at 10 px per unit and trim
const WIN = [250, 180, 420, 120];
const K = 10;
const probe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${WIN.join(' ')}" width="${WIN[2] * K}" height="${WIN[3] * K}">${body('#fff')}</svg>`;
const { info } = await sharp(Buffer.from(probe)).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
const box = [
  WIN[0] - info.trimOffsetLeft / K,
  WIN[1] - info.trimOffsetTop / K,
  info.width / K,
  info.height / K,
].map((v) => +v.toFixed(3));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.join(' ')}">\n${body('#f4f4f4')}\n</svg>\n`;
fs.writeFileSync(path.join(OUT, 'logo-white.svg'), svg);
const width = 2400;
await sharp(Buffer.from(svg.replace('<svg ', `<svg width="${width}" height="${Math.round((width * box[3]) / box[2])}" `)))
  .png()
  .toFile(path.join(OUT, 'logo-white.png'));
console.log('lockup', box.join(' '));

/* ---------- the symbol's rings, for code ---------- */
// The rings are the three paths drawn left of the wordmark (smallest tx); each is
// a filled band: its first subpath is the band's inner edge, its second the outer.
const rings = paths
  .filter((p) => p.tx < 330)
  .sort((a, b) => a.ty - b.ty) // outermost (highest top) first
  .map(({ tx, ty, d }) => ({ tx, ty, d }));
fs.writeFileSync(
  path.join(ROOT, 'src/projects/datoura/symbol.json'),
  `${JSON.stringify({ viewBox: box, rings }, null, 2)}\n`,
);
console.log('symbol rings', rings.length);

/* ---------- the artboards' drawings, as data the page draws and animates ---------- */
/*
 * mupdf writes each artboard as SVG: shapes as <path transform="matrix(…)" d="…">,
 * text as <use> of glyph outlines (so Brando Arabic, which was not packaged, still
 * arrives as its own letterforms). Every shape is baked into absolute artboard
 * coordinates (y down) and tagged with its role, so a piece can be drawn,
 * recoloured and animated part by part.
 */
const TOKEN = /[MLHVCSQTAZmlhvcsqtaz]|[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g;
const ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2 };
const r2 = (v) => +v.toFixed(2);

// a path in local coordinates → absolute, under matrix(a, 0, 0, d, e, f)
function bake(d, [a, b, c, dd, e, f]) {
  if (b || c) throw new Error('rotated shapes are not expected');
  const X = (x) => r2(a * x + e);
  const Y = (y) => r2(dd * y + f);
  const tokens = d.match(TOKEN);
  const out = [];
  let i = 0;
  let cmd = '';
  let [x, y, sx, sy] = [0, 0, 0, 0];
  while (i < tokens.length) {
    if (/[a-z]/i.test(tokens[i])) cmd = tokens[i++];
    const up = cmd.toUpperCase();
    const rel = cmd !== up;
    if (up === 'Z') {
      out.push('Z');
      [x, y] = [sx, sy];
      continue;
    }
    if (!ARGS[up]) throw new Error(`unexpected path command ${cmd}`);
    const v = tokens.slice(i, i + ARGS[up]).map(Number);
    i += ARGS[up];
    if (up === 'H' || up === 'V') {
      if (up === 'H') x = rel ? x + v[0] : v[0];
      else y = rel ? y + v[0] : v[0];
      out.push(`L${X(x)} ${Y(y)}`);
      continue;
    }
    const pts = [];
    for (let k = 0; k < v.length; k += 2) pts.push([rel ? x + v[k] : v[k], rel ? y + v[k + 1] : v[k + 1]]);
    [x, y] = pts.at(-1);
    if (up === 'M') {
      [sx, sy] = [x, y];
      cmd = rel ? 'l' : 'L'; // further pairs after a move are lines
    }
    out.push(up + pts.map(([px, py]) => `${X(px)} ${Y(py)}`).join(' '));
  }
  return out.join('');
}

const attr = (tag, name) => tag.match(new RegExp(` ${name}="([^"]*)"`))?.[1];

// Every drawn shape on an artboard: { d (absolute), fill, stroke, width, rule, tx, ty, text }
function shapesOf(n) {
  const svg = svgOf(n);
  const glyphs = Object.fromEntries([...svg.matchAll(/<path id="(font_\d+_\d+)" d="([^"]*)"/g)].map((m) => [m[1], m[2]]));
  const body = svg.replace(/<defs>[\s\S]*?<\/defs>/g, '').replace(/<clipPath[\s\S]*?<\/clipPath>/g, '');
  const out = [];
  for (const [tag] of body.matchAll(/<(?:path|use) [^>]*\/>/g)) {
    const mat = (attr(tag, 'transform')?.match(/matrix\(([^)]*)\)/)?.[1] ?? '1,0,0,1,0,0').split(',').map(Number);
    const href = attr(tag, 'xlink:href');
    const local = href ? glyphs[href.slice(1)] : attr(tag, 'd');
    if (!local) continue;
    const width = attr(tag, 'stroke-width');
    out.push({
      d: bake(local, mat),
      fill: attr(tag, 'fill'),
      stroke: attr(tag, 'stroke'),
      width: width ? r2(+width) : undefined,
      rule: attr(tag, 'fill-rule'),
      tx: mat[4],
      ty: mat[5],
      text: href ? attr(tag, 'data-text') ?? '' : undefined,
    });
  }
  return out;
}

// the artboard's own field: a plain rectangle the width of the artboard
const isBackdrop = (p) => !p.stroke && p.text === undefined && p.d.length < 80 && /\b1920\b/.test(p.d);
const isHairline = (p) => p.width === 0.25; // mupdf doubles each filled letter with a hairline outline

// The drawn extent of some items, measured like the lockup above (render, trim).
async function extent(items, pad = 0) {
  const k = 2;
  const shapes = items
    .map((p) => `<path d="${p.d}" fill="${p.fill ? '#fff' : 'none'}" stroke="${p.stroke ? '#fff' : 'none'}" stroke-width="${p.width ?? 0}"/>`)
    .join('');
  const probe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 1200" width="${2000 * k}" height="${1200 * k}">${shapes}</svg>`;
  const { info } = await sharp(Buffer.from(probe)).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  return [-info.trimOffsetLeft / k - pad, -info.trimOffsetTop / k - pad, info.width / k + pad * 2, info.height / k + pad * 2].map(r2);
}

const item = (role, p, extra = {}) => ({
  role,
  d: p.d,
  ...(p.fill && p.fill !== 'none' ? { fill: p.fill } : {}),
  ...(p.stroke ? { stroke: p.stroke, width: p.width } : {}),
  ...(p.rule ? { rule: p.rule } : {}),
  ...extra,
});

const ART = {};

// 3 — the concept: shield shape + graduated waves + analytical character, each captioned
{
  const all = shapesOf(3).filter((p) => !isBackdrop(p) && !isHairline(p));
  const shapes = all.filter((p) => p.text === undefined);
  const shield = shapes.find((p) => p.rule === 'evenodd');
  const bars = shapes.filter((p) => p.fill === '#d4dadd' && p.tx > 900 && p.tx < 1020);
  const arc = shapes.filter((p) => p.stroke && p.tx > 1200);
  const plus = shapes.filter((p) => p.fill === '#d1d5db');
  const centres = [shield.tx, (bars[0].tx + bars.at(-1).tx) / 2, arc[0].tx];
  const column = (x) => centres.reduce((best, c, i) => (Math.abs(c - x) < Math.abs(centres[best] - x) ? i : best), 0);
  const captions = all
    .filter((p) => p.text !== undefined)
    .map((p) => item(p.ty < 600 ? 'title' : 'note', p, { col: column(p.tx) }));
  const items = [
    item('shield', shield),
    ...bars.map((p) => item('bar', p)),
    ...arc.map((p) => item('arc', p)),
    ...plus.map((p) => item('plus', p)),
    ...captions,
  ];
  ART.concept = { viewBox: await extent(items, 8), items };
}

// 4 — the lockup on its construction lines, and the concept line (Brando Arabic, in Lilac)
{
  const all = shapesOf(4).filter((p) => !isBackdrop(p) && !isHairline(p));
  const items = [
    ...all.filter((p) => p.text === undefined && p.fill === '#f4f4f4').map((p) => item(p.tx < 700 ? 'ring' : 'letter', p)),
    ...all.filter((p) => p.stroke === '#ffffff').map((p) => item('guide', p)),
    ...all.filter((p) => p.text !== undefined && p.fill === '#a17eff').map((p) => item('line', p)),
  ];
  ART.lockup = { viewBox: await extent(items, 8), items };
}

// 5 — the wordmark in outline, wider than its artboard (so its viewBox is the artboard)
{
  const items = shapesOf(5)
    .filter((p) => p.stroke)
    .map((p) => item(p.width >= 3 ? 'letter' : 'guide', p));
  ART.outline = { viewBox: [0, 0, 1920, 1080], items };
}

// 7 — the Arabic specimen: أب in Brando Arabic, Thin to Black, moved onto one shared baseline
{
  const glyphs = shapesOf(7).filter((p) => p.text !== undefined && p.fill === '#ffffff' && p.tx > 690 && p.tx < 760);
  const rows = [...new Set(glyphs.map((p) => Math.round(p.ty)))].sort((a, b) => a - b);
  const items = rows.flatMap((row, w) =>
    glyphs
      .filter((p) => Math.round(p.ty) === row)
      .map((p) => item(`weight-${w}`, { ...p, d: bake(p.d, [1, 0, 0, 1, 0, rows[0] - row]) })),
  );
  ART.arabic = { viewBox: await extent(items, 6), items };
}

// 11 — the graduated waves: contour bands stepping from near-black (outside) to violet (inside)
{
  const items = shapesOf(11)
    // (this artboard's field stops short of its right edge, so it is told apart by size)
    .filter((p) => p.fill && !p.stroke && p.text === undefined && p.d.length > 100)
    .map((p) => item(p.tx < 1000 ? 'field' : 'symbol', p));
  ART.waves = { viewBox: await extent(items, 2), items };
}

// 15 — the card front (its own artboard, 644 × 368): six contours graded in weight and
// colour, the wordmark inside them
{
  const all = shapesOf(15).filter((p) => !isHairline(p) && p.fill !== '#1f162f');
  const items = [
    ...all.filter((p) => p.stroke).map((p) => item('contour', p)),
    ...all.filter((p) => p.fill === '#f4f4f4').map((p) => item('letter', p)),
  ];
  ART.card = { viewBox: [0, 0, 643.68, 367.92], items };
}

// 13 — the tagline lockup: the symbol beside "From Numbers / to Vision"
{
  const all = shapesOf(13).filter((p) => !isHairline(p));
  const items = [
    ...all.filter((p) => p.text === undefined && p.fill === '#f4f4f4').map((p) => item('ring', p)),
    ...all.filter((p) => p.text !== undefined).map((p) => item(p.ty < 60 ? 'line-1' : 'line-2', { ...p, fill: '#f4f4f4' })),
  ];
  ART.tagline = { viewBox: await extent(items, 4), items };
}

fs.writeFileSync(path.join(ROOT, 'src/projects/datoura/art.json'), `${JSON.stringify(ART)}\n`);
for (const [name, piece] of Object.entries(ART)) {
  const roles = {};
  piece.items.forEach((p) => (roles[p.role] = (roles[p.role] ?? 0) + 1));
  console.log('art', name, piece.viewBox.join(' '), JSON.stringify(roles));
}
