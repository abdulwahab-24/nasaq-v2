/*
 * Louiza — لويزا. Content and media for its own page (LouizaPage.jsx + components/,
 * styles in louiza.css, logo geometry and easing in louiza.motion.js) and its
 * Selected Work scene (louiza.sequence.js).
 *
 * Sources: brand/work/lew — the identity presentation (screenshots) and the logo.
 *   - Photographs and pages: public/work/louiza (scripts/build-media.mjs).
 *   - The four words, lifted from the typography page as masks:
 *     public/work/louiza/word-*.png (scripts/project-assets.mjs).
 *   - Logo parts and film: scripts/logo-motion/.
 *   - Type: the identity sets its Arabic in Myriad Arabic Light, which is not
 *     available for the web; the page uses the site's faces, and the identity's own
 *     lettering appears only as the supplied masks.
 *
 * Copy comes from the presentation: the four words, the typography note and the
 * colour names (English is a translation). Client, year and services are not stated.
 */
import { lazy } from 'react';
import { asset, img, logoMotion } from '../../utils/media';
import logoParts from './logo-parts.json';
import sequence from './louiza.sequence';

// its own chunk: the page's code loads only when the page is opened
const LouizaPage = lazy(() => import('./LouizaPage'));

const media = (key, alt, extra) => img(`work/louiza/${key}`, alt, extra);

const M = {
  cover: media('cover', 'Louiza shopping bag with the leaf mark and Arabic wordmark'),
  coverPortrait: media('cover-p', 'Louiza shopping bag with the leaf mark and Arabic wordmark'),
  construction: media('construction', 'Louiza logo construction grid on Pacific Blue'),
  mark: media('mark', 'The Louiza leaf mark in rose and blue'),
  pattern: media('pattern', 'Louiza logo over its repeating leaf pattern in rose'),
  type: media('type', 'Louiza Arabic typography: روح عصرية، أناقة، عربي، جمال التفاصيل'),
  badges: media('badges', 'Four Louiza roundels in the brand palette'),
  hoodie: media('hoodie', 'Rose hoodie with a Louiza woven label at the neck'),
  label: media('label', 'Close-up of the Louiza woven label: leaf mark, sizes, “Made with love”'),
  tote: media('tote', 'Canvas tote bag printed with the Louiza logo'),
  totePortrait: media('tote-p', 'Canvas tote bag printed with the Louiza logo'),
  boxes: media('boxes', 'Two Louiza sliding gift boxes'),
  app: media('app', 'The Louiza app icon on a phone home screen', {
    position: '30% 50%',
  }),
  tags: media('tags', 'Three Louiza swing tags with size grids'),
  bags: media('bags', 'Rose and cream Louiza paper bags'),
  box: media('box', 'An open Louiza box lined with the leaf pattern'),
};

export default {
  slug: 'louiza',
  name: 'Louiza',
  nameAr: 'لويزا',
  category: 'Visual Identity',
  year: null,
  location: null,
  tagline: null,
  description: null,
  overview: null,
  services: [],
  featured: true,
  order: 2,
  page: LouizaPage,
  signature: 'bloom',
  theme: {
    mode: 'light',
    surface: '#FFF0DA',
    accent: '#8E5E5E',
    ink: '#563E3E',
    // the identity's soft field: Rosy Taupe and Pacific Blue over Antique White
    gradient:
      'radial-gradient(70% 36% at 0% 34%, rgb(188 143 143 / 0.6), transparent 62%), radial-gradient(75% 40% at 100% 58%, rgb(115 162 172 / 0.62), transparent 64%), #FFF0DA',
  },
  sig: { leaf: asset('work/louiza/leaf', '') },
  logo: asset('work/louiza/logo-white', 'The Louiza logo — leaf mark above the Arabic wordmark', 'webp'),
  logoField: '#BC8F8F', // Rosy Taupe, as the logo sits on the bag
  // the logo in motion, on that same Rosy Taupe (scripts/logo-motion/scenes/louiza.js)
  motionLogo: logoMotion('louiza', {
    width: 1000,
    height: 1000,
    field: '#BC8F8F',
    alt: 'The Louiza logo in motion: the leaves grow from the stem and the Arabic wordmark is written in',
  }),
  cover: M.cover,
  video: null,
  identity: {
    colours: [
      { name: 'Antique White', hex: '#FFF0DA', ink: '#563E3E' },
      { name: 'Pacific Blue', hex: '#73A2AC', ink: '#FFF0DA' },
      { name: 'Taupe', hex: '#9E8A8B', ink: '#FFF0DA' },
      { name: 'Rosy Taupe', hex: '#BC8F8F', ink: '#FFF0DA' },
      { name: 'Smoky Rose', hex: '#8E5E5E', ink: '#FFF0DA' },
      { name: 'Chocolate Plum', hex: '#563E3E', ink: '#FFF0DA' },
    ],
    typefaces: ['Myriad Arabic Light'],
  },
  media: {
    ...M,
    // the four words of the typography page, each as its own mask (white on transparent)
    words: [
      {
        key: 'spirit',
        ar: 'روح عصرية',
        en: 'Modern spirit',
        width: 1488,
        height: 426,
      },
      {
        key: 'elegance',
        ar: 'أناقة',
        en: 'Elegance',
        width: 1410,
        height: 384,
      },
      { key: 'arabic', ar: 'عربي', en: 'Arabic', width: 888, height: 456 },
      {
        key: 'detail',
        ar: 'جمال التفاصيل',
        en: 'Beauty in the details',
        width: 2256,
        height: 402,
      },
    ].map((w) => ({ ...w, src: `/work/louiza/word-${w.key}.png` })),
  },
  // the case study's pages, in order. Applications use two layouts only: a scene laid
  // straight onto the colour the photograph was taken on, or a pair (one large frame
  // running off the right edge, one small frame overlapping it)
  applications: [
    {
      kind: 'scene',
      media: M.box,
      field: '#EEEBE5',
      label: 'Gift box',
      note: 'Lined with the pattern.',
    },
    {
      kind: 'pair',
      items: [M.hoodie, M.label],
      label: 'Apparel',
      note: 'The woven label: the mark, the sizes, “Made with love”.',
    },
    { kind: 'scene', media: M.tags, field: '#FEF3E2', label: 'Swing tags' },
    { kind: 'pair', items: [M.bags, M.totePortrait], label: 'Bags' },
    { kind: 'scene', media: M.boxes, field: '#E4C5C4', label: 'Sliding boxes' },
    { kind: 'pair', items: [M.app, M.badges], label: 'App icon and roundels' },
  ],
  copy: {
    opening: { label: 'Visual identity' },
    mark: {
      n: '01',
      label: 'The mark',
      labelAr: 'الشعار',
      title: 'Two leaves.',
    },
    construction: {
      n: '02',
      label: 'Construction',
      labelAr: 'بناء الشعار',
      title: 'Built on one unit.',
      text: 'The mark beside the wordmark, spaced in multiples of a single unit, x.',
    },
    words: {
      n: '03',
      label: 'Typography',
      labelAr: 'الخطوط',
      title: 'Myriad Arabic Light',
      text: 'Chosen for its softness and flow: a calm character that answers the curves of the logo.',
    },
    colour: {
      n: '04',
      label: 'Colour',
      labelAr: 'الألوان',
      title: 'Six colours, one soft field.',
    },
    pattern: {
      n: '05',
      label: 'Pattern',
      labelAr: 'النمط',
      title: 'The mark, repeated.',
    },
    applications: {
      n: '06',
      label: 'Applications',
      labelAr: 'التطبيقات',
      title: 'In use.',
    },
    finale: { label: 'Logo in motion' },
  },
  // Selected Work: the identity's own pairing, Rosy Taupe on its cream (see identity.colours);
  // cover: the image the next-project teaser uses
  home: {
    cover: M.coverPortrait,
    field: '#FFF0DA',
    ink: '#563E3E',
    logo: {
      dir: '/work/louiza/parts/',
      manifest: logoParts,
      paint: { default: '#BC8F8F' },
    },
    sequence,
  },
  caseStudy: null,
};
