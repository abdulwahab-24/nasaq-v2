/*
 * Site-wide NASAQ content and settings. Copy is the approved copy from CLAUDE.md.
 * Components read from here; nothing below should be repeated in a component.
 *
 * Exceptions that cannot import this module (keep them in step by hand):
 *   index.html   default <title>, meta description and the <noscript> contact line
 */
import { img } from '../utils/media';

export const site = {
  name: 'NASAQ',
  nameAr: 'نسق',
  title: 'NASAQ — نسق · Saudi brand identity studio',
  // appended to page titles: "<Project> — NASAQ نسق"
  titleSuffix: 'NASAQ نسق',
  description:
    'NASAQ is a Saudi brand identity studio creating distinctive identities, systems and experiences for brands ready for what’s next.',
  ogImage: '/og.jpg',
  location: 'Saudi Arabia',
  locationAr: 'المملكة العربية السعودية',
};

export const contact = {
  whatsapp: {
    label: '+90 535 673 14 62',
    url: 'https://wa.me/905356731462',
  },
  instagram: {
    handle: '@nasaqstudios',
    url: 'https://www.instagram.com/nasaqstudios/',
  },
};

// `to` = section id on the homepage
export const navigation = [
  { label: 'Work', to: 'work' },
  { label: 'Studio', to: 'studio' },
  { label: 'Services', to: 'services' },
  { label: 'Contact', to: 'contact' },
];

export const hero = {
  headlineAr: 'نصنع علامات لها نسق.',
  headlineArAccent: 'نسق',
  headlineEn: 'We build brands that belong together.',
  // art-directed line breaks of the two headlines above
  headlineArLines: ['نصنع', 'علامات', 'لها نسق.'],
  headlineEnLines: ['We build', 'brands that', 'belong', 'together.'],
  intro: site.description,
  primaryCta: 'View our work',
  secondaryCta: 'Start a project',
};

// The reel that opens Selected Work (files in public/video)
export const reel = {
  sources: [
    { src: '/video/reel.webm', type: 'video/webm' },
    { src: '/video/reel.mp4', type: 'video/mp4' },
  ],
  poster: '/video/reel-poster.webp',
  label: 'Reel of NASAQ identity work: Rumh, Louiza, Rukaz and Snack Quest',
};

export const sectionTitles = {
  work: { en: 'Selected Work', ar: 'أعمال مختارة' },
  index: { en: 'Index', ar: 'كل الأعمال' },
  services: { en: 'Services', ar: 'الخدمات' },
  studio: { en: 'Studio', ar: 'الاستوديو' },
};

export const home = {
  // project whose identity is dissected in the Anatomy section (needs `anatomy` parts)
  anatomyProject: 'rumh',
};

export const statement = [
  'We believe strong brands are not built from isolated pieces.',
  'Strategy, language, identity and experience should work as one system.',
  'That is where NASAQ begins.',
];

export const about = [
  'NASAQ is a Saudi branding studio focused on building identities that are clear, relevant and distinctive.',
  'We combine strategic thinking with visual craft to create brand systems that work across physical and digital experiences.',
];

// NASAQ's own identity in use, shown in the Studio section (public/studio)
export const studioMedia = {
  portrait: img('studio/portrait', 'Portrait in shadow, lit by a blue rim light — NASAQ identity photography'),
  billboard: img('studio/billboard', 'The NASAQ wordmark on a sign mounted to a steel frame'),
  badge: img('studio/badge', 'NASAQ identity badge with the slash pattern, on a blue lanyard'),
};

// The official palette as presented in the Studio section (CLAUDE.md §3)
export const brandColours = [
  { name: 'Deep Navy', hex: '#000628' },
  { name: 'Black', hex: '#000000' },
  { name: 'Primary Blue', hex: '#374EFF' },
  { name: 'Secondary Blue', hex: '#4860FF' },
  { name: 'Light Blue', hex: '#C9D4FF' },
  { name: 'Soft White', hex: '#F7F7F7' },
  { name: 'White', hex: '#FFFFFF' },
];

export const services = [
  { en: 'Brand Strategy', ar: 'استراتيجية العلامة' },
  { en: 'Brand Identity', ar: 'هوية العلامة' },
  { en: 'Art Direction', ar: 'التوجيه الفني' },
  { en: 'Brand Systems', ar: 'أنظمة العلامة' },
  { en: 'Digital Experience', ar: 'التجربة الرقمية' },
];

export const contactCopy = {
  headline: 'Let’s build what’s next.',
  // art-directed line breaks of the headline; the accent word is set in italic
  headlineLines: ['Let’s build', 'what’s next.'],
  headlineAccent: 'next.',
  body: ['Have a brand, idea or challenge worth shaping?', 'Let’s talk.'],
  cta: 'Start a project',
};

export const footer = {
  line: 'A Saudi brand identity studio.',
  whatsappCta: 'Start a project on WhatsApp',
  copyright: (year) => `© ${year} NASAQ. All rights reserved.`,
};

// Official NASAQ brand files used by the interface (public/brand)
export const brandAssets = {
  lockup: { src: '/brand/nasaq-lockup-white.png', width: 892, height: 317 },
  symbol: { src: '/brand/nasaq-symbol-white.png', width: 470, height: 470 },
};
