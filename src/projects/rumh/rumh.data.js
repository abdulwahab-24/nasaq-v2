/*
 * Rumh — رمح. Content and media for its own page (RumhPage.jsx + components/, styles in
 * rumh.css, geometry and easing in rumh.motion.js) and its Selected Work scene
 * (rumh.sequence.js).
 *
 * Sources: brand/work/rumh — the identity guidelines (37 page exports), the logo in
 * eight supplied arrangements (4× PNG) and one photograph.
 *   - Photographs and pages: public/work/rumh (scripts/build-media.mjs).
 *   - Logo arrangements: public/work/rumh/lockup-*.png (scripts/project-assets.mjs).
 *   - The mark and the pattern are drawn live from their geometry (rumh.motion.js):
 *     the mark's corners are measured from the logo file, the pattern's proportions
 *     from the guidelines' pattern pages.
 *   - Type: Metropolis (public/work/rumh/fonts, public-domain licence), the guidelines'
 *     Latin face. Nassim Arabic Pro is not available for the web; Arabic is set in the
 *     site's Arabic face.
 *   - Logo film and parts: scripts/logo-motion/.
 *
 * Copy comes from the guidelines: the tagline, the six personality words, the two key
 * concepts, the logo, pattern and scalability pages (Arabic as written; English is a
 * translation, shortened). Location, client and services are not stated.
 */
import { lazy } from 'react';
import { asset, img, logoMotion, withMobile } from '../../utils/media';
import logoParts from './logo-parts.json';
import sequence from './rumh.sequence';

// its own chunk: the page's code loads only when the page is opened
const RumhPage = lazy(() => import('./RumhPage'));

const media = (key, alt, extra) => img(`work/rumh/${key}`, alt, extra);
const lockup = (key, name, shape) => ({
  ...asset(`work/rumh/${key}`, `The Rumh logo: ${name.toLowerCase()}`),
  name,
  shape,
});

const M = {
  cover: withMobile(
    media('cover', 'The Rumh spearhead mark debossed into navy leather', { position: '46% 50%' }),
    media('cover-m', 'The Rumh spearhead mark debossed into navy leather'),
  ),
  spear: media('spear', 'A steel spearhead resting on dark stone, the photograph behind the Rumh identity'),
  signage: media(
    'signage',
    'Rumh wayfinding sign for gates 21–54, the mark folded around its corner, beside the pattern',
  ),
  keyring: media('keyring', 'Two Rumh leather key rings, one printed with the pattern, one with the mark'),
  badges: media('badges', 'White and navy Rumh pin badges on the red pattern', { position: '50% 50%' }),
  sign: media('sign', 'The Rumh logo on a clear acrylic plaque mounted on a pale wall', { position: '52% 50%' }),
  digital: media(
    'digital',
    'The Rumh mark as a profile picture on a phone, on the red-to-navy gradient of the guidelines',
    { position: '26% 50%' },
  ),
};

export default {
  slug: 'rumh',
  name: 'Rumh',
  nameAr: 'رمح',
  category: 'Visual Identity',
  year: '2026', // printed on the identity guidelines cover
  location: null,
  tagline: 'Precision hits the target.', // line from the Rumh guidelines
  description: null,
  overview: null,
  services: [],
  featured: true,
  order: 1,
  page: RumhPage,
  signature: 'spear',
  theme: {
    mode: 'dark',
    surface: '#111F35',
    accent: '#FF3C55',
    ink: '#FFFFFF',
    // corners of the spearhead mark, in % of its box (measured from the logo file)
    shape: [
      [0, 0],
      [100, 31],
      [100, 100],
      [31, 100],
    ],
  },
  sig: { mark: asset('work/rumh/mark', ''), flag: asset('work/rumh/flag', '') },
  logo: asset('work/rumh/logo-white', 'Rumh — رمح الإتقان'),
  logoDark: asset('work/rumh/logo-navy', 'Rumh — رمح الإتقان'),
  // the logo in motion: the spearhead is thrown onto its mark (scripts/logo-motion/scenes/rumh.js)
  motionLogo: logoMotion('rumh', {
    width: 1680,
    height: 720,
    field: '#111F35',
    alt: 'The Rumh logo in motion: the spearhead lands on its mark and cuts the wordmark open',
  }),
  cover: M.cover,
  video: null,
  identity: {
    // values from the colour page
    colours: [
      { key: 'navy', name: 'Navy', hex: '#111F35', rgb: 'R17 G31 B53' },
      { key: 'red', name: 'Red', hex: '#FF3C55', rgb: 'R255 G60 B85' },
      { key: 'white', name: 'White', hex: '#FFFFFF', rgb: 'R255 G255 B255' },
    ],
    typefaces: ['Metropolis', 'Nassim Arabic Pro'],
  },
  media: {
    ...M,
    lockups: [
      lockup('lockup-h', 'Horizontal', 'wide'),
      {
        ...asset('work/rumh/logo-white', 'The Rumh logo: horizontal, with the full name'),
        name: 'Horizontal, full name',
        shape: 'wide',
      },
      lockup('lockup-v', 'Vertical', 'tall'),
      lockup('lockup-v-full', 'Vertical, full name', 'tall'),
    ],
  },
  copy: {
    tagline: 'Precision hits the target.',
    nameFullAr: 'رُمح الإتقان', // as set in the full logo
    concept: {
      label: 'Key concepts',
      labelAr: 'المفاهيم الرئيسية للعلامة',
      title: 'Two ideas, one point.',
      ideas: [
        {
          ar: 'القوة الهادئة',
          en: 'Calm strength',
          text: 'Strength that needs no noise or display. Like a spear that strikes without a sound, the brand leaves its mark through clarity and mastery.',
        },
        {
          ar: 'التركيز والدقة',
          en: 'Focus and precision',
          text: 'Real impact comes from hitting the target precisely. Every idea and every decision is aimed at one clear point.',
        },
      ],
    },
    traits: {
      label: 'Brand personality',
      labelAr: 'سمات شخصية العلامة',
      words: [
        ['حازمة', 'Decisive'],
        ['واثقة', 'Confident'],
        ['دقيقة', 'Precise'],
        ['مُنطلِقة', 'Driven'],
        ['مباشرة', 'Direct'],
        ['منضبطة', 'Disciplined'],
      ],
    },
    mark: {
      label: 'The mark',
      labelAr: 'الشعار',
      artLabel: 'The Rumh mark on its construction lines: a square with its upper-left corner raised',
      steps: [
        'A square of right angles: focus and stability.',
        'Its upper-left corner raised, in balance, into the head of a spear.',
        'Simple and clear, with sharp edges and considered proportions.',
      ],
      scale:
        'Drawn to stay clear and recognisable at any size, from the smallest applications to print and large signage.',
    },
    lockups: { label: 'Logo arrangements', labelAr: 'أشكال الشعار' },
    pattern: {
      label: 'Pattern',
      labelAr: 'الأنماط',
      title: 'Sharp angles, repeated.',
      text: 'A geometric pattern built on the sharp angles of the spear. Its arms follow the mark’s two edges, so pattern and mark are drawn on the same lines.',
      artLabel: 'The Rumh pattern: interlocking asterisks in red and navy on white',
    },
    colour: { label: 'Colour', labelAr: 'الألوان' },
    applications: {
      art: {
        label: 'Art direction',
        text: 'The photograph the guidelines are built around: a spearhead on dark stone.',
      },
      signage: { label: 'Wayfinding' },
      sign: { label: 'Signage' },
      objects: { label: 'Objects' },
      digital: { label: 'Digital' },
    },
    finale: { label: 'Logo in motion' },
  },
  // Selected Work: the logo on the identity's navy, its spearhead in the identity's red
  home: {
    field: '#111F35',
    ink: '#FFFFFF',
    logo: { dir: '/work/rumh/parts/', manifest: logoParts, paint: { default: '#FFFFFF', mark: '#FF3C55' } },
    sequence,
  },
  // The identity dissected part by part in the homepage "Anatomy" section
  // (shown for the project named by `home.anatomyProject` in siteConfig.js).
  anatomy: [
    {
      label: 'Concept',
      labelAr: 'الفكرة',
      media: media('concept', 'Rumh concept board', { position: '50% 100%' }),
    },
    { label: 'Logo', labelAr: 'الشعار', kind: 'logo' },
    { label: 'Colour', labelAr: 'الألوان', kind: 'colour' },
    {
      label: 'Pattern',
      labelAr: 'النمط',
      media: media('colour', 'Rumh geometric pattern in red and navy', { position: '50% 50%' }),
    },
    {
      label: 'Application',
      labelAr: 'التطبيقات',
      media: media('signage', 'Rumh wayfinding sign', { position: '62% 50%' }),
    },
  ],
  caseStudy: null,
};
