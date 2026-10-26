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
External design and API references, and how to use them: `DEVELOPMENT_RESOURCES.md`.

## Directory Structure

```
src/
  main.jsx                 entry: router + every stylesheet, in cascade order
  App.jsx                  layout shell (nav, main, footer, intro, cursor) + routes
  projects/                ONE FOLDER PER NASAQ IDENTITY (see Project Structure)
    index.js               the project registry, schema reference, lookup helpers
    rumh/  louiza/  datoura/  nurba/  rukaz/  snack-quest/
  data/
    siteConfig.js          NASAQ site copy, navigation, contact, social, SEO defaults, studio media
    media.json             generated image manifest (written by scripts/build-media.mjs; never edit)
  pages/
    HomePage.jsx           homepage: section order + arriving-at-a-section scroll
    ProjectPage.jsx        /work/:slug — resolves the slug, renders the shared or the project's own page
    NotFoundPage.jsx       404 (+ not-found.css)
  sections/                NASAQ homepage sections — component + stylesheet (+ local motion)
    Hero/                  Hero.jsx, Opening.jsx, useOpeningMotion.js, hero.css, opening.css
    SelectedWork/          SelectedWork.jsx (the logo sequence), sequence.js (its timeline
                           builder), WorkIndex.jsx (all projects list) + CSS
    Statement/  Anatomy/  Services/  Contact/
    Studio/                Studio.jsx, Construction.jsx, geometry.js, studioMotion.js, studio.css
  components/
    layout/                Navbar, Footer, Intro, Cursor, SmoothScroll, ScrollManager (+ CSS)
    ui/                    Arrow, NasaqMark, ResponsiveImage, LoopVideo, text-link.css
    projects/              shared case-study pieces: ProjectHero, ProjectIntro, NextProject,
                           ProjectLogo, LogoMotion, LogoParts (a logo as separate, animatable
                           parts) + project-hero/story/next/variants/logo/logo-motion/logo-parts.css
      story/               ProjectStory (block renderer), MediaBlocks, IdentityBlocks, Frame, fields.js
  transition/              TransitionProvider, TransitionLink, context.js, page-transition.css
  motion/                  gsap.js (plugin setup, media queries, intro gate), lenis.js (smooth scroll)
  hooks/                   useReveals, useMeta, useScrollState
  utils/                   media (image + logo-film descriptors), scroll, shape (clip paths), colour
  styles/
    tokens.css             design tokens: palette, fonts, weights, type scale, spacing, z-layers, easing
    typography.css         @font-face + shared type utilities (.line, .label)
    global.css             reset, document defaults, focus, selection, accessibility helpers
scripts/build-media.mjs    exports responsive WebP, logos, masks and og.jpg from /brand into /public
scripts/logo-motion/       renders each project's logo film from its real logo (see Logo motion films)
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
    rumh.data.js                   content, media, the copy its page renders
    RumhPage.jsx                   Rumh's own page (lazy chunk), composed of components/
    rumh.css                       the whole Rumh page (Metropolis RM face) + next-project crop
    rumh.motion.js                 GSAP + DrawSVG, eases, the mark's geometry and its two angles
    components/                    Opening, Concept, Traits, Mark, Lockups, Pattern, Colour,
                                   Applications (ArtDirection, Wayfinding, Objects, Spaces), Finale
  louiza/
    louiza.data.js                 content, media, the copy its page renders
    LouizaPage.jsx                 Louiza's own page (lazy chunk), composed of components/
    louiza.css                     the whole Louiza page + next-project leaf frame
    louiza.motion.js               eases, the logo parts' boxes and pivots
    components/                    Opening, Words, Construction, Colour, Pattern (Bloom plates),
                                   Applications (Apparel, Tags, Carry, Screen, Box), Finale, Label
  datoura/
    datoura.data.js                content, media, the copy its page renders
    DatouraPage.jsx                DATOURA's own page (lazy chunk), composed of components/
    datoura.css                    the wave lines of its homepage scene + the whole DATOURA page
    datoura.sequence.js            its Selected Work scene (waves, rings, the shield-shaped opening)
    datoura.motion.js              GSAP + DrawSVG/MorphSVG for the page, shared easings, boxOf()
    contour.js                     the symbol's outer contour as a clip-path polygon (scene + page)
    art.json                       the artboards' vectors by piece and role (scripts/datoura-extract.mjs)
    symbol.json                    the symbol's three rings as vector paths (same script)
    components/                    Art (inline SVG from art.json), Opening, Idea, Wordmark, Colour,
                                   Type, Waves, Applications (Card, Stadium, Screen), Finale
  nurba/
    nurba.data.js                  content, media, the copy its page renders, identity colours
    NurbaPage.jsx                  NURBA's own page (lazy chunk), composed of components/
    nurba.css                      the glint of its homepage scene + the whole NURBA page
    nurba.sequence.js              its Selected Work scene (trace, light, set; the octagon opening)
    nurba.motion.js                eases, the octagon geometry, trace/light masks
    logo-parts.json                the stacked logo's parts (scripts/logo-motion/export-parts.mjs)
    components/                    Opening, Statement, Monogram, Lockups, Pattern, Colour,
                                   Applications (Engraving, Vitrine, Bags, Card, Envelopes,
                                   Campaign), Caption, Finale
  rukaz/
    rukaz.data.js                  content, media, the copy its page renders
    RukazPage.jsx                  Rukaz's own page (+ its GSAP)
    rukaz.css                      the pattern band on the homepage + the whole Rukaz page
    components/PatternBand.jsx     the travelling pattern band (+ its GSAP), its homepage slot
  snack-quest/
    snack-quest.data.js            content, media, the copy its page renders
    SnackQuestPage.jsx             Snack Quest's own page (lazy chunk), composed of components/
    snack-quest.css                the whole page (Pixelify SQ face), pixel corners, the ticker
    snack-quest.motion.js          step eases, the logo parts' boxes, the pixel cover (canvas)
    components/                    Opening, Monogram, Type, Colour, Applications (Packaging,
                                   Spaces), Finale, Pixels, Bits (Level, Flames), Ticker
```

Original media stay outside `src`: `brand/work/<folder>/` (originals) and `public/work/<slug>/`
(generated web images). The data module references them; see [Assets](#assets).

### How a project plugs into the shared site

A project's data record hands its own pieces to the shared renderers. Shared code never imports
from a project folder:

| Field in `<slug>.data.js` | Consumed by | Used for |
| --- | --- | --- |
| `story` | `components/projects/story/ProjectStory.jsx` | the shared project page, block by block |
| `blocks` | `ProjectStory.jsx` | story block types only this project has (`{ type: Component }`) |
| `page` | `pages/ProjectPage.jsx` | the project's own page component, instead of the shared one |
| `home` (`field`, `ink`, `logo`, `sequence`) | `sections/SelectedWork/SelectedWork.jsx` | the project's scene in the Selected Work sequence: its colours, its logo parts, its choreography |
| `home.cover` | `components/projects/NextProject.jsx` | the image of the next-project teaser (defaults to `cover`) |
| `signature` | ProjectPage, NextProject | adds `*--sig-<name>` classes for the project's stylesheet |
| `motion: 'steps'` | ProjectPage, ProjectHero, useReveals | reveals and openings advance in steps |
| `theme` | everywhere the project appears | the project's own colours (never NASAQ's) |

Project stylesheets are imported in `src/main.jsx`, after all shared stylesheets, so they can bend the
shared layouts around one identity.

### How to edit each project

**Rumh** — `src/projects/rumh/`
- Page/layout: `RumhPage.jsx` (own page, lazy). One point and two angles (17.2° / 72.8°, the mark's edges); the mark is the page's aperture. Opening (eight lines converge on the spearhead's tip; pinned, the mark opens until its red fills the screen), Concept (on that red, pinned: a navy spear rises between the two ideas, then widens into the next section's navy), Traits, Mark (pinned: the square's corner rises), Lockups (navy on white, the supplied files as masks), Pattern (live SVG lattice), Colour (three straight panels), then full-bleed scenes with one caption plate (`.rm-cap`): ArtDirection and Sign (opened through the mark), Wayfinding, Objects (white | red split), Digital; Finale
- Colour rhythm: navy → red → navy → white (logo chapter) → navy | red | white → photographs → navy
- Data/content: `rumh.data.js` (`copy` translated from the guidelines, `media`, `identity`)
- Styles: `rumh.css` (all `.rm-*`; Metropolis as `Metropolis RM`)
- Motion: each component owns its GSAP via `rumh.motion.js` (still, then fast, then a dead stop); homepage scene: `rumh.sequence.js`
- Assets: originals `brand/work/rumh/`, web images `public/work/rumh/` (`scripts/build-media.mjs`; `sign` is guideline page 34 without its heading and footer; `screen` and `interior` are still built but no longer shown), lockups `public/work/rumh/lockup-*.png` and fonts `public/work/rumh/fonts/` (`scripts/project-assets.mjs`)
- Also: Rumh's `anatomy` parts feed the homepage Anatomy section (`home.anatomyProject` in `siteConfig.js`)

**Louiza** — `src/projects/louiza/`
- Page/layout: `LouizaPage.jsx` (own page, lazy). One system: a twelve-column grid (`.lz-grid`, the left column carries every index, label and caption, titles from column 4), one section header (`components/Head.jsx`: index · label · Arabic label · title · text), one rhythm (`--lz-pad`, `--lz-gap`). Opening (the logo assembles from its parts on the soft field; pinned, it becomes the mark: 01), Construction (opened through a leaf: 02), Words (the type page's four words as masks: 03), Colour (pinned: six columns and the blurred band: 04), Pattern (pinned: the mark repeated outward from the logo, then two plates: 05), Applications (scenes and pairs: 06), Finale. Every frame is a leaf (`--lz-leaf-r`); every section melts in from the previous one's colour (`--lz-from` → `--lz-to`)
- Colour roles: Antique White page, Chocolate Plum text (68% secondary), Smoky Rose accent, Pacific Blue and Rosy Taupe each own one block
- Data/content: `louiza.data.js` (`copy` with indexed sections, `applications`, `media.words`)
- Styles: `louiza.css`
- Motion: components via `louiza.motion.js` (grow / write / settle; power2/sine, no overshoot; three pinned scenes); homepage scene: `louiza.sequence.js`
- Assets: originals `brand/work/lew/`, web images `public/work/louiza/`, word masks `public/work/louiza/word-*.png` (`scripts/project-assets.mjs`)

**DATOURA** — `src/projects/datoura/`
- Page/layout: `DatouraPage.jsx` (its own page, loaded as a separate chunk; `ProjectPage.jsx` shows `.project__loading` while it arrives). Sections, in order: Opening (the contour film screen-blended on the field, the wordmark rising), Idea (pinned: shield + waves + chart morph into the symbol, then the lockup on its construction lines), Wordmark (outline, drawn), Colour (pinned: each palette field opens out of the symbol's contour), Type, Waves, Card, Stadium (opened through the contour), Screen, Finale
- Data/content: `datoura.data.js` (`copy`, `media`, `film`, `palette`; name, tagline, concept captions, palette and typefaces from the identity file; year, location and services not stated, so empty)
- Styles: `datoura.css` (all `.dt-*` page styles; DM Sans as the `DM Sans DT` face)
- Motion: page sections each own their GSAP (`components/*.jsx`, via `datoura.motion.js`); every pinned or scrubbed scene is registered under `MOTION_OK`, so reduced motion gets the static composition. Homepage scene `datoura.sequence.js`: echoes of the symbol's outer contour ripple out, the rings settle inside out, the letters light as the wave passes; one slow wave during the hold; leaving, it hands off: the next scene opens inside the outer contour (a clip-path polygon sampled from `symbol.json`), which widens to fill the screen. Keep a scene whose `reveal` draws something essential (e.g. Snack Quest's pixel field) out of the slot after DATOURA, since a handoff skips that `reveal`.
- Assets: original `brand/work/DATOURA_Folder/DATOURA_Folder/DATOURA.ai` (one packaged Illustrator file, 16 artboards); `node scripts/datoura-extract.mjs` (needs MuPDF, see its header) lifts the artboards' vectors to `src/projects/datoura/art.json`, the lockup to `extracted/logo-white.{svg,png}` and the rings to `symbol.json`; photographs are the linked mockups in `DATOURA_Folder/Links` (`build-media.mjs`; the moodboard JPGs there are third-party and not used); web images `public/work/datoura/`, logo parts `public/work/datoura/parts/`; DM Sans WOFF2 in `public/work/datoura/fonts/` (from `DATOURA_Folder/Fonts`, OFL); the contour film `public/work/datoura/video/` (see Commands)

**NURBA** — `src/projects/nurba/`
- Page/layout: `NurbaPage.jsx` (own page, lazy). Navy → cream → navy → cream → photographs → navy: Opening (the monogram traced and lit, then the letters set and the Arabic written; pinned), Statement, Monogram (pinned: two lines, one stem, one glint), Lockups (board 16 arrangements), Pattern (N ✦ B rebuilt live from the board's step; pinned; a glint wave), Colour (seven colours as concentric octagons + hex/RGB/CMYK), Engraving, Vitrine (pinned horizontal track ≥900px, a column below), Bags, Card (opened through the octagon), Envelopes, Campaign, Finale (logo film)
- Data/content: `nurba.data.js` (`copy`, `media`, `identity`; the lines "Luxury in Every Detail" and "Because You Deserve the Best" and the colour values are the boards'; year, location and services not stated, so empty)
- Styles: `nurba.css` (all `.nb-*`; the octagon clip is the monogram's 15.8% corner cut)
- Motion: four moves only — trace (a conic mask round the octagon from its top-left corner), light (a 105° band), set (expo.out from slightly above), glint — in `nurba.motion.js`; every pinned or scrubbed scene is under `MOTION_OK`. Homepage scene `nurba.sequence.js` (`handoff: true`): glint, lines traced, NB lit, letters set; leaving, the next scene opens through an octagon that closes on the monogram and opens again
- Assets: originals `brand/work/nurba/` (boards `Nurba11-02..16.png`; the packaged folder holds only fonts, one bag mockup and a report — no `.ai`); the logo is traced from board 16 by `scripts/nurba-extract.mjs` to `brand/work/nurba/extracted/` (SVG + PNG, IoU-checked against the board); web images and logo files `public/work/nurba/`, parts `public/work/nurba/parts/`, film `public/work/nurba/video/`. Not used: the ID badge and receipt on board 14 (personal data), board 15 (designer's slide), board 09. Snaga Arabic Text (the identity's face) is Adobe Fonts only, so the page uses the site's faces

**Rukaz** — `src/projects/rukaz/`
- Page/layout: `RukazPage.jsx` (its own page)
- Data/content: `rukaz.data.js` (`copy`, `media`, `identity`, `logo`, `sig`)
- Styles: `rukaz.css`
- Motion: `RukazPage.jsx` (page entrance and scroll scenes), `components/PatternBand.jsx` (band travel); homepage scene: `rukaz.sequence.js` (strata laid, pieces lock together)
- Own components: `components/PatternBand.jsx` (`PatternBand`)
- Assets: originals `brand/work/rukaz/` (`extracted/` = application tiles), web images `public/work/rukaz/`

**Snack Quest** — `src/projects/snack-quest/`
- Page/layout: `SnackQuestPage.jsx` (own page, lazy). Played in levels, moving in whole pixels: Opening (plate wiped on in steps, the name typed by a cursor), Monogram, Type (live Pixelify slogan ring turning in steps), Colour (stepped bars rising, sprites), Packaging, Spaces (pictures arrive as pixel dissolves, `components/Pixels.jsx`), Finale (film + ticker); flames divide the levels
- Data/content: `snack-quest.data.js` (`copy`, colours with sprites; red is `#BA2F2F`, from the colour page)
- Styles: `snack-quest.css` (Pixelify Sans as `Pixelify SQ`)
- Motion: step eases and the canvas pixel cover in `snack-quest.motion.js`; loops (flames, ring, sprites, ticker) are CSS `steps()`; homepage scene: `snack-quest.sequence.js`
- Assets: originals `brand/work/snaok/`, web images `public/work/snack-quest/`, flames and sprites `public/work/snack-quest/{flames,sprite-*}.png` and fonts `public/work/snack-quest/fonts/` (`scripts/project-assets.mjs`)

### Why every project has its own page

Each page is composed from its identity: its geometry, its motion character, its palette owning
the page. Rumh is cut on its two angles, Louiza grows and melts, DATOURA is drawn from its vectors,
NURBA is traced, lit and set like a stone, Rukaz is assembled and laid down in strata, Snack Quest moves in pixel steps. Such compositions do
not break into shared story blocks without losing that. Everything a page shows still comes from
its `<slug>.data.js`, and the route, meta tags, page transition and next-project link stay shared.
The shared story (`components/projects/story/`) remains the starting point for a new project.

On a `theme.mode: 'light'` project the navbar, while transparent, is set in the official black
(`nav--ink`, `Navbar.jsx`).

## Quick Edit Map

| Change | Where |
| --- | --- |
| Global NASAQ colours | `src/styles/tokens.css` (`--color-*`; roles such as `--bg`/`--fg` below them, light-surface roles at the bottom). The palette *shown* in Studio is `brandColours` in `siteConfig.js`. |
| Official font setup | Files in `public/fonts`; `@font-face` in `src/styles/typography.css`; families and weights (`--font-*`, `--fw-*`) in `tokens.css`. Declare only weights that exist. |
| Spacing, widths, gutters, z-layers, easing | `src/styles/tokens.css` |
| Homepage section order | `src/pages/HomePage.jsx` |
| Hero | Copy: `hero` in `siteConfig.js` (headlines wrap naturally, word by word; no hard-coded line breaks). Layout: `src/sections/Hero/Hero.jsx` + `hero.css` (English headline, axis + symbol, Arabic headline, column grid `.hero__grid`). Opening sequence: `Opening.jsx`, `opening.css`, `useOpeningMotion.js` |
| Selected Work | One continuous, scroll-scrubbed sequence of the featured projects' logos (live GSAP, no video): each logo assembles from its own parts, holds, and hands over to the next. `src/sections/SelectedWork/` — `SelectedWork.jsx` (one scene per project, the sticky stage, the ScrollTrigger), `sequence.js` (the timeline builder; its header documents the step API and the `ENTER` / `HOLD` / `LEAVE` lengths), `selected-work.css` (logo sizing `--seq-k`; scroll length per project = `42svh`). Per project: `home` in `<slug>.data.js` (`field`, `ink`, `logo: { dir, manifest, paint }`, `sequence`) and the choreography in `projects/<slug>/<slug>.sequence.js`. Logo parts: `node scripts/logo-motion/export-parts.mjs` splits each official logo (groups in `scripts/logo-motion/logos.mjs`) into `public/work/<slug>/parts/*.png` + `src/projects/<slug>/logo-parts.json`. A project without a sequence uses `fallbackSequence`. Reduced motion: one still scene per project. `WorkIndex.jsx` (index list; rows rise into each project's colour) |
| Studio | Copy/media: `about`, `studioMedia`, `brandColours` in `siteConfig.js`. Layout: `src/sections/Studio/Studio.jsx` + `studio.css`; drawing: `Construction.jsx` + `geometry.js`; motion: `studioMotion.js` |
| Statement | Copy: `statement` (the three sentences) in `siteConfig.js`; "NASAQ" in the last is set in Primary Blue. Layout: `src/sections/Statement/` on Deep Navy — label + نسق, a rule, then the sentences at display size, the second muted; from 1024px the second and third step in from the left (`padding-left` 16.66% / 33.33%) |
| Anatomy | Which project: `home.anatomyProject` in `siteConfig.js`; parts: that project's `anatomy`. Layout: `src/sections/Anatomy/` (desktop: sticky exploded view; scatter positions in `SCATTER`) |
| Services | List: `services` in `siteConfig.js` (`en`, `ar`; `body` is DRAFT copy and not shown). Layout: `src/sections/Services/` on Deep Navy — a typographic index: number, the name at display size, the Arabic at the opposite edge (below the name under 900px), hairlines between rows, the slash pattern at the foot. Hover (fine pointers): the name turns Primary Blue and steps along |
| Contact | Copy: `contactCopy` in `siteConfig.js`. Layout: `src/sections/Contact/` (NASAQ blue field that opens from a crop, official lockup at its foot; fine pointers: `magnetic()` arrows) |
| WhatsApp / Instagram | `contact` in `src/data/siteConfig.js` — the only place in the app. Also the `<noscript>` line in `index.html` (it cannot import JS). |
| Navigation | `navigation` in `siteConfig.js` (`to` = homepage section id). Markup: `components/layout/Navbar.jsx`. Current-section marker: `SECTION_RANGES` there + `hooks/useActiveSection.js`. Rolling link labels (`.nav__roll`) and the reading-progress hairline (`.nav__progress`, CSS scroll timeline) in `navbar.css` |
| Footer | A single legal line: `footer` in `siteConfig.js`. Markup: `components/layout/Footer.jsx`. The homepage ends on Contact; navigation lives in the navbar. |
| Page canvas | Black (`--bg: var(--color-black)` in `tokens.css`). Navy is a secondary accent; NASAQ blue is the accent. |
| A project's logo film | `motionLogo` in `<slug>.data.js`; the film itself from `scripts/logo-motion/` (see Assets) |
| Page titles, description, share image | `site` in `siteConfig.js` (defaults also in `index.html`); per project: `ProjectPage.jsx` via `hooks/useMeta.js` |
| Edit a project | `src/projects/<slug>/` — see [How to edit each project](#how-to-edit-each-project) |
| A project's images | The `M` map at the top of `<slug>.data.js`; files come from `scripts/build-media.mjs` (see Assets) |
| A project's video | A `video` block in the project's `story` (see schema) |
| Add a new project | See [Adding a New Project](#adding-a-new-project) |
| Shared project page layout | Hero: `components/projects/ProjectHero.jsx` (`hero.layout`). Facts: `ProjectIntro.jsx`. Blocks: `components/projects/story/`. Shell: `pages/ProjectPage.jsx` |
| One project's page layout | Its `story` in `<slug>.data.js`, or its own `<Name>Page.jsx` (every current project) |
| One project's homepage scene | `home` in `<slug>.data.js`; choreography in `projects/<slug>/<slug>.sequence.js` (API: `sections/SelectedWork/sequence.js`) |
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
     featured: true,          // false → listed in the index only, no homepage scene
     order: 5,
     theme: { mode: 'dark', surface: '#______', accent: '#______', ink: '#FFFFFF' }, // from the identity
     cover: M.cover,
     hero: { layout: 'bleed', media: M.cover },
     video: null,
     identity: { colours: [], typefaces: [] },
     home: { field: '#______', ink: '#______' }, // + logo / sequence: see "Project Data Schema"
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
     `src/projects/example/components/`, handed over through `blocks` in the data;
   - its own homepage motion: add its logo to `scripts/logo-motion/logos.mjs`, run
     `scripts/logo-motion/export-parts.mjs`, then write `src/projects/example/example.sequence.js`
     and set `home.logo` / `home.sequence`. Without them the scene uses `fallbackSequence`;
   - a page of its own: `src/projects/example/ExamplePage.jsx`, set as `page: ExamplePage` in the
     data. It receives `{ project, index, total }`.

4. **Register** — in `src/projects/index.js`:

   ```js
   import example from './example/example.data';
   const PROJECTS = [rumh, louiza, rukaz, snackQuest, example];
   ```

5. **Check**
   - the slug is unique and URL-safe (the registry throws in development on a duplicate);
   - the homepage shows its scene in Selected Work (`featured: true`) and its row in the index;
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
| `featured` | `true` → a scene in the Selected Work sequence. Every project is in the index. |
| `order` | Position across the site (homepage, index, next-project). |
| `theme` | `{ mode: 'dark' \| 'light', surface, accent, ink, gradient?, shape? }` — the project's own colours, used only inside its frames. |
| `cover` | Main image (media descriptor from `utils/media.js`). Also the share image. |
| `hero` | `{ layout: 'bleed' \| 'split' \| 'plate', media, mark? }` — the shared page's opening. |
| `home` | `{ field, ink, logo?, sequence?, cover? }` — the project's scene in Selected Work. `field` / `ink`: its colours. `logo`: `{ dir, manifest, paint }` — the parts folder, its `logo-parts.json`, and `paint` (`{ default, [part or prefix]: colour }`). `sequence`: its choreography (`<slug>.sequence.js`; API in `sections/SelectedWork/sequence.js`). `cover`: the next-project teaser image. |
| `logo`, `logoDark`, `logoField` | Official logo files (`{ mask: true }` = a flat shape painted in `theme.ink`). |
| `identity` | `{ colours: [{ name, nameAr?, hex }], typefaces: [] }` |
| `motionLogo` | The logo film: `logoMotion(slug, { width, height, field, alt })` from `utils/media.js`. Shown as the `motion` story block on the project page. |
| `story[]` | The shared project page, as a list of blocks: `bleed`, `video`, `stage`, `detail`, `layered`, `sequence`, `pair`, `type`, `logo`, `motion`, `palette`, `words`, plus any of the project's own `blocks`. |
| `blocks` | Story block types only this project has, `{ type: Component }` from its `components/`. |
| `page` | The project's own page component, rendered instead of hero → facts → story. Such a project carries the `copy` and `media` it renders. |
| `signature`, `sig` | Name of the behaviour built from the project's own artwork (`spear`, `bloom`, `strata`, `arcade`, `facet`) and the files it uses. The name becomes `project--sig-*`, `pnext--sig-*` classes. |
| `motion` | `'steps'` → reveals and image openings advance in discrete steps. |
| `anatomy[]` | Optional parts for the homepage Anatomy section. |
| `video`, `caseStudy` | Reserved (`null`). Film goes into `story` as a `video` block. |

### Signatures

| signature | project | what the interface borrows | code |
| --- | --- | --- | --- |
| `spear` | Rumh | the next-project teaser is glimpsed through the spearhead mark | `projects/rumh/` |
| `bloom` | Louiza | the next-project teaser is framed as a leaf | `projects/louiza/` |
| `strata` | Rukaz | the pattern band travels behind the object; logo on the identity field | `projects/rukaz/` |
| `facet` | NURBA | the next-project teaser is framed in the monogram's octagon | `projects/nurba/` |
| `arcade` | Snack Quest | the next-project teaser has stepped pixel corners | `projects/snack-quest/` |

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
`getNextProject(slug)` (by `order`, wrapping round). The site shows no project numbers.
The homepage (`featuredProjects`, `allProjects`), index, routes and next-project links all
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
  | Selected Work logo sequence (one scrubbed timeline, `is-current`) | `sections/SelectedWork/SelectedWork.jsx`, `sequence.js`; per project `projects/<slug>/<slug>.sequence.js` |
  | Index preview | `sections/SelectedWork/WorkIndex.jsx` |
  | Statement (one timeline, once: label fades up, rule draws, each sentence rises out of masked lines down the staircase, NASAQ turns blue) | `sections/Statement/Statement.jsx`; shared timings/helpers in `motion/typeMotion.js` |
  | Anatomy (exploded view → strip) | `sections/Anatomy/Anatomy.jsx` |
  | Services (head fades up, top rule draws; rows in order via `ScrollTrigger.batch`: hairline draws, name then Arabic rise out of their masks, number fades up; hover in CSS) | `sections/Services/Services.jsx`, `services.css`; `motion/typeMotion.js` |
  | Contact field opening | `sections/Contact/Contact.jsx` |
  | Studio chapter | `sections/Studio/studioMotion.js` (scenes), called from `Studio.jsx` |
  | Project hero entrance | `components/projects/ProjectHero.jsx` |
  | Pinned horizontal sequence | `components/projects/story/MediaBlocks.jsx` (`Sequence`) |
  | A project's own page | `projects/<slug>/components/*.jsx`, each section owning its GSAP under `MOTION_OK`, via `projects/<slug>/<slug>.motion.js` (Rumh, Louiza, DATOURA, NURBA, Snack Quest) or `RukazPage.jsx` |
  | Rukaz pattern band | `projects/rukaz/components/PatternBand.jsx` |
  | Rukaz page | `projects/rukaz/RukazPage.jsx` |
  | Snack Quest ticker | CSS keyframes in `projects/snack-quest/snack-quest.css` |
  | Stepped motion (`motion: 'steps'`) | read by `useReveals.js`, `ProjectHero.jsx` |
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
- **Otherwise** — a black panel with the NASAQ symbol crosses the screen while the route changes and
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
Louiza, `snaok` → Snack Quest, `rumh`, `rukaz`, `nurba`, `DATOURA_Folder` → DATOURA. Each data module's header
names its source folder. DATOURA arrived as a single `.ai` file: its vectors are lifted to `src/projects/datoura/art.json`
and its logo to `brand/work/DATOURA_Folder/extracted/` (written by `scripts/datoura-extract.mjs`;
the logo is read by `build-media.mjs` and `logo-motion/export-parts.mjs`); the original is never modified.

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

### Project assets cut from the identity files

`node scripts/project-assets.mjs` writes the pieces the project pages use that are lifted from the
supplied pages rather than photographed: Rumh's logo arrangements (`public/work/rumh/lockup-*.png`),
Louiza's four words as masks (`public/work/louiza/word-*.png`), Snack Quest's flames strip and the
coin and burger sprites (`public/work/snack-quest/{flames,sprite-*}.png`). Pieces are keyed out of
their flat backgrounds only where the cut is clean; it adds their entries to `src/data/media.json`
without touching the others.

Web fonts the identities name live in `public/work/<slug>/fonts/` (WOFF2, copied in by hand):
Metropolis for Rumh (public domain, from the `@fontsource/metropolis` package, `LICENSE.txt`
beside it), Pixelify Sans for Snack Quest (OFL, from `@fontsource/pixelify-sans`, `LICENSE.txt`),
DM Sans for DATOURA (OFL, from the identity's own Fonts folder).

### Logo motion films

Each project's logo film is rendered from its real logo file, never redrawn:

```
node scripts/logo-motion/render.mjs [slug]
```

- `parts.mjs` splits the logo into its connected shapes on one shared canvas, so stacked parts
  reproduce the file exactly; `render.mjs` (the `LOGOS` config) names the parts per project.
- `scenes/<slug>.js` is the motion: one function of time that places the parts. `stage.html` draws
  it; every frame is screenshot in Chrome and encoded with ffmpeg.
- Output: `public/work/<slug>/video/logo-motion.webm` (VP9), `.mp4` (H.264, faststart) and
  `logo-motion-poster.webp`. First and last frames are the bare field, so the loop is seamless.
- Needs ffmpeg on PATH and Chrome driven by Playwright (the global `@playwright/cli` install).
- Register the film with `motionLogo: logoMotion(slug, { width, height, field, alt })`; `field`
  must be the scene's background colour. `components/projects/LogoMotion.jsx` loads it lazily
  (near the viewport), plays it only while visible, and shows the poster under reduced motion.

## Development Commands

```bash
npm install
npm run dev       # dev server (http://localhost:5173)
npm run lint      # ESLint
npm run build     # production build → dist/
npm run preview   # serve dist/ locally
node scripts/build-media.mjs [key-prefix]   # rebuild web images from /brand (needs sharp)
node scripts/logo-motion/export-parts.mjs [slug]   # split official logos into parts for Selected Work
MUPDF=<mupdf entry> node scripts/datoura-extract.mjs   # re-lift DATOURA's vectors and logo from its .ai
POTRACE=<potrace package> node scripts/nurba-extract.mjs   # re-trace NURBA's logo from board 16
```

DATOURA's contour film is a square crop of `brand/work/DATOURA_Folder/1ايقونه.mp4`, without its
silent audio track (ffmpeg):

```bash
SRC="brand/work/DATOURA_Folder/1ايقونه.mp4"; OUT=public/work/datoura/video; CROP=crop=800:800:564:123
ffmpeg -i "$SRC" -vf $CROP -an -c:v libvpx-vp9 -crf 38 -b:v 0 $OUT/contour.webm
ffmpeg -i "$SRC" -vf $CROP -an -c:v libx264 -crf 25 -pix_fmt yuv420p -movflags +faststart $OUT/contour.mp4
ffmpeg -i "$SRC" -vf $CROP -frames:v 1 $OUT/contour-poster.webp
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
