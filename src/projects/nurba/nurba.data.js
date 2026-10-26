/*
 * NURBA — نوربا. Content and media for its own page (NurbaPage.jsx + components/,
 * styles in nurba.css, geometry and motion in nurba.motion.js) and its Selected Work
 * scene (nurba.sequence.js).
 *
 * Sources: brand/work/nurba — fifteen exported boards of the identity (Nurba11-02…16)
 * and the package of its Illustrator file (Nurba11_Folder: two fonts, the linked
 * shopping-bag mockup and the package report; the .ai itself is not included).
 *   - Logo: board 16 (the arrangements on a transparent artboard), traced to vector by
 *     scripts/nurba-extract.mjs into brand/work/nurba/extracted/; web masks
 *     public/work/nurba/{logo-horizontal,logo-stacked,monogram,glint}.png and logo parts
 *     public/work/nurba/parts/ (scripts/logo-motion/export-parts.mjs).
 *   - Photographs: boards 10–14 and the bag mockup, public/work/nurba (scripts/build-media.mjs).
 *     Left out: board 9 (a letterhead too small to read), board 15 (the designer's
 *     closing slide), the ID badge on board 14 (a person's photograph and name) and the
 *     receipt beside it (sample prices).
 *   - Colours: the values printed on the colour board (7). It gives no names.
 *   - Type: the typography board names Snaga Arabic Text (Regular, Light, Extralight,
 *     Thin), an Adobe Fonts face that is not packaged and not licensed here for the
 *     web: the page uses the site's faces and shows the identity's own lettering only
 *     as the traced logo.
 *
 * Copy: the two lines are the identity's own (the envelope, the poster). Everything
 * else describes what the boards show. Client, year, location and services are not
 * stated anywhere and stay empty.
 */
import { lazy } from 'react';
import { asset, img, logoMotion } from '../../utils/media';
import logoParts from './logo-parts.json';
import sequence from './nurba.sequence';

// its own chunk: the page's code loads only when the page is opened
const NurbaPage = lazy(() => import('./NurbaPage'));

const media = (key, alt, extra) => img(`work/nurba/${key}`, alt, extra);

const M = {
  cover: media('cover', 'Two NURBA bangles, gold and silver, the wordmark engraved on each', { position: '50% 55%' }),
  card: media('card', 'A navy NURBA card edged with the N and B pattern, on folded fabric under textured glass', {
    position: '55% 50%',
  }),
  envelopes: media('envelopes', 'Two blue NURBA envelopes, “Luxury in Every Detail”, on perforated steel', {
    position: '60% 50%',
  }),
  subway: media('subway', 'A NURBA poster in a metro carriage: an octagonal ring and “Because You Deserve the Best”'),
  cases: media('cases', 'Two pale blue NURBA bracelet cases, one open, the monogram on the lid'),
  gift: media('gift', 'A NURBA gift box: the monogram on its sleeve, tissue printed with the pattern, a round seal'),
  necklace: media(
    'necklace',
    'An open NURBA necklace case with the wordmark in its lid, beside a navy box with the monogram',
  ),
  bags: media(
    'bags',
    'Two navy NURBA shopping bags with cream ribbon handles: the monogram on one, the wordmark on the other',
  ),
};

export default {
  slug: 'nurba',
  name: 'NURBA',
  nameAr: 'نوربا',
  category: 'Visual Identity',
  year: null,
  location: null,
  tagline: 'Luxury in Every Detail', // the line on the identity's envelopes
  description: null,
  overview: null,
  services: [],
  featured: true,
  order: 4,
  page: NurbaPage,
  signature: 'facet',
  theme: {
    mode: 'dark',
    surface: '#1F354D',
    accent: '#E6B964',
    ink: '#F2ECE4',
  },
  sig: { glint: asset('work/nurba/glint', '') },
  logo: asset('work/nurba/logo-stacked', 'NURBA — نوربا: the monogram beside the wordmark'),
  // the logo in motion (scripts/logo-motion/scenes/nurba.js)
  motionLogo: logoMotion('nurba', {
    width: 1600,
    height: 900,
    field: '#1F354D',
    alt: 'The NURBA logo in motion: the octagon is traced round, light reveals the monogram, the letters are set',
  }),
  cover: M.cover,
  video: null,
  identity: {
    // the colour board's values, in its order: depth to light
    colours: [
      { hex: '#1F354D', rgb: '31 53 77', cmyk: '99 77 45 41' },
      { hex: '#385C7E', rgb: '56 92 126', cmyk: '93 61 31 11' },
      { hex: '#7FA1C4', rgb: '127 161 196', cmyk: '58 25 10 0' },
      { hex: '#A7C6DB', rgb: '167 198 219', cmyk: '38 9 8 0' },
      { hex: '#F2ECE4', rgb: '242 236 228', cmyk: '3 5 8 0' },
      { hex: '#F5E3C3', rgb: '245 227 195', cmyk: '1 10 24 0' },
      { hex: '#E6B964', rgb: '230 185 100', cmyk: '3 29 73 0' },
    ],
    typefaces: ['Snaga Arabic Text'],
  },
  media: M,
  copy: {
    lines: {
      envelope: 'Luxury in Every Detail',
      poster: 'Because You Deserve the Best',
    },
    opening: { label: 'Visual identity', labelAr: 'هوية بصرية' },
    statement: {
      text: 'A jewellery identity drawn as a setting: a monogram held in an octagon of two fine lines, the outline of a step-cut stone.',
    },
    monogram: {
      label: 'The monogram',
      labelAr: 'الشعار',
      steps: [
        {
          n: '01',
          title: 'Two lines',
          text: 'An outer and an inner line, every corner cut at forty-five degrees: an octagon.',
        },
        { n: '02', title: 'One stem', text: 'N and B are joined. The last stroke of the N is the stem of the B.' },
        { n: '03', title: 'One glint', text: 'The four-point star of the pattern: the frame catching the light.' },
      ],
    },
    lockups: {
      label: 'Arrangements',
      labelAr: 'أشكال الشعار',
      text: 'Latin and Arabic at one height, the monogram beside them or between them.',
    },
    pattern: {
      label: 'Pattern',
      labelAr: 'النمط',
      text: 'N, glint, B, glint. Each row begins where the last one paused.',
    },
    colour: {
      label: 'Colour',
      labelAr: 'الألوان',
      text: 'Seven colours in one sequence, from deep navy through the blues to cream and gold. Set as facets, the darkest is the outside of the stone and gold its table.',
    },
    applications: {
      cover: { label: 'Engraving', text: 'The wordmark cut into gold and silver.' },
      cases: { label: 'Cases' },
      gift: { label: 'Gift box', text: 'The pattern on the tissue, the monogram on the seal.' },
      necklace: { label: 'Necklace case' },
      bags: { label: 'Shopping bags' },
      card: { label: 'Card' },
      envelopes: { label: 'Envelopes' },
      subway: { label: 'Campaign' },
    },
    finale: { label: 'Logo in motion' },
  },
  // Selected Work: the stacked logo in navy on the identity's cream, its glint in gold
  home: {
    field: '#F2ECE4',
    ink: '#1F354D',
    logo: { dir: '/work/nurba/parts/', manifest: logoParts, paint: { default: '#1F354D' } },
    sequence,
  },
  caseStudy: null,
};
