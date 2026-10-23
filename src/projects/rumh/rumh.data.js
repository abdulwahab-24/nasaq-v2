/*
 * Rumh — رمح. Content, media and case-study composition.
 * Uses the shared project page; its `story` below is the page, top to bottom.
 * Own code: components/Aperture.jsx (story block) · styles: rumh.css.
 * Sources: brand/work/rumh (identity guideline exports + one photograph).
 * Web images: public/work/rumh, built by scripts/build-media.mjs.
 */
import { asset, img, withMobile } from '../../utils/media';
import Aperture from './components/Aperture';

const media = (key, alt, extra) => img(`work/rumh/${key}`, alt, extra);

const M = {
  cover: withMobile(
    media('cover', 'The Rumh spearhead mark debossed into navy leather', { position: '46% 50%' }),
    media('cover-m', 'The Rumh spearhead mark debossed into navy leather'),
  ),
  spear: media('spear', 'A steel spearhead resting on dark stone — Rumh art direction'),
  concept: media('concept', 'Rumh concept: quiet strength, focus and precision, drawn as converging red planes'),
  elements: media('elements', 'Rumh graphic elements: the flag and the asterisk, solid and outlined'),
  patternStrip: media('pattern-strip', 'The Rumh asterisk pattern in red and navy on white'),
  logoForms: media('logo-forms', 'Four arrangements of the Rumh logo on navy'),
  digital: media('digital', 'Rumh profile on a phone over a red-to-navy gradient', { position: '20% 50%' }),
  screen: media('screen', 'Rumh identity projected on a cinema screen'),
  signage: media('signage', 'Rumh wayfinding sign for gates 21–54 beside the pattern'),
  signageDetail: media('signage-d', 'Detail of the Rumh gate sign: the mark folded around the corner'),
  keyring: media('keyring', 'Two Rumh leather key rings'),
  interior: media('interior', 'The Rumh mark painted large on a meeting-room wall'),
  badges: media('badges', 'White and navy Rumh pin badges on the red pattern'),
  badgesDetail: media('badges-d', 'Rumh pin badges on the red pattern'),
  card: media('card', 'A Rumh business card resting on navy cloth'),
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
  cover: M.cover,
  hero: { layout: 'bleed', media: M.cover },
  video: null,
  identity: {
    colours: [
      { name: 'Navy', hex: '#111F35' },
      { name: 'Red', hex: '#FF3C55' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    typefaces: ['Metropolis', 'Nassim Arabic Pro'],
  },
  home: { layout: 'cinema', details: [M.signageDetail, M.spear] },
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
  story: [
    { type: 'logo', variant: 'dark' },
    {
      type: 'words',
      // brand-personality page of the guidelines (سمات شخصية العلامة)
      words: ['حازمة', 'واثقة', 'دقيقة', 'مُنطلِقة', 'مباشرة', 'منضبطة'],
      label: 'Brand traits',
      labelAr: 'سمات شخصية العلامة',
    },
    { type: 'bleed', media: M.concept },
    {
      type: 'detail',
      media: M.patternStrip,
      label: 'Pattern',
      labelAr: 'النمط',
      context: M.elements,
      contextLabel: 'Graphic elements',
    },
    { type: 'palette' },
    { type: 'aperture', media: M.spear, label: 'Art direction' },
    { type: 'layered', items: [M.screen, M.badgesDetail, M.keyring], tone: 'surface' },
    { type: 'bleed', media: M.card },
    { type: 'logo', variant: 'light' },
    {
      type: 'sequence',
      label: 'Applications',
      labelAr: 'التطبيقات',
      items: [M.signage, M.interior, M.digital, M.logoForms, M.badges],
    },
  ],
  // story blocks only Rumh uses (rendered by components/projects/story/ProjectStory.jsx)
  blocks: { aperture: Aperture },
  caseStudy: null,
};
