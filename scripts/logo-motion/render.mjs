/*
 * Logo motion films, rendered from the official logo files.
 *
 *   node scripts/logo-motion/render.mjs [slug ...]
 *
 * For each project: the supplied logo is split into its own parts (./parts.mjs),
 * the parts are animated by a GSAP scene (./scenes/<slug>.js) in headless Chrome,
 * the scene is captured frame by frame and encoded to
 *   public/work/<slug>/video/logo-motion.webm   (VP9)
 *   public/work/<slug>/video/logo-motion.mp4    (H.264, fallback)
 *   public/work/<slug>/video/logo-motion-poster.webp   (the assembled logo)
 *
 * Every scene starts and ends on its empty field, so the films loop without a seam,
 * and every scene comes to rest on the logo exactly as supplied.
 *
 * Needs: sharp (devDependency), ffmpeg on PATH, Google Chrome and the Playwright
 * library (global `@playwright/cli` install, or set PLAYWRIGHT_PATH to a playwright package).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { LOGOS, renameByOrder } from './logos.mjs';
import { split } from './parts.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const require = createRequire(import.meta.url);
const playwrightPath =
  process.env.PLAYWRIGHT_PATH ??
  path.join(process.env.APPDATA ?? '', 'npm/node_modules/@playwright/cli/node_modules/playwright');
const { chromium } = require(playwrightPath);

function encode(frames, fps, out) {
  const input = ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(frames, 'f%04d.png')];
  const colour = [
    '-vf',
    'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
    '-colorspace',
    'bt709',
    '-color_primaries',
    'bt709',
    '-color_trc',
    'bt709',
    '-color_range',
    'tv',
  ];
  execFileSync('ffmpeg', [
    ...input,
    ...colour,
    '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '34', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '1',
    '-an', `${out}.webm`,
  ]);
  execFileSync('ffmpeg', [
    ...input,
    ...colour,
    '-c:v', 'libx264', '-crf', '21', '-preset', 'slow', '-profile:v', 'high', '-movflags', '+faststart',
    '-an', `${out}.mp4`,
  ]);
}

async function render(browser, slug) {
  const logo = LOGOS[slug];
  const scene = path.join(HERE, 'scenes', `${slug}.js`);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `logo-motion-${slug}-`));
  const frames = path.join(tmp, 'frames');
  fs.mkdirSync(frames);

  // 1 — parts
  const cut = await split(logo.source(), { ...logo.split, width: logo.width });
  const parts = renameByOrder(cut.parts);
  const urls = {};
  const boxes = {};
  for (const [name, buf] of Object.entries(parts)) {
    const p = path.join(tmp, `${name}.png`);
    fs.writeFileSync(p, buf);
    // data URLs: CSS masks will not load file:// images
    urls[name] = `data:image/png;base64,${buf.toString('base64')}`;
    const { info } = await sharp(buf).trim().toBuffer({ resolveWithObject: true });
    boxes[name] = [-info.trimOffsetLeft, -info.trimOffsetTop, info.width, info.height];
  }
  // shared artwork the scenes may use: Rukaz's pattern tile, NURBA's glint
  const dataUrl = (file) => `data:image/png;base64,${fs.readFileSync(path.join(ROOT, file)).toString('base64')}`;
  const extras = { pattern: dataUrl('public/work/rukaz/pattern-tile.png'), glint: dataUrl('public/work/nurba/glint.png') };

  // 2 — the scene
  const log = (m) => process.env.DEBUG && console.log(slug, m);
  log("parts ready");
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(pathToFileURL(path.join(HERE, 'stage.html')).href);
  await page.addScriptTag({ path: path.join(ROOT, 'node_modules/gsap/dist/gsap.min.js') });
  await page.addScriptTag({ path: scene });
  const meta = await page.evaluate(
    ({ urls, size, boxes, extras }) => window.mount(urls, size, boxes, extras),
    { urls, size: { width: cut.width, height: cut.height }, boxes, extras },
  );
  log("mounted");
  await page.setViewportSize({ width: meta.width, height: meta.height });
  if (errors.length) throw new Error(errors.join('\n'));

  // 3 — frames
  const total = Math.round(meta.duration * meta.fps);
  for (let i = 0; i < total; i++) {
    if (process.env.DEBUG === "2") console.log(i, Date.now() % 100000);
    await page.evaluate((t) => window.seek(t), i / meta.fps);
    await page.screenshot({ path: path.join(frames, `f${String(i).padStart(4, '0')}.png`) });
  }
  await page.evaluate((t) => window.seek(t), meta.poster);
  const poster = await page.screenshot();
  await page.close();

  // 4 — files
  const outDir = path.join(ROOT, 'public/work', slug, 'video');
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, 'logo-motion');
  encode(frames, meta.fps, out);
  await sharp(poster).webp({ quality: 88 }).toFile(`${out}-poster.webp`);
  fs.rmSync(tmp, { recursive: true, force: true });

  const kb = (f) => `${Math.round(fs.statSync(f).size / 1024)} KB`;
  console.log(
    `${slug}: ${meta.width}×${meta.height}, ${meta.duration}s @ ${meta.fps}fps — webm ${kb(`${out}.webm`)}, mp4 ${kb(`${out}.mp4`)}, poster ${kb(`${out}-poster.webp`)}`,
  );
}

const wanted = process.argv.slice(2);
const slugs = wanted.length ? wanted : Object.keys(LOGOS);
const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const slug of slugs) {
    if (!LOGOS[slug]) throw new Error(`Unknown logo "${slug}"`);
    await render(browser, slug);
  }
} finally {
  await browser.close();
}
