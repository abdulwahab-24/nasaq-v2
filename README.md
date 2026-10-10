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

## Adding a project

1. Put the originals in `brand/work/<folder>`.
2. Add entries to `MANIFEST` in `scripts/build-media.mjs` (optional crop per image), then
   `npm i -D sharp` (if missing) and `node scripts/build-media.mjs work/<slug>`.
3. Add the project to `src/data/projects.js`. The homepage chapters, index, footer,
   project page and next-project links update automatically. `home.layout` picks one of
   `cinema | spread | type | mosaic`; `story` composes the project page from blocks.

Only facts present in the supplied material are written; unknown fields stay `null`.

## Deployment

Any static host. SPA fallback is included for Netlify (`public/_redirects`) and Vercel
(`vercel.json`). For other hosts, rewrite unknown paths to `/index.html`.

## Before public launch

- **ABC Favorit Arabic** files are *Trial* builds — replace with licensed web fonts
  (same family name and weights in `src/styles/fonts.css`).
- Add the production domain to `og:url` / a sitemap once known.
