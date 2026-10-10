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
 *
 * Story blocks (rendered by pages/Project.jsx)
 *   bleed     { media }                          viewport-wide moment (blur-extended if small)
 *   stage     { media, tone, size, place, label } one image on a colour field, lots of air
 *   detail    { media, label, labelAr?, context? } oversized crop + its context
 *   layered   { items: [base, a, b?], tone }     controlled overlap
 *   sequence  { items, label }                    horizontal run (pinned on desktop)
 *   pair      { items: [a, b], ratio?, offset? }
 *   type      { media, family, tone }             typeface moment
 *   logo      { variant: 'dark' | 'light' }       official logo files on a field
 *   palette, words { words[], label, labelAr }
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
  traits: rumh('traits', 'Rumh brand traits set on the red spearhead flag'),
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
};

/* ---------- Louiza ---------- */
const L = {
  cover: louiza('cover', 'Louiza shopping bag with the leaf mark and Arabic wordmark'),
  coverPortrait: louiza('cover-p', 'Louiza shopping bag with the leaf mark and Arabic wordmark'),
  logo: louiza('logo', 'The Louiza logo — Arabic wordmark and leaf mark — on a soft gradient'),
  construction: louiza('construction', 'Louiza logo construction grid on Pacific Blue'),
  mark: louiza('mark', 'The Louiza leaf mark in rose and blue'),
  pattern: louiza('pattern', 'Louiza logo over its repeating leaf pattern in rose'),
  type: louiza('type', 'Louiza Arabic typography: روح عصرية، أناقة، عربي، جمال التفاصيل'),
  badges: louiza('badges', 'Four Louiza roundels in the brand palette'),
  patterns: louiza('patterns', 'Leaf patterns in blue and cream'),
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
  cover: rukaz('cover', 'Rukaz enamel mug with the bilingual wordmark on a rock'),
  coverPortrait: rukaz('cover-p', 'Rukaz enamel mug with the bilingual wordmark on a rock'),
  lighters: rukaz('lighters', 'Three Rukaz lighters with the wordmark and pattern'),
  logo: rukaz('logo', 'The Rukaz logo: symbol with Arabic and Latin wordmark'),
  type: withMobile(
    rukaz('type', 'Rukaz typography specimen'),
    rukaz('type-m', 'Rukaz typography specimen'),
  ),
  colour: rukaz('colour', 'Rukaz colours with their values set in the brand typeface'),
  tote: rukaz('tote', 'Canvas tote with the Rukaz pattern, on rock'),
  pattern: rukaz('pattern', 'The Rukaz geometric pattern'),
  applications: rukaz('applications', 'Overview of Rukaz applications: bags, bottles, caps, lighters, mug'),
};

/* ---------- Snack Quest ---------- */
const S = {
  cover: snack('cover', 'Snack Quest packaging, bag and fried chicken on cream'),
  interior: snack('interior', 'Snack Quest restaurant wall in red with the circular slogan'),
  logo: snack('logo', 'Snack Quest logo and SQ monogram in each brand colour'),
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
    theme: { mode: 'dark', surface: '#111F35', accent: '#FF3C55', ink: '#FFFFFF' },
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
      { type: 'layered', items: [R.screen, R.badgesDetail, R.keyring], tone: 'surface' },
      { type: 'stage', media: R.spear, tone: '#000000', size: 's', place: 'end', label: 'Art direction' },
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
    theme: { mode: 'light', surface: '#FFF0DA', accent: '#8E5E5E', ink: '#563E3E' },
    logo: null,
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
    home: { layout: 'spread', cover: L.coverPortrait, details: [L.label, L.totePortrait] },
    story: [
      { type: 'bleed', media: L.logo },
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
      { type: 'layered', items: [L.totePortrait, L.tags, L.box], tone: '#73A2AC' },
      { type: 'bleed', media: L.patterns },
      {
        type: 'sequence',
        label: 'Applications',
        labelAr: 'التطبيقات',
        items: [L.bags, L.boxes, L.app, L.pattern, L.tote],
      },
      { type: 'stage', media: L.badges, tone: 'surface', size: 's', place: 'center' },
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
    theme: { mode: 'dark', surface: '#1F3D3B', accent: '#CFCBBA', ink: '#CFCBBA' },
    logo: null,
    cover: K.cover,
    hero: { layout: 'plate', media: K.coverPortrait },
    video: null,
    identity: {
      colours: [
        { name: null, hex: '#1F3D3B' },
        { name: null, hex: '#495B29' },
        { name: null, hex: '#5C91A4' },
        { name: null, hex: '#CFCBBA' },
      ],
      typefaces: ['Sheershak Arabic'],
    },
    home: { layout: 'type', cover: K.coverPortrait, details: [K.lighters] },
    story: [
      { type: 'bleed', media: K.logo },
      { type: 'type', media: K.type, family: 'Sheershak Arabic', tone: 'surface' },
      {
        type: 'detail',
        media: K.lighters,
        label: 'Objects',
        labelAr: 'المنتجات',
        context: K.pattern,
        contextLabel: 'Pattern',
      },
      { type: 'palette' },
      { type: 'stage', media: K.colour, tone: '#495B29', size: 'm', place: 'start', label: 'Colour' },
      { type: 'layered', items: [K.tote, K.applications], tone: 'page' },
    ],
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
    theme: { mode: 'dark', surface: '#4D3468', accent: '#FF9C00', ink: '#F4E8C6' },
    logo: null,
    cover: S.cover,
    hero: { layout: 'plate', media: S.cover },
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
      { type: 'stage', media: S.logo, tone: 'surface', size: 'l', place: 'center' },
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
