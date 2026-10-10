# NASAQ — نسق

Website for NASAQ, a Saudi brand identity studio. React + Vite + GSAP, plain CSS.

## Run

```bash
npm install
npm run dev       # local development
npm run lint
npm run build     # production build → dist/
npm run preview   # serve the build locally
```

## Structure

```
src/
  data/projects.js     every project (single source of truth — see header comment)
  data/site.js         global copy, navigation, contact links
  data/media.json      generated image manifest (do not edit by hand)
  pages/               Home, Project (/work/:slug), NotFound
  sections/            homepage sections
  components/          Navbar, Footer, Intro, Cursor, media helpers
  transition/          page transitions (image-expand and panel)
  motion/              GSAP setup, opening motion, scroll reveals
  styles/              tokens + one stylesheet per area
scripts/build-media.mjs  exports responsive WebP from /brand originals
public/                  fonts, generated media, reel video, icons
```

## Scrolling

Smooth scrolling is Lenis, created once in `App.jsx` (`<SmoothScroll />`) through
`src/motion/lenis.js`. Rules that keep it and ScrollTrigger in step:

- Scroll from code only with `scrollToY()` / `scrollToSection()`, never `window.scrollTo`.
- Anything that freezes the page (menu, intro) calls `lockScroll(true/false)`.
- A nested scroll area that should keep its own wheel scrolling gets `data-lenis-prevent`.
- After a route change `refreshScroll()` re-measures ScrollTrigger and Lenis.
- Reduced motion: Lenis is not started; scrolling is native.

## Adding a project

1. Put the originals in `brand/work/<folder>`.
2. Add entries to `MANIFEST` in `scripts/build-media.mjs` (optional crop per image), then
   `npm i -D sharp` (if missing) and `node scripts/build-media.mjs work/<slug>`.
3. Add the project to `src/data/projects.js`. The homepage chapters, index, footer,
   project page and next-project links update automatically. `home.layout` picks one of
   `cinema | spread | type | mosaic`; `story` composes the project page from blocks.

Only facts present in the supplied material are written; unknown fields stay `null`.

### Project logos

Each project's `logo` is the cleanest logo file available. It leads the index preview
(the logo on the project's own field, on hover/focus and in the mobile rows) and the logo
blocks on the project page. Clean logo files live beside the project originals
(`brand/work/<folder>/logo/`) and are trimmed by `exportLogo()`; Rukaz has no logo file yet,
so its logo is a mask lifted from the logo page (`logo.mask`). A project without a logo
falls back to its cover image.

The Rukaz applications collage is split into individual tiles (`RUKAZ_APPS` in
`scripts/build-media.mjs`): lossless copies go to `brand/work/rukaz/extracted/`, web
versions to `public/work/rukaz/apps/`. The source is a 513 px screenshot, so tiles are
140 px tall and are only ever shown at that size.

### Bespoke project pages

A project can have a page designed for it alone: set `page: '<key>'` on its entry and
register the component in `CUSTOM_PAGES` (`src/pages/Project.jsx`). The component replaces
the shared hero, facts and story; the route, meta tags and next-project link stay shared,
and everything it shows (`copy`, `media`, colours, logo) still lives in the project entry.

Rukaz is the first: `src/pages/projects/RukazPage.jsx` + `src/styles/rukaz.css`. It uses
only the identity's four colours, sets the logo, pattern and type specimen as CSS-painted
shapes, and shows photographs untouched (no masks, fades or blends). When the transparent
mug + rock file is supplied, add it to `K.cover` in `projects.js`; the hero frame takes it
as is.

### Project signatures

A project may also carry a `signature`: one behaviour built from its own artwork, used on
its homepage chapter, its case study and its "next project" teaser.

| signature | project     | what the interface borrows                                              |
| --------- | ----------- | ----------------------------------------------------------------------- |
| `spear`   | Rumh        | the spearhead mark is the aperture images open through; traits on flags |
| `bloom`   | Louiza      | the leaf pattern grows from one leaf; objects sit on their own backdrop |
| `strata`  | Rukaz       | the pattern band travels behind the object; logo on the identity field  |
| `arcade`  | Snack Quest | pixel-stepped frames, stepped motion, the slogan ticker                 |

The shapes are lifted from the supplied files by `exportSignatures()` in
`scripts/build-media.mjs` (masks and strips — nothing is redrawn) and rendered by
`src/components/Signature.jsx` + `src/styles/signature.css`. A project without a signature
falls back to the plain layouts, so the portfolio still scales without extra design work.

## Deployment

Any static host. SPA fallback is included for Netlify (`public/_redirects`) and Vercel
(`vercel.json`). For other hosts, rewrite unknown paths to `/index.html`.

## Before public launch

- **ABC Favorit Arabic** files are *Trial* builds — replace with licensed web fonts
  (same family name and weights in `src/styles/fonts.css`).
- Build with the production domain so social cards and search engines get absolute URLs:
  `SITE_URL=https://your-domain npm run build` writes the canonical link, `og:url`, absolute
  share-image URLs and `sitemap.xml` (see `vite.config.js`). Without it the build still works,
  but link previews may show no image.
- Project pages set their title/description in the browser. Crawlers that do not run
  JavaScript see the homepage's; pre-render the routes if per-project link previews matter.
- The footer lockup is shown wider than the supplied logo file (892 px). Supply a vector or
  larger export of the NASAQ lockup to keep it sharp on large screens.
