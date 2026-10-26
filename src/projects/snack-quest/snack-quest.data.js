/*
 * Snack Quest. Content and media for its own page (SnackQuestPage.jsx + components/,
 * styles in snack-quest.css, logo geometry, eases and the pixel cover in
 * snack-quest.motion.js) and its Selected Work scene (snack-quest.sequence.js).
 *
 * Sources: brand/work/snaok — the identity presentation (screenshots) and the logo.
 *   - Photographs and pages: public/work/snack-quest (scripts/build-media.mjs).
 *   - Flames strip and the coin and burger sprites, cut from the presentation:
 *     public/work/snack-quest/flames.png, sprite-*.png (scripts/project-assets.mjs).
 *   - Type: Pixelify Sans (public/work/snack-quest/fonts, SIL Open Font Licence),
 *     the identity's typeface.
 *   - Logo film and parts: scripts/logo-motion/.
 *
 * Copy: the slogan as the identity spells it, the typeface's name and the colour
 * values from the colour page. Client, year, location and services are not stated.
 */
import { lazy } from 'react';
import { asset, img, logoMotion, withMobile } from '../../utils/media';
import logoParts from './logo-parts.json';
import sequence from './snack-quest.sequence';

// its own chunk: the page's code loads only when the page is opened
const SnackQuestPage = lazy(() => import('./SnackQuestPage'));

const media = (key, alt, extra) => img(`work/snack-quest/${key}`, alt, extra);
const sprite = (key, width, height) => ({ src: `/work/snack-quest/sprite-${key}.png`, width, height });

const M = {
  cover: media('cover', 'Snack Quest packaging, bag and fried chicken on cream'),
  interior: media('interior', 'Snack Quest restaurant wall in red with the circular slogan'),
  products: withMobile(
    media('products', 'Snack Quest bag, burger boxes and fried chicken trays'),
    media('products-m', 'Snack Quest bag and burger boxes'),
  ),
  monogram: media('monogram', 'The SQ monogram in five colourways'),
  type: media('type', 'Pixelify Sans specimen inside the circular Snack Quest slogan'),
  colour: media('colour', 'Snack Quest colours drawn as pixel-art shapes'),
  palette: media('palette', 'Snack Quest colour bars: cream, purple, red, orange, green'),
  wallA: media('wall-a', 'Snack Quest dining-room wall with a pixel burger'),
  wallB: media('wall-b', 'Snack Quest dining room with the wall graphic and tables'),
  poster: media('poster', 'Snack Quest burger poster in a restaurant'),
  fries: media('fries', 'Snack Quest fries and dip packaging'),
  applications: media('applications', 'Overview of Snack Quest packaging: fries, ice cream, chicken, burger boxes'),
};

export default {
  slug: 'snack-quest',
  name: 'Snack Quest',
  nameAr: null,
  category: 'Visual Identity',
  year: null,
  location: null,
  tagline: null,
  description: null,
  overview: null,
  services: [],
  featured: true,
  order: 6,
  page: SnackQuestPage,
  signature: 'arcade',
  motion: 'steps', // the identity moves in pixel steps: reveals and openings advance in steps
  theme: { mode: 'dark', surface: '#4D3468', accent: '#FF9C00', ink: '#F4E8C6' },
  sig: {
    // the slogan strip, spelled as it is in the identity
    ticker: asset('work/snack-quest/ticker', 'Snack accepted — hunger defeted!', 'webp'),
  },
  cover: M.cover,
  logo: asset('work/snack-quest/logo', 'The Snack Quest logo', 'webp'),
  // the logo in motion, in pixel steps (scripts/logo-motion/scenes/snack-quest.js)
  motionLogo: logoMotion('snack-quest', {
    width: 1280,
    height: 720,
    field: '#4D3468',
    alt: 'The Snack Quest logo in motion: the plate appears pixel by pixel and the letters are typed in',
  }),
  video: null,
  identity: {
    // values from the colour page; the coin and the burger stand on their colours there
    colours: [
      { name: null, hex: '#F4E8C6', ink: '#4D3468' },
      { name: null, hex: '#4D3468', ink: '#F4E8C6', sprite: sprite('coin', 116, 116) },
      { name: null, hex: '#BA2F2F', ink: '#F4E8C6' },
      { name: null, hex: '#FF9C00', ink: '#000000' },
      { name: null, hex: '#8ACC66', ink: '#000000', sprite: sprite('burger', 131, 123) },
    ],
    typefaces: ['Pixelify Sans'],
  },
  media: M,
  copy: {
    slogan: 'SNACK ACCEPTED ✦ HUNGER DEFETED!', // spelled as in the identity
    monogram: { label: 'Monogram', title: 'SQ, in every colour of the set.' },
    type: { label: 'Typeface', face: 'Pixelify Sans' },
    colour: { label: 'Colour' },
    packaging: { label: 'Packaging', title: 'The plate, on every pack.' },
    spaces: { label: 'Spaces' },
    finale: { label: 'Logo in motion' },
  },
  // Selected Work: the logo as supplied (black plate, white letters) on the identity's purple
  home: {
    field: '#4D3468',
    ink: '#F4E8C6',
    logo: { dir: '/work/snack-quest/parts/', manifest: logoParts, paint: { default: '#FFFFFF', plate: '#000000' } },
    sequence,
  },
  caseStudy: null,
};
