/*
 * NASAQ project registry — the single source for every project on the site.
 * Each project lives in its own folder beside this file:
 *
 *   projects/<slug>/<slug>.data.js   content, media, composition (required)
 *   projects/<slug>/<slug>.css       styles only this project uses (imported in main.jsx)
 *   projects/<slug>/components/      components only this project uses
 *   projects/<slug>/<Name>Page.jsx   a page of its own, when the shared one does not fit
 *
 * Register the data module in PROJECTS below. The homepage sequence, index,
 * footer, project pages (/work/:slug) and next-project links all read from here —
 * no shared component changes per project.
 *
 * Rules
 *   - Never invent client facts. Unknown fields stay `null` / [] and are not
 *     rendered. Written content is taken from the supplied identity files.
 *   - `theme` colours belong to the project and are used only inside that
 *     project's frames (colour fields, swatches, its own titles).
 *
 * Fields
 *   slug        URL segment (/work/<slug>); unique, never reused
 *   name, nameAr, category, year, location, tagline, description, overview
 *   services[]  services actually delivered (empty until confirmed)
 *   featured    true → gets a scene in the Selected Work sequence (all projects are in the index)
 *   order       position across the site (1, 2, 3 …)
 *   theme       { mode: 'dark' | 'light', surface, accent, ink, gradient?, shape? }
 *               surface = the project's own field colour, ink = text on that field
 *   cover       main image (media descriptor from utils/media.js)
 *   hero        { layout: 'bleed' | 'split' | 'plate', media, mark? }
 *   home        { field, ink, logo?, sequence?, cover? } — the project's scene in Selected Work.
 *               field, ink: its colours there.
 *               logo: { dir, manifest, paint } — the logo split into parts
 *               (public/work/<slug>/parts/, manifest = projects/<slug>/logo-parts.json, both
 *               written by scripts/logo-motion/export-parts.mjs); paint: { default, [part or
 *               prefix]: colour } (components/projects/LogoParts.jsx).
 *               sequence: its choreography, projects/<slug>/<slug>.sequence.js (step API in
 *               sections/SelectedWork/sequence.js); without it, the fallback.
 *               cover: the next-project teaser image (defaults to `cover`).
 *   logo        the cleanest logo file there is; it leads the index preview and
 *               the logo blocks. { mask: true } = a flat shape painted in theme.ink.
 *   logoDark    logo version for light fields (optional)
 *   logoField   colour the logo sits on when the surface would not carry it
 *   identity    { colours: [{ name, nameAr?, hex }], typefaces: [] }
 *   motionLogo  optional — the logo film, logoMotion(slug, { width, height, field, alt }) from
 *               utils/media.js: public/work/<slug>/video/logo-motion.{webm,mp4} + poster, rendered
 *               by scripts/logo-motion/. Shown as the `motion` block.
 *   video       reserved (null). Project film is placed in the page as a `video`
 *               story block, below.
 *   story[]     the project page, composed from blocks (see below)
 *   blocks      optional — story blocks only this project uses, { type: Component },
 *               from its own components/ folder; they extend the shared set below
 *   anatomy[]   optional — parts shown in the homepage Anatomy section
 *   page        optional — the project's own page component (projects/<slug>/<Name>Page.jsx),
 *               rendered instead of hero → facts → story; it receives { project }.
 *               Such a project carries its `copy` and `media` and needs no story.
 *   signature   optional — name of the behaviour built from the project's own artwork
 *               ('spear' | 'bloom' | 'strata' | 'arcade' | 'facet'); adds the class `*--sig-<name>`
 *               to its page and next-project teaser for its stylesheet to target.
 *               Its files live in `sig`; theme.gradient / theme.shape feed it.
 *   motion      optional — 'steps': reveals and image openings advance in discrete steps
 *   caseStudy   reserved for written case-study content (null until supplied)
 *
 * Story blocks (components/projects/story/)
 *   bleed     { media }                          viewport-wide moment (blur-extended if small)
 *   video     { sources: [{ src, type }], poster, label }   viewport-wide project film
 *                                                (files in public/work/<slug>/video/)
 *   stage     { media, tone, size, place, label } one image on a colour field, lots of air
 *             + seamless: true                   tone = the photograph's own backdrop, so
 *                                                the object sits directly on the page
 *   detail    { media, label, labelAr?, context?, contextLabel? } oversized crop + its context
 *   layered   { items: [base, a, b?], tone }     controlled overlap
 *   sequence  { items, label, labelAr? }         horizontal run (pinned on desktop)
 *   pair      { items: [a, b], ratio?, offset? }
 *   type      { media, family, tone }             typeface moment
 *   logo      { variant: 'dark' | 'light', tone? } official logo files on a field
 *   motion    { label }                          the logo film (motionLogo) on its own field
 *   palette   {}                                 identity colours + typefaces
 *   words     { words[], label, labelAr }
 *
 * Project-owned blocks: registered through the project's `blocks`. (The six current
 * projects all have their own pages, so none uses the story; it is the starting point
 * for a new project until that project's own page is designed.)
 *
 *   tone: 'surface' | 'accent' | 'ink' | 'page' | any hex from the project palette
 */
import datoura from './datoura/datoura.data';
import louiza from './louiza/louiza.data';
import nurba from './nurba/nurba.data';
import rukaz from './rukaz/rukaz.data';
import rumh from './rumh/rumh.data';
import snackQuest from './snack-quest/snack-quest.data';

// Registered projects. A project module that is not listed here is not published.
const PROJECTS = [rumh, louiza, datoura, nurba, rukaz, snackQuest];

if (import.meta.env.DEV) {
  const seen = new Set();
  for (const p of PROJECTS) {
    if (seen.has(p.slug)) throw new Error(`Duplicate project slug "${p.slug}"`);
    seen.add(p.slug);
    for (const field of ['slug', 'name', 'category', 'cover', 'theme']) {
      if (!p[field]) throw new Error(`Project "${p.slug ?? p.name}" is missing "${field}"`);
    }
    if (!p.page && !(p.hero && p.story)) {
      throw new Error(`Project "${p.slug}" needs a hero and a story (or its own page)`);
    }
  }
}

const byOrder = (a, b) => a.order - b.order;

export const allProjects = [...PROJECTS].sort(byOrder);
export const featuredProjects = allProjects.filter((p) => p.featured);

export const getProject = (slug) => allProjects.find((p) => p.slug === slug);

export function getNextProject(slug) {
  const i = allProjects.findIndex((p) => p.slug === slug);
  return allProjects[(i + 1) % allProjects.length];
}

export const projectPath = (project) => `/work/${project.slug}`;
