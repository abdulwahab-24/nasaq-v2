# NASAQ V2 Development Guide

## Project Overview

React 19 + Vite + GSAP (ScrollTrigger) + Lenis, plain CSS, React Router 7. No TypeScript,
no CSS framework, no state library. Content is static data:

- **NASAQ site content** (copy, navigation, contact, social, SEO defaults) → `src/data/siteConfig.js`.
- **Projects** → one folder per identity in `src/projects/<slug>/`, registered in `src/projects/index.js`.
- **NASAQ website presentation** → homepage sections in `src/sections/<Section>/`; shared case-study
  building blocks in `src/components/projects/`.

The rule for project code: **shared across projects → `src/components/projects/`; specific to one
project → `src/projects/<slug>/`.**

Brand rules and approved copy: `CLAUDE.md`. Short overview and launch notes: `README.md`.

## Directory Structure

```
src/
  main.jsx                 entry: router + every stylesheet, in cascade order
  App.jsx                  layout shell (nav, main, footer, intro, cursor) + routes
  projects/                ONE FOLDER PER NASAQ IDENTITY (see Project Structure)
    index.js               the project registry, schema reference, lookup helpers
    rumh/  louiza/  rukaz/  snack-quest/
  data/
    siteConfig.js          NASAQ site copy, navigation, contact, social, SEO defaults, studio media
    media.json             generated image manifest (written by scripts/build-media.mjs; never edit)
  pages/
    HomePage.jsx           homepage: section order + arriving-at-a-section scroll
    ProjectPage.jsx        /work/:slug — resolves the slug, renders the shared or the project's own page
    NotFoundPage.jsx       404 (+ not-found.css)
  sections/                NASAQ homepage sections — component + stylesheet (+ local motion)
    Hero/                  Hero.jsx, Opening.jsx, useOpeningMotion.js, hero.css, opening.css
    SelectedWork/          SelectedWork.jsx (colour takeover), Chapter.jsx (one project's
                           composition), WorkIndex.jsx (all projects list) + CSS
    Statement/  Anatomy/  Services/  Contact/
    Studio/                Studio.jsx, Construction.jsx, geometry.js, studioMotion.js, studio.css
  components/
    layout/                Navbar, Footer, Intro, Cursor, SmoothScroll, ScrollManager (+ CSS)
    ui/                    Arrow, NasaqMark, ResponsiveImage, LoopVideo, Flip, text-link.css
    projects/              shared case-study pieces: ProjectHero, ProjectIntro, NextProject,
                           ProjectLogo + project-hero/story/next/variants/logo.css
      story/               ProjectStory (block renderer), MediaBlocks, IdentityBlocks, Frame, fields.js
  transition/              TransitionProvider, TransitionLink, context.js, page-transition.css
  motion/                  gsap.js (plugin setup, media queries, intro gate), lenis.js (smooth scroll)
  hooks/                   useReveals, useMeta, useScrollState
  utils/                   media (image descriptors), scroll, shape (clip paths), colour, format
  styles/
    tokens.css             design tokens: palette, fonts, weights, type scale, spacing, z-layers, easing
    typography.css         @font-face + shared type utilities (.line, .label)
    global.css             reset, document defaults, focus, selection, accessibility helpers
scripts/build-media.mjs    exports responsive WebP, logos, masks and og.jpg from /brand into /public
public/                    fonts/, work/<slug>/, studio/, brand/, video/ (reel), icons, _redirects
brand/                     original brand files — source of truth, never overwritten by hand
```

## Project Structure

Every identity lives in `src/projects/<slug>/`. A folder holds only what that project actually
needs; there are no empty placeholder files.

```
src/projects/
  index.js                         registry: imports every <slug>.data.js
  rumh/
    rumh.data.js                   content, media, page composition (story)
    rumh.css                       spear signature: aperture block, traits on flags, next-project crop
    components/Aperture.jsx        story block: the spearhead opens onto the photograph (+ its GSAP)
  louiza/
    louiza.data.js
    louiza.css                     bloom signature: pattern plate on the homepage and the page
    components/Bloom.jsx           the leaf plate (+ its GSAP), its story block, its homepage slot
  rukaz/
    rukaz.data.js                  content, media, the copy its page renders
    RukazPage.jsx                  Rukaz's own page (+ its GSAP)
    rukaz.css                      the pattern band on the homepage + the whole Rukaz page
    components/PatternBand.jsx     the travelling pattern band (+ its GSAP), its homepage slot
  snack-quest/
    snack-quest.data.js
    snack-quest.css                arcade signature: pixel-stepped frames, the slogan ticker
    components/Ticker.jsx          the slogan strip, its story block, its homepage slot
```

Original media stay outside `src`: `brand/work/<folder>/` (originals) and `public/work/<slug>/`
(generated web images). The data module references them; see [Assets](#assets).

### How a project plugs into the shared site

A project's data record hands its own pieces to the shared renderers. Shared code never imports
from a project folder:

| Field in `<slug>.data.js` | Consumed by | Used for |
| --- | --- | --- |
| `story` | `components/projects/story/ProjectStory.jsx` | the shared project page, block by block |
| `blocks` | `ProjectStory.jsx` | story block types only this project has (`{ aperture: Aperture }`) |
| `page` | `pages/ProjectPage.jsx` | the project's own page component, instead of the shared one |
| `home.layout`, `home.slots` | `sections/SelectedWork/Chapter.jsx` | homepage composition, plus the project's own art in it |
| `signature` | Chapter, ProjectPage, NextProject | adds `*--sig-<name>` classes for the project's stylesheet |
| `motion: 'steps'` | Chapter, ProjectPage, ProjectHero, useReveals | reveals and openings advance in steps |
| `theme` | everywhere the project appears | the project's own colours (never NASAQ's) |

Project stylesheets are imported in `src/main.jsx`, after all shared stylesheets, so they can bend the
shared layouts around one identity.

### How to edit each project

**Rumh** — `src/projects/rumh/`
- Page/layout: shared page; its composition is `story` in `rumh.data.js` (hero: `hero`; homepage: `home`)
- Data/content: `rumh.data.js`
- Styles: `rumh.css`
- Motion: `components/Aperture.jsx` (the aperture scroll); everything else uses the shared motion
- Own components: `components/Aperture.jsx`
- Assets: originals `brand/work/rumh/`, web images `public/work/rumh/`
- Also: Rumh's `anatomy` parts feed the homepage Anatomy section (`home.anatomyProject` in `siteConfig.js`)

**Louiza** — `src/projects/louiza/`
- Page/layout: shared page; composition is `story` in `louiza.data.js`
- Data/content: `louiza.data.js`
- Styles: `louiza.css`
- Motion: `components/Bloom.jsx` (the leaves growing)
- Own components: `components/Bloom.jsx` (`Bloom`, `BloomBlock`, `ChapterBloom`)
- Assets: originals `brand/work/lew/`, web images `public/work/louiza/`

**Rukaz** — `src/projects/rukaz/`
- Page/layout: `RukazPage.jsx` (its own page)
- Data/content: `rukaz.data.js` (`copy`, `media`, `identity`, `logo`, `sig`)
- Styles: `rukaz.css`
- Motion: `RukazPage.jsx` (page entrance and scroll scenes), `components/PatternBand.jsx` (band travel)
- Own components: `components/PatternBand.jsx` (`PatternBand`, `ChapterBand`)
- Assets: originals `brand/work/rukaz/` (`extracted/` = application tiles), web images `public/work/rukaz/`

**Snack Quest** — `src/projects/snack-quest/`
- Page/layout: shared page; composition is `story` in `snack-quest.data.js`
- Data/content: `snack-quest.data.js`
- Styles: `snack-quest.css`
- Motion: stepped reveals via `motion: 'steps'` in the data; the ticker's stepping is CSS in `snack-quest.css`
- Own components: `components/Ticker.jsx` (`Ticker`, `TickerBlock`, `ChapterTicker`)
- Assets: originals `brand/work/snaok/`, web images `public/work/snack-quest/`

### Why Rukaz has its own page

Rukaz's page is composed from the identity itself: the logo set as type in slices of the supplied
artwork, the palette laid down as strata, the pattern travelling, the applications as a kit list.
That composition does not break into reusable story blocks without becoming unreadable. Everything
it shows still comes from `rukaz.data.js`, and the route, meta tags and next-project link stay shared.

## Quick Edit Map

| Change | Where |
| --- | --- |
| Global NASAQ colours | `src/styles/tokens.css` (`--color-*`; roles such as `--bg`/`--fg` below them, light-surface roles at the bottom). The palette *shown* in Studio is `brandColours` in `siteConfig.js`. |
| Official font setup | Files in `public/fonts`; `@font-face` in `src/styles/typography.css`; families and weights (`--font-*`, `--fw-*`) in `tokens.css`. Declare only weights that exist. |
| Spacing, widths, gutters, z-layers, easing | `src/styles/tokens.css` |
| Homepage section order | `src/pages/HomePage.jsx` |
| Hero | Copy: `hero` in `siteConfig.js`. Layout: `src/sections/Hero/Hero.jsx` + `hero.css`. Opening sequence: `Opening.jsx`, `opening.css`, `useOpeningMotion.js` |
| Selected Work | `src/sections/SelectedWork/` — `SelectedWork.jsx` (section + colour takeover), `Chapter.jsx` (the shared compositions), `WorkIndex.jsx` (index list) |
| Studio | Copy/media: `about`, `studioMedia`, `brandColours` in `siteConfig.js`. Layout: `src/sections/Studio/Studio.jsx` + `studio.css`; drawing: `Construction.jsx` + `geometry.js`; motion: `studioMotion.js` |
| Statement | Copy: `statement` in `siteConfig.js`. Layout + motion: `src/sections/Statement/` |
| Anatomy | Which project: `home.anatomyProject` in `siteConfig.js`; parts: that project's `anatomy`. Layout: `src/sections/Anatomy/` |
| Services | List: `services` in `siteConfig.js` (also feeds the footer and menu). Layout: `src/sections/Services/` |
| Contact | Copy: `contactCopy` in `siteConfig.js`. Layout: `src/sections/Contact/` |
| WhatsApp / Instagram | `contact` in `src/data/siteConfig.js` — the only place in the app. Also the `<noscript>` line in `index.html` (it cannot import JS). |
| Navigation | `navigation` in `siteConfig.js` (`to` = homepage section id). Markup: `components/layout/Navbar.jsx` |
| Footer | Content: `footer`, `navigation`, `services`, `contact` in `siteConfig.js`; projects come from the registry. Markup: `components/layout/Footer.jsx` |
| Page titles, description, share image | `site` in `siteConfig.js` (defaults also in `index.html`); per project: `ProjectPage.jsx` via `hooks/useMeta.js` |
| Edit a project | `src/projects/<slug>/` — see [How to edit each project](#how-to-edit-each-project) |
| A project's images | The `M` map at the top of `<slug>.data.js`; files come from `scripts/build-media.mjs` (see Assets) |
| A project's video | A `video` block in the project's `story` (see schema) |
| Add a new project | See [Adding a New Project](#adding-a-new-project) |
| Shared project page layout | Hero: `components/projects/ProjectHero.jsx` (`hero.layout`). Facts: `ProjectIntro.jsx`. Blocks: `components/projects/story/`. Shell: `pages/ProjectPage.jsx` |
| One project's page layout | Its `story` in `<slug>.data.js`, or its own `<Name>Page.jsx` (Rukaz) |
| One project's homepage chapter | `home` in `<slug>.data.js`; compositions in `sections/SelectedWork/Chapter.jsx` |
| Global page transitions | `src/transition/TransitionProvider.jsx` + `page-transition.css` |
| Scroll reveal / parallax | `src/hooks/useReveals.js` (`data-reveal`, `data-parallax`) |
| Project hero entrance | `components/projects/ProjectHero.jsx` |
| Motion breakpoints | `src/motion/gsap.js` (`STAGED`, `COMPACT`, `DESKTOP`, …) — keep in step with the CSS breakpoints listed in `tokens.css` |
| Mobile behaviour | The `@media` blocks inside each component's or project's own stylesheet; mobile image crops via `withMobile()` in project data; menu in `Navbar.jsx` + `navbar.css` |

Stylesheets are imported once, from `src/main.jsx`, in cascade order. A new stylesheet goes into
that list where its rules should win; project stylesheets go at the end.

## Adding a New Project

Hypothetical project "Example" (slug `example`, originals in `brand/work/example/`). Filenames are
placeholders for whatever is supplied.

1. **Assets** — copy the supplied files into `brand/work/example/`. In `scripts/build-media.mjs`,
   list the folder and add `MANIFEST` entries (`[key, source, crop?, options?]`; crop is
   `[x, y, w, h]` in source pixels):

   ```js
   const example = files('brand/work/example'); // sorted list of the folder's images

   // inside MANIFEST
   ['work/example/cover', example[0], undefined, BLUR],
   ['work/example/detail', example[1], [120, 80, 900, 600]],
   ['work/example/signage', example[2]],
   ```

   then run `node scripts/build-media.mjs work/example` (needs `sharp`, a devDependency). This writes
   `public/work/example/*.webp` and the entries in `src/data/media.json`.

2. **Folder + data** — create `src/projects/example/example.data.js`:

   ```js
   /*
    * Example. Content, media and case-study composition.
    * Sources: brand/work/example. Web images: public/work/example.
    */
   import { img } from '../../utils/media';

   const media = (key, alt, extra) => img(`work/example/${key}`, alt, extra);

   const M = {
     cover: media('cover', 'Describe what the cover shows'),
     detail: media('detail', 'Describe the detail'),
     signage: media('signage', 'Describe the signage'),
   };

   export default {
     slug: 'example',
     name: 'Example',
     nameAr: null,            // only if the identity has an Arabic name
     category: 'Visual Identity',
     year: null,              // unknown facts stay null — never invent them
     location: null,
     tagline: null,
     description: null,
     overview: null,
     services: [],
     featured: true,          // false → listed in the index only, no homepage chapter
     order: 5,
     theme: { mode: 'dark', surface: '#______', accent: '#______', ink: '#FFFFFF' }, // from the identity
     cover: M.cover,
     hero: { layout: 'bleed', media: M.cover },
     video: null,
     identity: { colours: [], typefaces: [] },
     home: { layout: 'cinema', details: [M.detail, M.signage] },
     story: [
       { type: 'bleed', media: M.signage },
       { type: 'detail', media: M.detail, label: 'Detail' },
       { type: 'palette' },
     ],
     caseStudy: null,
   };
   ```

   Keep `slug: '…'` on its own line, indented two spaces: the production sitemap reads it as text
   (`vite.config.js`).

3. **Only if needed** —
   - styles only this project uses: `src/projects/example/example.css`, imported at the end of the
     project block in `src/main.jsx`;
   - a story block or homepage art only this project has: a component in
     `src/projects/example/components/`, handed over through `blocks` or `home.slots` in the data;
   - a page of its own: `src/projects/example/ExamplePage.jsx`, set as `page: ExamplePage` in the
     data. It receives `{ project, index, total }`.

4. **Register** — in `src/projects/index.js`:

   ```js
   import example from './example/example.data';
   const PROJECTS = [rumh, louiza, rukaz, snackQuest, example];
   ```

5. **Check**
   - the slug is unique and URL-safe (the registry throws in development on a duplicate);
   - the homepage shows its chapter in Selected Work (`featured: true`) and its row in the index;
   - `/work/example` opens; an unknown slug still shows the 404;
   - the "next project" link of the previous project (by `order`) leads to it, and its own leads on;
   - `npm run lint` and `npm run build` pass.

No page, section or route needs editing. In development the registry also throws if a project lacks
`slug`, `name`, `category`, `cover`, `theme`, or a `hero` and `story` (unless it has its own `page`).

## Project Data Schema

The authoritative reference (including every story block) is the header comment of
`src/projects/index.js`. Summary:

| Field | Meaning |
| --- | --- |
| `slug` | URL segment (`/work/<slug>`). Unique, never reused. Also the folder name. |
| `name`, `nameAr` | Project name; Arabic name only if the identity has one. |
| `category`, `year`, `location` | Facts. `null` when unknown; null facts are not rendered. |
| `tagline`, `description`, `overview` | Written content from the supplied files only. `description` also becomes the page's meta description when set. |
| `services[]` | Services actually delivered (empty until confirmed). |
| `featured` | `true` → a chapter in Selected Work. Every project is in the index. |
| `order` | Position across the site (homepage, index, footer, next-project). |
| `theme` | `{ mode: 'dark' \| 'light', surface, accent, ink, gradient?, shape? }` — the project's own colours, used only inside its frames. |
| `cover` | Main image (media descriptor from `utils/media.js`). Also the share image. |
| `hero` | `{ layout: 'bleed' \| 'split' \| 'plate', media, mark? }` — the shared page's opening. |
| `home` | `{ layout: 'cinema' \| 'spread' \| 'type' \| 'mosaic', cover?, details[], flip[]?, bloom?, slots? }` — the homepage chapter. Without `layout`, projects cycle through the four. |
| `home.slots` | The project's own art in the shared composition, each a component receiving `{ project }`: `spread` (beside the cover in *spread*), `type` (behind the cover in *type*, instead of the Arabic name), `floor` (a strip at the foot of the chapter). |
| `logo`, `logoDark`, `logoField` | Official logo files (`{ mask: true }` = a flat shape painted in `theme.ink`). |
| `identity` | `{ colours: [{ name, nameAr?, hex }], typefaces: [] }` |
| `story[]` | The shared project page, as a list of blocks: `bleed`, `video`, `stage`, `detail`, `layered`, `sequence`, `pair`, `type`, `logo`, `palette`, `words`, plus any of the project's own `blocks`. |
| `blocks` | Story block types only this project has, `{ type: Component }` from its `components/`. |
| `page` | The project's own page component, rendered instead of hero → facts → story. Such a project carries the `copy` and `media` it renders. |
| `signature`, `sig` | Name of the behaviour built from the project's own artwork (`spear`, `bloom`, `strata`, `arcade`) and the files it uses. The name becomes `chapter--sig-*`, `project--sig-*`, `pnext--sig-*` classes. |
| `motion` | `'steps'` → reveals and image openings advance in discrete steps. |
| `anatomy[]` | Optional parts for the homepage Anatomy section. |
| `video`, `caseStudy` | Reserved (`null`). Film goes into `story` as a `video` block. |

### Signatures

| signature | project | what the interface borrows | code |
| --- | --- | --- | --- |
| `spear` | Rumh | the spearhead mark is the aperture images open through; traits on flags | `projects/rumh/` |
| `bloom` | Louiza | the leaf pattern grows from one leaf; objects sit on their own backdrop | `projects/louiza/` |
| `strata` | Rukaz | the pattern band travels behind the object; logo on the identity field | `projects/rukaz/` |
| `arcade` | Snack Quest | pixel-stepped frames, stepped motion, the slogan ticker | `projects/snack-quest/` |

The shapes are lifted from the supplied files by `exportSignatures()` in the media script (masks and
strips, nothing redrawn). A project without a signature uses the plain layouts.

## Routing

`App.jsx` declares three routes: `/` → `HomePage`, `/work/:slug` → `ProjectPage`, `*` →
`NotFoundPage`. Projects are not listed one by one.

`ProjectPage.jsx` looks the slug up with `getProject(slug)` from `src/projects`. An unknown slug
renders the 404. A known project renders the shared page (hero → facts → story) or, when its record
has a `page` component, that page. Both end with `NextProject`. The page is keyed by slug, so moving
between projects remounts it (fresh motion and triggers).

Nothing depends on array positions: links use `projectPath(project)`, the next project is
`getNextProject(slug)` (by `order`, wrapping round), numbering ("02 / 04") comes from the sorted list.
The homepage (`featuredProjects`, `allProjects`), index, footer, routes and next-project links all
read the same registry.

Homepage section links (`/#services`, or `TransitionLink section="services"`) land on the section id.
`HomePage` scrolls there on arrival.

SPA fallback: `vercel.json` (Vercel) and `public/_redirects` (Netlify) rewrite every path to the app.

## GSAP

- **Setup** — `src/motion/gsap.js` registers ScrollTrigger and exports the media-query constants
  (`MOTION_OK`, `STAGED`, `COMPACT`, `DESKTOP`, `FINE_POINTER`), which must match the stylesheets'
  breakpoints, plus the `introDone` gate that entrance animations wait for. Import `gsap` /
  `ScrollTrigger` from here, never from `gsap` directly.
- **Where animations live** — next to what they animate:

  | Animation | File |
  | --- | --- |
  | Intro / loader | `components/layout/Intro.jsx` |
  | Hero → first frame opening | `sections/Hero/useOpeningMotion.js` |
  | Selected Work colour takeover, chapter openings | `sections/SelectedWork/SelectedWork.jsx` |
  | Index preview | `sections/SelectedWork/WorkIndex.jsx` |
  | Statement (scattered → aligned) | `sections/Statement/Statement.jsx` |
  | Anatomy | `sections/Anatomy/Anatomy.jsx` |
  | Studio chapter | `sections/Studio/studioMotion.js` (scenes), called from `Studio.jsx` |
  | Project hero entrance | `components/projects/ProjectHero.jsx` |
  | Pinned horizontal sequence | `components/projects/story/MediaBlocks.jsx` (`Sequence`) |
  | Rumh aperture | `projects/rumh/components/Aperture.jsx` |
  | Louiza leaves | `projects/louiza/components/Bloom.jsx` |
  | Rukaz pattern band | `projects/rukaz/components/PatternBand.jsx` |
  | Rukaz page | `projects/rukaz/RukazPage.jsx` |
  | Snack Quest ticker | CSS keyframes in `projects/snack-quest/snack-quest.css` |
  | Stepped motion (`motion: 'steps'`) | read by `useReveals.js`, `SelectedWork.jsx`, `ProjectHero.jsx` |
  | Generic reveals / parallax | `hooks/useReveals.js` — `data-reveal="lines\|up\|clip"`, `data-parallax="n"` |
  | Page transitions | `transition/TransitionProvider.jsx` |
  | Cursor | `components/layout/Cursor.jsx` |

  Project motion lives inside the project component it animates, so there are no separate
  `*.motion.js` files for projects.

- **Cleanup** — every scroll-linked animation is created inside `gsap.matchMedia(root)` (or
  `gsap.context`) in a layout effect whose cleanup calls `revert()`. That kills the ScrollTriggers
  and pins with the component, so StrictMode double-mounts and route changes never duplicate them.
- **Reduced motion** — animations are registered under `MOTION_OK`/`STAGED`/`COMPACT`/`DESKTOP`, so
  with `prefers-reduced-motion: reduce` nothing runs, Lenis is not started, page transitions become
  plain navigation, and the CSS (always the final composed state) shows as it is.

### Page transitions

`TransitionLink` is a real `<a href>` (new tab, copy and no-JS all work). On a plain click it calls
`go()` from `TransitionProvider`:

- **With `media`** — the clicked image's crop expands over the project's colour, the route changes,
  the provider waits for the new page's `[data-hero-target]` (and its image, via `registerHero`, up
  to 700 ms), then lands the image on it.
- **Otherwise** — a navy panel with the NASAQ symbol crosses the screen while the route changes and
  the page is placed (top, or the requested section).

A second click during a transition is ignored. The incoming page can wait for the uncover with
`whenSettled()`. The overlay is emptied and hidden when the transition ends.

### Scrolling (Lenis + ScrollTrigger)

| Module | Responsibility |
| --- | --- |
| `motion/lenis.js` | The one Lenis instance, driven by GSAP's ticker; `scrollToY`, `lockScroll`, `refreshScroll` |
| `components/layout/SmoothScroll.jsx` | Starts/stops Lenis, following the reduced-motion setting live |
| `components/layout/ScrollManager.jsx` | Route-level: manual scroll restoration, top on back/forward, re-measure after a route change |
| `hooks/useScrollState.js` | Navbar state (`solid`, `hidden`) from scroll position |
| `utils/scroll.js` | `scrollToSection(id)`: scroll + focus a homepage section |

Rules: scroll from code only with `scrollToY()` / `scrollToSection()`, never `window.scrollTo`.
Anything that freezes the page (menu, intro) calls `lockScroll(true/false)`. A nested scroll area
that keeps its own wheel scrolling gets `data-lenis-prevent`.

## Assets

Project code lives in `src/projects/<slug>/`; project media do not. They stay here:

| Kind | Location |
| --- | --- |
| Originals as supplied | `brand/work/<folder>/` (logos in `brand/work/<folder>/logo/`) |
| Web images (generated) | `public/work/<slug>/<key>-<width>.webp` (+ `-blur.webp`) |
| Image dimensions (generated) | `src/data/media.json` |
| Project film | `public/work/<slug>/video/` (webm + mp4 + poster) |
| Homepage reel | `public/video/reel.{webm,mp4}` + poster, configured in `reel` in `siteConfig.js` |
| NASAQ brand files used by the UI | `public/brand/`, referenced by `brandAssets` in `siteConfig.js` |
| Fonts | `public/fonts/` |

Folder names in `brand/work` are the names the files arrived with and stay as they are: `lew` →
Louiza, `snaok` → Snack Quest, `rumh`, `rukaz`. Each data module's header names its source folder.

Data modules reference images through `utils/media.js`: `img('work/<slug>/<key>', alt, { position? })`
for responsive images, `withMobile(desktop, mobile)` for an art-directed small-screen crop, and
`asset('work/<slug>/<key>', alt, ext)` for single files (logos, masks). Both throw at start-up if the
key is missing from `media.json`, so a broken path fails loudly. Images render through
`components/ui/ResponsiveImage.jsx` (srcset, lazy loading, blur placeholder, `<picture>` for mobile
crops); video through `components/ui/LoopVideo.jsx` (muted, inline, plays only while visible, poster
only under reduced motion).

A project video block:

```js
{
  type: 'video',
  sources: [
    { src: '/work/example/video/film.webm', type: 'video/webm' },
    { src: '/work/example/video/film.mp4', type: 'video/mp4' },
  ],
  poster: '/work/example/video/film-poster.webp',
  label: 'Describe what the film shows',
}
```

`scripts/build-media.mjs [key-prefix]` re-exports only the `MANIFEST` entries matching the prefix,
but it always re-runs the logo, pattern and signature exports and rewrites `public/og.jpg` and
`brand/work/rukaz/extracted/`.

## Development Commands

```bash
npm install
npm run dev       # dev server (http://localhost:5173)
npm run lint      # ESLint
npm run build     # production build → dist/
npm run preview   # serve dist/ locally
node scripts/build-media.mjs [key-prefix]   # rebuild web images from /brand (needs sharp)
```

## Build and Deployment

`vite build` writes a static site to `dist/`. Deployed on Vercel (`vercel.json` rewrites all paths to
the SPA). Netlify works too (`public/_redirects`). Any other static host needs a rewrite of unknown
paths to `/index.html`.

Set the production domain at build time so social cards and search engines get absolute URLs:

```bash
SITE_URL=https://your-domain npm run build
```

With it set, the `nasaq-site-url` plugin in `vite.config.js` writes the canonical link, `og:url`,
absolute share-image URLs and `sitemap.xml` (one URL per project registered in `src/projects/index.js`,
plus a `robots.txt` line). Without it the build is unchanged.

Paths are case-sensitive on the build server (Linux): match file and folder casing exactly in imports.
