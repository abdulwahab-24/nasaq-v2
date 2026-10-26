/*
 * DATOURA. Content and media for its own page (DatouraPage.jsx + components/, styles
 * in datoura.css) and its Selected Work scene (datoura.sequence.js).
 *
 * Source: brand/work/DATOURA_Folder: one packaged Illustrator file (DATOURA.ai,
 * 16 artboards, with its fonts and linked mockups) and a film of the symbol's
 * contour (1ايقونه.mp4).
 *   - Drawings: art.json and symbol.json, the artboards' vectors lifted by
 *     scripts/datoura-extract.mjs (needs MuPDF; see its header).
 *   - Photographs: the mockups in DATOURA_Folder/Links, as web images in
 *     public/work/datoura (scripts/build-media.mjs).
 *   - Film: public/work/datoura/video/contour.{webm,mp4} + poster, a square crop of
 *     the supplied film, without its (silent) audio track (ffmpeg; see DEVELOPMENT.md).
 *   - Type: DM Sans from DATOURA_Folder/Fonts as WOFF2 in public/work/datoura/fonts
 *     (SIL Open Font License). Brando Arabic (Adobe Fonts) was not packaged, so its
 *     letterforms are used only as the vector glyphs lifted from the artboards.
 *   - Logo parts: public/work/datoura/parts + logo-parts.json (scripts/logo-motion/).
 *
 * Copy is limited to what the identity files say or show: the name as set in their
 * running text, the tagline (artboards 1 and 13), the concept and its captions
 * (artboards 3 and 4, translated), palette (6) and typefaces (7). Year, location,
 * client and services are not stated, so they stay empty.
 */
import { lazy } from 'react';
import { asset, img, withMobile } from '../../utils/media';
import sequence from './datoura.sequence';
import logoParts from './logo-parts.json';

// its own chunk: the page's drawings and plugins load only when the page is opened
const DatouraPage = lazy(() => import('./DatouraPage'));

const media = (key, alt, extra) => img(`work/datoura/${key}`, alt, extra);

const stadium = media('cover', 'DATOURA advertising board, “From Numbers to Vision”, along violet stadium seating');
const stadiumPortrait = media('cover-p', 'DATOURA advertising board along violet stadium seating');

export default {
  slug: 'datoura',
  name: 'DATOURA',
  nameAr: null,
  category: 'Visual Identity',
  year: null,
  location: null,
  tagline: 'From Numbers to Vision',
  description: null,
  overview: null,
  services: [],
  featured: true,
  order: 3,
  page: DatouraPage,
  theme: {
    mode: 'dark',
    surface: '#1F162F',
    accent: '#844BE0',
    ink: '#F4F4F4',
  },
  logo: asset('work/datoura/logo-white', 'DATOURA: the symbol and wordmark'),
  motionLogo: null,
  cover: stadium,
  video: null,
  identity: {
    // artboard 6 gives the colours as hex values only, without names
    colours: [
      { hex: '#0C0C0C' },
      { hex: '#1F162F' },
      { hex: '#844BE0' },
      { hex: '#A17EFF' },
      { hex: '#D1D5DB' },
      { hex: '#F4F4F4' },
    ],
    typefaces: ['Brando Arabic', 'DM Sans'],
  },
  // each colour with the colour the palette artboard (6) sets the symbol in on it
  palette: [
    { hex: '#0C0C0C', ink: '#F4F4F4' },
    { hex: '#1F162F', ink: '#F4F4F4' },
    { hex: '#844BE0', ink: '#F4F4F4' },
    { hex: '#A17EFF', ink: '#F4F4F4' },
    { hex: '#D1D5DB', ink: '#0C0C0C' },
    { hex: '#F4F4F4', ink: '#844BE0' },
  ],
  film: {
    sources: [
      { src: '/work/datoura/video/contour.webm', type: 'video/webm' },
      { src: '/work/datoura/video/contour.mp4', type: 'video/mp4' },
    ],
    poster: '/work/datoura/video/contour-poster.webp',
    label: 'The contour of the DATOURA symbol, vibrating and settling',
  },
  media: {
    stadium: withMobile(stadium, stadiumPortrait),
    cardPrint: media('card-print', 'The printed DATOURA card front on a steel grid'),
    phone: media('phone', 'The DATOURA website on a phone held in one hand'),
  },
  copy: {
    tagline: 'From Numbers to Vision',
    idea: {
      label: 'Idea',
      labelAr: 'الفكرة',
      // artboard 3, its Arabic captions translated
      captions: [
        ['Shield shape', 'Trust, protection, stability'],
        ['Graduated waves', 'Sound waves'],
        ['Analytical character', 'The chart'],
      ],
      conceptLabel: 'Concept: shield shape, graduated waves and analytical character',
      lockupLabel: 'The DATOURA lockup on its construction lines',
      // artboard 4: مستوحى من Data + Aura – إحساس بالبيانات المحيطة
      title: 'Data + Aura',
      line: 'A sense of the surrounding data.',
    },
    wordmark: {
      label: 'Wordmark',
      text: 'Seven letters in one weight. Both A’s drop their crossbar and rise to a point.',
    },
    colour: { label: 'Colour', labelAr: 'الألوان' },
    type: {
      label: 'Typography',
      faces: [
        { name: 'Brando Arabic', weights: ['Thin', 'Light', 'Medium', 'Bold', 'Black'] },
        // the weights supplied with the identity
        { name: 'DM Sans', weights: ['Thin', 'ExtraLight', 'Medium', 'SemiBold', 'Black'] },
      ],
    },
    waves: {
      label: 'Graduated waves',
      labelAr: 'الموجات المتدرجة',
      text: 'The symbol’s contours, continued outward: they step from violet to near-black, one line at a time.',
      artLabel: 'Two fields of graduated contours, violet at the centre, near-black at the edge',
    },
    card: {
      label: 'Business card',
      artLabel: 'The DATOURA card front: the wordmark inside six graduated contours',
    },
    stadium: { label: 'Stadium board' },
    screen: { label: 'Website', text: 'On screen, the contours return as rings and charts.' },
  },
  // Selected Work: the white lockup on the identity's deep violet, as on its own boards
  home: {
    cover: stadiumPortrait,
    field: '#1F162F',
    ink: '#F4F4F4',
    logo: { dir: '/work/datoura/parts/', manifest: logoParts, paint: { default: '#F4F4F4' } },
    sequence,
  },
  caseStudy: null,
};
