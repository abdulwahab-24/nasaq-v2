/*
 * Louiza — لويزا. Content, media and case-study composition.
 * Uses the shared project page; its `story` below is the page, top to bottom.
 * Own code: components/Bloom.jsx (pattern plate, story block, homepage slot) · styles: louiza.css.
 * Sources: brand/work/lew (presentation screenshots + logo/ folder).
 * Web images: public/work/louiza, built by scripts/build-media.mjs.
 */
import { asset, img } from '../../utils/media';
import { BloomBlock, ChapterBloom } from './components/Bloom';

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
  app: media('app', 'The Louiza app icon on a phone home screen', { position: '30% 50%' }),
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
  cover: M.cover,
  hero: { layout: 'split', media: M.coverPortrait },
  video: null,
  identity: {
    colours: [
      { name: 'Antique White', hex: '#FFF0DA' },
      { name: 'Pacific Blue', hex: '#73A2AC' },
      { name: 'Taupe', hex: '#9E8A8B' },
      { name: 'Rosy Taupe', hex: '#BC8F8F' },
      { name: 'Smoky Rose', hex: '#8E5E5E' },
      { name: 'Chocolate Plum', hex: '#563E3E' },
    ],
    typefaces: ['Myriad Arabic Light'],
  },
  home: {
    layout: 'spread',
    cover: M.coverPortrait,
    details: [M.label, M.totePortrait],
    bloom: { field: '#73A2AC', ink: '#FFF0DA' },
    slots: { spread: ChapterBloom },
  },
  story: [
    { type: 'logo', variant: 'dark', tone: '#BC8F8F' },
    { type: 'pair', items: [M.mark, M.construction], ratio: 'wide-left' },
    { type: 'stage', media: M.type, tone: 'page', size: 'l', place: 'center', label: 'Typography' },
    { type: 'palette' },
    {
      type: 'detail',
      media: M.label,
      label: 'Woven label',
      labelAr: 'الملصق',
      context: M.hoodie,
      contextLabel: 'Apparel',
    },
    // the tags are photographed on this exact cream, so they sit on the page itself
    { type: 'stage', media: M.tags, tone: '#FEF3E2', size: 'l', place: 'center', seamless: true, label: 'Swing tags' },
    {
      type: 'bloom',
      label: 'Pattern',
      labelAr: 'النمط',
      plates: [
        { field: '#73A2AC', ink: '#FFF0DA' },
        { field: '#FFF0DA', ink: '#BC8F8F' },
      ],
    },
    { type: 'layered', items: [M.totePortrait, M.bags, M.boxes], tone: '#73A2AC' },
    {
      type: 'sequence',
      label: 'Applications',
      labelAr: 'التطبيقات',
      items: [M.app, M.pattern, M.tote],
    },
    { type: 'stage', media: M.badges, tone: 'surface', size: 's', place: 'center' },
    { type: 'stage', media: M.box, tone: '#EEEBE5', size: 'l', place: 'center', seamless: true, label: 'Packaging' },
  ],
  blocks: { bloom: BloomBlock },
  caseStudy: null,
};
