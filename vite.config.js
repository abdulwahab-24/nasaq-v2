import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/*
 * Production URLs. Social cards and search engines need absolute addresses, and
 * the domain is only known at deploy time:
 *
 *   SITE_URL=https://example.com npm run build
 *
 * With it set, the build writes absolute og/twitter image URLs, a canonical
 * link and og:url into index.html, plus sitemap.xml (and its robots.txt line).
 * Without it the build is unchanged.
 */
function siteUrl() {
  const base = (process.env.SITE_URL ?? '').replace(/\/+$/, '')
  let outDir = 'dist'
  return {
    name: 'nasaq-site-url',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    transformIndexHtml(html) {
      if (!base) return html
      return html
        .replaceAll('content="/og.jpg"', `content="${base}/og.jpg"`)
        .replace(
          '<meta property="og:type"',
          `<link rel="canonical" href="${base}/" />\n    <meta property="og:url" content="${base}/" />\n    <meta property="og:type"`,
        )
    },
    closeBundle() {
      if (!base) return
      const data = fs.readFileSync(path.resolve('src/data/projects.js'), 'utf8')
      const slugs = [...data.matchAll(/^\s{4}slug: '([^']+)'/gm)].map((m) => m[1])
      const urls = ['/', ...slugs.map((s) => `/work/${s}`)]
      const xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join('\n') +
        '\n</urlset>\n'
      fs.writeFileSync(path.resolve(outDir, 'sitemap.xml'), xml)
      fs.appendFileSync(path.resolve(outDir, 'robots.txt'), `\nSitemap: ${base}/sitemap.xml\n`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteUrl()],
})
