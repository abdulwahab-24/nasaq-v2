/*
 * Snack Quest. Content, media and case-study composition.
 * Uses the shared project page; its `story` below is the page, top to bottom.
 * Own code: components/Ticker.jsx (slogan strip, story block, homepage slot) ·
 * styles: snack-quest.css (pixel-stepped frames, the ticker).
 * Sources: brand/work/snaok (presentation screenshots + logo/ folder).
 * Web images: public/work/snack-quest, built by scripts/build-media.mjs.
 */
import { asset, img, withMobile } from '../../utils/media';
import { ChapterTicker, TickerBlock } from './components/Ticker';

const media = (key, alt, extra) => img(`work/snack-quest/${key}`, alt, extra);

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
  order: 4,
  signature: 'arcade',
  motion: 'steps', // the identity moves in pixel steps: reveals and openings advance in steps
  theme: { mode: 'dark', surface: '#4D3468', accent: '#FF9C00', ink: '#F4E8C6' },
  sig: {
    // the slogan strip, spelled as it is in the identity
    ticker: asset('work/snack-quest/ticker', 'Snack accepted — hunger defeted!', 'webp'),
  },
  cover: M.cover,
  logo: asset('work/snack-quest/logo', 'The Snack Quest logo', 'webp'),
  // the logo itself stands where the name would; the packaging sits below it
  hero: { layout: 'plate', media: M.products, mark: true },
  video: null,
  identity: {
    colours: [
      { name: null, hex: '#4D3468' },
      { name: null, hex: '#BA3F3F' },
      { name: null, hex: '#8ACC66' },
      { name: null, hex: '#FF9C00' },
      { name: null, hex: '#F4E8C6' },
    ],
    typefaces: ['Pixelify Sans'],
  },
  home: {
    layout: 'mosaic',
    details: [M.poster, M.monogram],
    flip: [M.poster, M.type, M.colour, M.fries],
    slots: { floor: ChapterTicker },
  },
  story: [
    { type: 'logo', variant: 'dark' },
    {
      type: 'detail',
      media: M.monogram,
      label: 'Monogram',
      labelAr: 'الرمز',
      context: M.palette,
      contextLabel: 'Colour',
    },
    { type: 'layered', items: [M.poster, M.fries, M.colour], tone: '#FF9C00' },
    { type: 'type', media: M.type, family: 'Pixelify Sans', tone: '#BA3F3F' },
    { type: 'palette' },
    { type: 'bleed', media: M.interior },
    { type: 'pair', items: [M.wallA, M.wallB], ratio: 'equal', offset: true },
    { type: 'stage', media: M.applications, tone: '#F4E8C6', size: 's', place: 'start', label: 'Packaging' },
    { type: 'ticker' },
  ],
  blocks: { ticker: TickerBlock },
  caseStudy: null,
};
