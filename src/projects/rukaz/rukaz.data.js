/*
 * Rukaz — ركاز. Content, media and identity data.
 * Rukaz has its own page (RukazPage.jsx + rukaz.css in this folder), so it
 * carries the `copy` and `media` that page renders instead of a `story`.
 * Own code: components/PatternBand.jsx (the travelling pattern, homepage slot).
 * Sources: brand/work/rukaz (identity screenshots; extracted/ holds the
 * lossless application tiles cut from the collage).
 * Web images: public/work/rukaz, built by scripts/build-media.mjs.
 */
import { asset, img, withMobile } from '../../utils/media';
import { ChapterBand } from './components/PatternBand';
import RukazPage from './RukazPage';

const media = (key, alt, extra) => img(`work/rukaz/${key}`, alt, extra);

const M = {
  // the mug on its rock, whole; narrow screens get a tighter crop of the same photograph.
  // When the transparent mug + rock file is supplied, use it here; the hero frame takes it as is.
  cover: withMobile(
    media('cover', 'Rukaz enamel mug with the bilingual wordmark, standing on a rock'),
    media('cover-m', 'Rukaz enamel mug with the bilingual wordmark, standing on a rock'),
  ),
  coverPortrait: media('cover-p', 'Rukaz enamel mug with the bilingual wordmark on a rock'),
  lighters: media('lighters', 'Three Rukaz lighters with the wordmark and pattern'),
  tote: media('tote', 'Canvas tote with the Rukaz pattern, lying on rock'),
  mountain: media('mountain', 'A timber cabin on a green mountainside, from the Rukaz colour page'),
};

// The applications collage, tile by tile (scripts/build-media.mjs → RUKAZ_APPS).
const app = (key, name, alt) => ({ ...media(`apps/${key}`, alt), name });
const apps = [
  app('mug', 'Enamel mug', 'Rukaz enamel mug on a rock'),
  app('backpack', 'Backpack', 'Green Rukaz backpack with the symbol'),
  app('bottles', 'Bottles', 'Two Rukaz bottles in teal and blue'),
  app('carabiner', 'Key strap & carabiner', 'Rukaz key strap and carabiner'),
  app('lighters', 'Lighters', 'Three Rukaz lighters'),
  app('tote-pattern', 'Tote — pattern', 'Canvas tote printed with the Rukaz pattern'),
  app('tote-logo', 'Tote — wordmark', 'Canvas tote printed with the Rukaz wordmark'),
  app('sling-bag', 'Sling bag', 'Blue Rukaz bag with the symbol stitched in'),
  app('tote-green', 'Tote — symbol', 'Green tote with the Rukaz symbol and wordmark'),
  app('bottle-steel', 'Steel bottles', 'Rukaz bottles in green and cream'),
  app('cap-teal', 'Cap — teal', 'Teal Rukaz cap'),
  app('cap-green', 'Cap — olive', 'Olive Rukaz cap'),
  app('duffel', 'Duffel', 'Green Rukaz duffel bag'),
  app('logo-textile', 'Embroidered logo', 'The Rukaz logo embroidered on canvas'),
];

export default {
  slug: 'rukaz',
  name: 'Rukaz',
  nameAr: 'ركاز',
  category: 'Visual Identity',
  year: null,
  location: null,
  tagline: null,
  description: null,
  overview: null,
  services: [],
  featured: true,
  order: 3,
  page: RukazPage,
  // lifted from the logo page as a flat shape, painted in the project's stone
  logo: { ...asset('work/rukaz/logo-mask', 'The Rukaz logo: symbol with Arabic and Latin wordmark'), mask: true },
  signature: 'strata',
  theme: {
    mode: 'dark',
    surface: '#1F3D3B',
    accent: '#CFCBBA',
    ink: '#CFCBBA',
    // the identity's field: blue light and green over deep teal
    gradient:
      'radial-gradient(70% 38% at 0% 34%, rgb(92 145 164 / 0.5), transparent 62%), radial-gradient(80% 46% at 100% 50%, rgb(73 91 41 / 0.9), transparent 66%), #1F3D3B',
  },
  sig: {
    pattern: asset('work/rukaz/pattern-tile', ''),
    typeSpecimen: asset('work/rukaz/type-mask', 'Sheershak Arabic specimen: Aa and the alphabet'),
  },
  cover: M.cover,
  hero: { layout: 'bleed', media: M.cover },
  video: null,
  identity: {
    // names are the meanings given on the identity's colour page
    colours: [
      { name: 'Sea', nameAr: 'البحر', hex: '#5C91A4' },
      { name: 'Mountains', nameAr: 'الجبال', hex: '#1F3D3B' },
      { name: 'Life', nameAr: 'الحياة', hex: '#495B29' },
      { name: 'Earth', nameAr: 'الأرض', hex: '#CFCBBA' },
    ],
    typefaces: ['Sheershak Arabic'],
  },
  // Copy from the supplied identity pages (Arabic as written; English is a translation).
  copy: {
    lineAr: 'وجهتك لعالم التخييم والمغامرة',
    line: 'Your destination for the world of camping and adventure.',
    introAr:
      'ركاز هو وجهتك لعالم التخييم والمغامرة. نقدم منتجات مختارة بعناية تجمع بين الجودة العملية والأناقة لتمنحك تجربة أصيلة في أحضان الطبيعة.',
    intro:
      'Rukaz is a destination for camping and adventure: carefully chosen products that pair practical quality with elegance, for an authentic experience in the heart of nature.',
    patternAr:
      'تم تطوير نمط ركاز استنادًا إلى عنصر الشعار الهندسي ليعبر عن الثبات، التكرار والاتصال بالطبيعة.',
    pattern:
      'The pattern grows out of the logo’s geometric element — steadiness, repetition and a connection to nature.',
    coloursAr: 'ألوان ركاز مستوحاة من عناصر الطبيعة المحيطة بنا.',
    colours: 'The colours are drawn from the nature around us.',
    closingAr: 'كل مغامرة تبدأ بالثبات والاستعداد.',
    closing: 'Every adventure begins with steadiness and readiness.',
  },
  media: { tote: M.tote, mountain: M.mountain, lighters: M.lighters, apps },
  home: { layout: 'type', cover: M.coverPortrait, details: [M.lighters], slots: { type: ChapterBand } },
  caseStudy: null,
};
