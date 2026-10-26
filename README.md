# NASAQ — نسق

Website for NASAQ, an independent brand identity studio for brands in Saudi Arabia and beyond. React + Vite + GSAP, plain CSS.

## Run

```bash
npm install
npm run dev       # local development
npm run lint
npm run build     # production build → dist/
npm run preview   # serve the build locally
```

**Working on the code?** See [DEVELOPMENT.md](DEVELOPMENT.md): source structure, a quick edit
map (colours, fonts, sections, contact details, projects), how to add a project, routing,
animation, assets and deployment. Brand rules and approved copy are in `CLAUDE.md`.

## Deployment

Static build, deployed on Vercel (`vercel.json`); Netlify fallback in `public/_redirects`.
Build with `SITE_URL=https://your-domain npm run build` for absolute share URLs and a sitemap.

## Before public launch

- **ABC Favorit Arabic** files are *Trial* builds — replace with licensed web fonts
  (same family name and weights in `src/styles/typography.css`).
- Build with the production domain (`SITE_URL`, above). Without it the build still works,
  but link previews may show no image.
- Project pages set their title/description in the browser. Crawlers that do not run
  JavaScript see the homepage's; pre-render the routes if per-project link previews matter.
