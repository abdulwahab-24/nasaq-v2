/*
 * NASAQ project registry — the single source for every project on the site.
 * Each project lives in its own folder beside this file:
 *
 *   projects/<slug>/<slug>.data.js   content, media, composition (required)
 *   projects/<slug>/<slug>.css       styles only this project uses (imported in main.jsx)
 *   projects/<slug>/components/      components only this project uses
 *   projects/<slug>/<Name>Page.jsx   a page of its own, when the shared one does not fit
 *
 * Register the data module in PROJECTS below. The homepage chapters, index,
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
 *   featured    true → gets a chapter in Selected Work (all projects are in the index)
 *   order       position across the site (1, 2, 3 …)
 *   theme       { mode: 'dark' | 'light', surface, accent, ink, gradient?, shape? }
 *               surface = the project's own field colour, ink = text on that field
 *   cover       main image (media descriptor from utils/media.js)
 *   hero        { layout: 'bleed' | 'split' | 'plate', media, mark? }
 *   home        { layout: 'cinema' | 'spread' | 'type' | 'mosaic', cover?, details[], flip[]?, bloom?, slots? }
 *               without `layout` a project cycles through the four compositions.
 *               slots: the project's own art placed into the shared composition
 *               (sections/SelectedWork/Chapter.jsx), each a component receiving { project }:
 *                 spread  beside the cover in the spread composition
 *                 type    behind the cover in the type composition (replaces the Arabic name)
 *                 floor   a strip at the foot of the chapter
 *   logo        the cleanest logo file there is; it leads the index preview and
 *               the logo blocks. { mask: true } = a flat shape painted in theme.ink.
 *   logoDark    logo version for light fields (optional)
 *   logoField   colour the logo sits on when the surface would not carry it
 *   identity    { colours: [{ name, nameAr?, hex }], typefaces: [] }
 *   video       reserved (null). Project film is placed in the page as a `video`
 *               story block, below.
 *   story[]     the project page, composed from blocks (see below)
 *   blocks      optional — story blocks only this project uses, { type: Component },
 *               from its own components/ folder; they extend the shared set below
 *   anatomy[]   optional — parts shown in the homepage Anatomy section
 *   page        optional — the project's own page component (projects/<slug>/<Name>Page.jsx),
 *               rendered instead of hero → facts → story; it receives { project, index, total }.
 *               Such a project carries its `copy` and `media` and needs no story.
 *   signature   optional — name of the behaviour built from the project's own artwork
 *               ('spear' | 'bloom' | 'strata' | 'arcade'); adds the class `*--sig-<name>`
 *               to its chapter, page and next-project teaser for its stylesheet to target.
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
 *   palette   {}                                 identity colours + typefaces
 *   words     { words[], label, labelAr }
 *
 * Project-owned blocks (registered through the project's `blocks`)
 *   aperture  { media, label }                   Rumh — the mark opens onto the image
 *   bloom     { plates: [{ field, ink }] }       Louiza — the pattern, rebuilt from the mark
 *   ticker    {}                                 Snack Quest — the slogan strip
 *
 *   tone: 'surface' | 'accent' | 'ink' | 'page' | any hex from the project palette
 */
import louiza from './louiza/louiza.data';
import rukaz from './rukaz/rukaz.data';
import rumh from './rumh/rumh.data';
import snackQuest from './snack-quest/snack-quest.data';

// Registered projects. A project module that is not listed here is not published.
const PROJECTS = [rumh, louiza, rukaz, snackQuest];

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
