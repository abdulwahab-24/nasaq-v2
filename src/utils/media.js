import manifest from '../data/media.json';

/*
 * Image descriptor for a file produced by scripts/build-media.mjs.
 * `key` is the path under /public without width/extension, e.g. 'work/rumh/cover'.
 */
export function img(key, alt, extra = {}) {
  const entry = manifest[key];
  if (!entry) throw new Error(`Unknown media "${key}" — run scripts/build-media.mjs`);
  return {
    src: `/${key}`,
    widths: entry.widths,
    width: entry.width,
    height: entry.height,
    alt,
    blur: Boolean(entry.blur),
    ...extra,
  };
}

// Same image, with an art-directed crop for small screens.
export const withMobile = (media, mobile) => ({ ...media, mobile });

// Logos, masks and other single files
export function asset(key, alt, ext = 'png') {
  const entry = manifest[key];
  if (!entry) throw new Error(`Unknown asset "${key}"`);
  return { src: `/${key}.${ext}`, width: entry.width, height: entry.height, alt };
}

export const srcSet = ({ src, widths }) =>
  widths.map((w) => `${src}-${w}.webp ${w}w`).join(', ');

export const defaultSrc = ({ src, widths }) =>
  `${src}-${widths.find((w) => w >= 1200) ?? widths.at(-1)}.webp`;

export const largestSrc = ({ src, widths }) => `${src}-${widths.at(-1)}.webp`;

/*
 * A project's logo motion film: built from the official logo by
 * scripts/logo-motion/render.mjs into public/work/<slug>/video/.
 *   field  — the colour it is filmed on (its first and last frame are that field)
 *   alt    — what the film shows; the poster is the assembled logo
 */
export const logoMotion = (slug, { width, height, field, alt }) => ({
  sources: [
    { src: `/work/${slug}/video/logo-motion.webm`, type: 'video/webm' },
    { src: `/work/${slug}/video/logo-motion.mp4`, type: 'video/mp4' },
  ],
  poster: `/work/${slug}/video/logo-motion-poster.webp`,
  width,
  height,
  field,
  alt,
});
