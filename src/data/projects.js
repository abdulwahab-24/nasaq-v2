/*
 * NASAQ project data — the single source for every project on the site.
 *
 * Adding a project
 *   1. Put the originals in brand/work/<folder>, add art-directed derivatives to
 *      scripts/build-media.mjs and run `node scripts/build-media.mjs work/<slug>`.
 *   2. Add an entry below. Homepage chapters, index, project page and
 *      next-project links all read from this array — no component changes.
 *
 * Rules
 *   - Never invent client facts. Unknown fields stay `null` / [] and are not
 *     rendered. Written content below is taken from the supplied identity files.
 *   - `theme` colours belong to the project and are used only inside that
 *     project's frames (colour fields, swatches, its own titles).
 *
 * Fields
 *   slug, name, nameAr, category, year, location, tagline, description,
 *   overview, services[], featured, order,
 *   theme   { mode: 'dark' | 'light', surface, accent, ink }
 *           surface = the project's own field colour, ink = text on that field
 *   hero    { layout: 'bleed' | 'split' | 'plate', media }
 *   home    { layout: 'cinema' | 'spread' | 'type' | 'mosaic', cover?, details[], flip[]? }
 *   logo, cover, video, identity { colours[], typefaces[] }, story[], caseStudy
 *   logo       the cleanest logo file there is; it leads the index preview and
 *              the logo blocks. { mask: true } = a flat shape painted in theme.ink.
 *   logoField  colour the logo sits on when the surface would not carry it
 *   page       optional — key of a bespoke page design (pages/Project.jsx → CUSTOM_PAGES).
 *              Such a project carries its `copy` and `media` here and needs no story.
 *   signature  optional — one behaviour built from the project's own artwork
 *              (components/Signature.jsx): 'spear' | 'bloom' | 'strata' | 'arcade'.
 *              Its files live in `sig`; theme.gradient / theme.shape feed it.
 *              Projects without one use the plain layouts.
 *
 * Story blocks (rendered by pages/Project.jsx)
 *   bleed     { media }                          viewport-wide moment (blur-extended if small)
 *   stage     { media, tone, size, place, label } one image on a colour field, lots of air
 *   detail    { media, label, labelAr?, context? } oversized crop + its context
 *   layered   { items: [base, a, b?], tone }     controlled overlap
 *   sequence  { items, label }                    horizontal run (pinned on desktop)
 *   pair      { items: [a, b], ratio?, offset? }
 *   type      { media, family, tone }             typeface moment
 *   logo      { variant: 'dark' | 'light', tone? } official logo files on a field
 *   palette, words { words[], label, labelAr }
 *   stage + seamless: true                       tone = the photograph's own backdrop, so
 *                                                the object sits directly on the page
 *   aperture  { media, label }                   (spear) the mark opens onto the image
 *   bloom     { plates: [{ field, ink }] }       (bloom) the pattern, rebuilt from the mark
 *   ticker    {}                                 (arcade) the slogan strip
 *
 *   tone: 'surface' | 'accent' | 'ink' | 'page' | any hex from the project palette
 */
import { asset, img, withMobile } from '../utils/media';

const rumh = (key, alt, extra) => img(`work/rumh/${key}`, alt, extra);
const louiza = (key, alt, extra) => img(`work/louiza/${key}`, alt, extra);
const rukaz = (key, alt, extra) => img(`work/rukaz/${key}`, alt, extra);
const snack = (key, alt, extra) => img(`work/snack-quest/${key}`, alt, extra);

/* ---------- Rumh ---------- */
const R = {
  cover: withMobile(
    rumh('cover', 'The Rumh spearhead mark debossed into navy leather', { position: '46% 50%' }),
    rumh('cover-m', 'The Rumh spearhead mark debossed into navy leather'),
  ),
  spear: rumh('spear', 'A steel spearhead resting on dark stone — Rumh art direction'),
  concept: rumh('concept', 'Rumh concept: quiet strength, focus and precision, drawn as converging red planes'),
  elements: rumh('elements', 'Rumh graphic elements: the flag and the asterisk, solid and outlined'),
  patternStrip: rumh('pattern-strip', 'The Rumh asterisk pattern in red and navy on white'),
  logoForms: rumh('logo-forms', 'Four arrangements of the Rumh logo on navy'),
  digital: rumh('digital', 'Rumh profile on a phone over a red-to-navy gradient', { position: '20% 50%' }),
  screen: rumh('screen', 'Rumh identity projected on a cinema screen'),
  signage: rumh('signage', 'Rumh wayfinding sign for gates 21–54 beside the pattern'),
  signageDetail: rumh('signage-d', 'Detail of the Rumh gate sign: the mark folded around the corner'),
  keyring: rumh('keyring', 'Two Rumh leather key rings'),
  interior: rumh('interior', 'The Rumh mark painted large on a meeting-room wall'),
  badges: rumh('badges', 'White and navy Rumh pin badges on the red pattern'),
  badgesDetail: rumh('badges-d', 'Rumh pin badges on the red pattern'),
  card: rumh('card', 'A Rumh business card resting on navy cloth'),
};

/* ---------- Louiza ---------- */
const L = {
  cover: louiza('cover', 'Louiza shopping bag with the leaf mark and Arabic wordmark'),
  coverPortrait: louiza('cover-p', 'Louiza shopping bag with the leaf mark and Arabic wordmark'),
  construction: louiza('construction', 'Louiza logo construction grid on Pacific Blue'),
  mark: louiza('mark', 'The Louiza leaf mark in rose and blue'),
  pattern: louiza('pattern', 'Louiza logo over its repeating leaf pattern in rose'),
  type: louiza('type', 'Louiza Arabic typography: روح عصرية، أناقة، عربي، جمال التفاصيل'),
  badges: louiza('badges', 'Four Louiza roundels in the brand palette'),
  hoodie: louiza('hoodie', 'Rose hoodie with a Louiza woven label at the neck'),
  label: louiza('label', 'Close-up of the Louiza woven label: leaf mark, sizes, “Made with love”'),
  tote: louiza('tote', 'Canvas tote bag printed with the Louiza logo'),
  totePortrait: louiza('tote-p', 'Canvas tote bag printed with the Louiza logo'),
  boxes: louiza('boxes', 'Two Louiza sliding gift boxes'),
  app: louiza('app', 'The Louiza app icon on a phone home screen', { position: '30% 50%' }),
  tags: louiza('tags', 'Three Louiza swing tags with size grids'),
  bags: louiza('bags', 'Rose and cream Louiza paper bags'),
  box: louiza('box', 'An open Louiza box lined with the leaf pattern'),
};

/* ---------- Rukaz ---------- */
const K = {
  // the mug on its rock, whole; narrow screens get a tighter crop of the same photograph
  cover: withMobile(
    rukaz('cover', 'Rukaz enamel mug with the bilingual wordmark, standing on a rock'),
    rukaz('cover-m', 'Rukaz enamel mug with the bilingual wordmark, standing on a rock'),
  ),
  coverPortrait: rukaz('cover-p', 'Rukaz enamel mug with the bilingual wordmark on a rock'),
  lighters: rukaz('lighters', 'Three Rukaz lighters with the wordmark and pattern'),
  tote: rukaz('tote', 'Canvas tote with the Rukaz pattern, lying on rock'),
  mountain: rukaz('mountain', 'A timber cabin on a green mountainside, from the Rukaz colour page'),
};

// The applications collage, tile by tile (scripts/build-media.mjs → RUKAZ_APPS).
const rukazApp = (key, name, alt) => ({ ...rukaz(`apps/${key}`, alt), name });
K.apps = [
  rukazApp('mug', 'Enamel mug', 'Rukaz enamel mug on a rock'),
  rukazApp('backpack', 'Backpack', 'Green Rukaz backpack with the symbol'),
  rukazApp('bottles', 'Bottles', 'Two Rukaz bottles in teal and blue'),
  rukazApp('carabiner', 'Key strap & carabiner', 'Rukaz key strap and carabiner'),
  rukazApp('lighters', 'Lighters', 'Three Rukaz lighters'),
  rukazApp('tote-pattern', 'Tote — pattern', 'Canvas tote printed with the Rukaz pattern'),
  rukazApp('tote-logo', 'Tote — wordmark', 'Canvas tote printed with the Rukaz wordmark'),
  rukazApp('sling-bag', 'Sling bag', 'Blue Rukaz bag with the symbol stitched in'),
  rukazApp('tote-green', 'Tote — symbol', 'Green tote with the Rukaz symbol and wordmark'),
  rukazApp('bottle-steel', 'Steel bottles', 'Rukaz bottles in green and cream'),
  rukazApp('cap-teal', 'Cap — teal', 'Teal Rukaz cap'),
  rukazApp('cap-green', 'Cap — olive', 'Olive Rukaz cap'),
  rukazApp('duffel', 'Duffel', 'Green Rukaz duffel bag'),
  rukazApp('logo-textile', 'Embroidered logo', 'The Rukaz logo embroidered on canvas'),
];

/* ---------- Snack Quest ---------- */
const S = {
  cover: snack('cover', 'Snack Quest packaging, bag and fried chicken on cream'),
  interior: snack('interior', 'Snack Quest restaurant wall in red with the circular slogan'),
  products: withMobile(
    snack('products', 'Snack Quest bag, burger boxes and fried chicken trays'),
    snack('products-m', 'Snack Quest bag and burger boxes'),
  ),
  monogram: snack('monogram', 'The SQ monogram in five colourways'),
  type: snack('type', 'Pixelify Sans specimen inside the circular Snack Quest slogan'),
  colour: snack('colour', 'Snack Quest colours drawn as pixel-art shapes'),
  palette: snack('palette', 'Snack Quest colour bars: cream, purple, red, orange, green'),
  wallA: snack('wall-a', 'Snack Quest dining-room wall with a pixel burger'),
  wallB: snack('wall-b', 'Snack Quest dining room with the wall graphic and tables'),
  poster: snack('poster', 'Snack Quest burger poster in a restaurant'),
  fries: snack('fries', 'Snack Quest fries and dip packaging'),
  applications: snack('applications', 'Overview of Snack Quest packaging: fries, ice cream, chicken, burger boxes'),
};

export const projects = [
  {
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
    cover: R.cover,
    hero: { layout: 'bleed', media: R.cover },
    video: null,
    identity: {
      colours: [
        { name: 'Navy', hex: '#111F35' },
        { name: 'Red', hex: '#FF3C55' },
        { name: 'White', hex: '#FFFFFF' },
      ],
      typefaces: ['Metropolis', 'Nassim Arabic Pro'],
    },
    home: { layout: 'cinema', details: [R.signageDetail, R.spear] },
    story: [
      { type: 'logo', variant: 'dark' },
      {
        type: 'words',
        // brand-personality page of the guidelines (سمات شخصية العلامة)
        words: ['حازمة', 'واثقة', 'دقيقة', 'مُنطلِقة', 'مباشرة', 'منضبطة'],
        label: 'Brand traits',
        labelAr: 'سمات شخصية العلامة',
      },
      { type: 'bleed', media: R.concept },
      {
        type: 'detail',
        media: R.patternStrip,
        label: 'Pattern',
        labelAr: 'النمط',
        context: R.elements,
        contextLabel: 'Graphic elements',
      },
      { type: 'palette' },
      { type: 'aperture', media: R.spear, label: 'Art direction' },
      { type: 'layered', items: [R.screen, R.badgesDetail, R.keyring], tone: 'surface' },
      { type: 'bleed', media: R.card },
      { type: 'logo', variant: 'light' },
      {
        type: 'sequence',
        label: 'Applications',
        labelAr: 'التطبيقات',
        items: [R.signage, R.interior, R.digital, R.logoForms, R.badges],
      },
    ],
    caseStudy: null,
  },
  {
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
    cover: L.cover,
    hero: { layout: 'split', media: L.coverPortrait },
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
      cover: L.coverPortrait,
      details: [L.label, L.totePortrait],
      bloom: { field: '#73A2AC', ink: '#FFF0DA' },
    },
    story: [
      { type: 'logo', variant: 'dark', tone: '#BC8F8F' },
      { type: 'pair', items: [L.mark, L.construction], ratio: 'wide-left' },
      { type: 'stage', media: L.type, tone: 'page', size: 'l', place: 'center', label: 'Typography' },
      { type: 'palette' },
      {
        type: 'detail',
        media: L.label,
        label: 'Woven label',
        labelAr: 'الملصق',
        context: L.hoodie,
        contextLabel: 'Apparel',
      },
      // the tags are photographed on this exact cream, so they sit on the page itself
      { type: 'stage', media: L.tags, tone: '#FEF3E2', size: 'l', place: 'center', seamless: true, label: 'Swing tags' },
      {
        type: 'bloom',
        label: 'Pattern',
        labelAr: 'النمط',
        plates: [
          { field: '#73A2AC', ink: '#FFF0DA' },
          { field: '#FFF0DA', ink: '#BC8F8F' },
        ],
      },
      { type: 'layered', items: [L.totePortrait, L.bags, L.boxes], tone: '#73A2AC' },
      {
        type: 'sequence',
        label: 'Applications',
        labelAr: 'التطبيقات',
        items: [L.app, L.pattern, L.tote],
      },
      { type: 'stage', media: L.badges, tone: 'surface', size: 's', place: 'center' },
      { type: 'stage', media: L.box, tone: '#EEEBE5', size: 'l', place: 'center', seamless: true, label: 'Packaging' },
    ],
    caseStudy: null,
  },
  {
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
    // This project has its own page design (pages/projects/RukazPage.jsx);
    // everything it shows still comes from this entry.
    page: 'rukaz',
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
    cover: K.cover,
    hero: { layout: 'bleed', media: K.cover },
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
    media: { tote: K.tote, mountain: K.mountain, lighters: K.lighters, apps: K.apps },
    home: { layout: 'type', cover: K.coverPortrait, details: [K.lighters] },
    story: [],
    caseStudy: null,
  },
  {
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
    theme: { mode: 'dark', surface: '#4D3468', accent: '#FF9C00', ink: '#F4E8C6' },
    sig: {
      // the slogan strip, spelled as it is in the identity
      ticker: asset('work/snack-quest/ticker', 'Snack accepted — hunger defeted!', 'webp'),
    },
    cover: S.cover,
    logo: asset('work/snack-quest/logo', 'The Snack Quest logo', 'webp'),
    // the logo itself stands where the name would; the packaging sits below it
    hero: { layout: 'plate', media: S.products, mark: true },
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
      details: [S.poster, S.monogram],
      flip: [S.poster, S.type, S.colour, S.fries],
    },
    story: [
      { type: 'logo', variant: 'dark' },
      {
        type: 'detail',
        media: S.monogram,
        label: 'Monogram',
        labelAr: 'الرمز',
        context: S.palette,
        contextLabel: 'Colour',
      },
      { type: 'layered', items: [S.poster, S.fries, S.colour], tone: '#FF9C00' },
      { type: 'type', media: S.type, family: 'Pixelify Sans', tone: '#BA3F3F' },
      { type: 'palette' },
      { type: 'bleed', media: S.interior },
      { type: 'pair', items: [S.wallA, S.wallB], ratio: 'equal', offset: true },
      { type: 'stage', media: S.applications, tone: '#F4E8C6', size: 's', place: 'start', label: 'Packaging' },
      { type: 'ticker' },
    ],
    caseStudy: null,
  },
];

const byOrder = (a, b) => a.order - b.order;

export const allProjects = [...projects].sort(byOrder);
export const featuredProjects = allProjects.filter((p) => p.featured);

export const getProject = (slug) => allProjects.find((p) => p.slug === slug);

export function getNextProject(slug) {
  const i = allProjects.findIndex((p) => p.slug === slug);
  return allProjects[(i + 1) % allProjects.length];
}

export const projectPath = (project) => `/work/${project.slug}`;
