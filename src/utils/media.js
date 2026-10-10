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

// Logos and other single-file PNGs
export function asset(key, alt) {
  const entry = manifest[key];
  if (!entry) throw new Error(`Unknown asset "${key}"`);
  return { src: `/${key}.png`, width: entry.width, height: entry.height, alt };
}

export const srcSet = ({ src, widths }) =>
  widths.map((w) => `${src}-${w}.webp ${w}w`).join(', ');

export const defaultSrc = ({ src, widths }) =>
  `${src}-${widths.find((w) => w >= 1200) ?? widths.at(-1)}.webp`;

export const largestSrc = ({ src, widths }) => `${src}-${widths.at(-1)}.webp`;

export const isPortrait = (media) => media.height > media.width * 1.05;
