import { useEffect } from 'react';
import { site } from '../data/siteConfig';

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

// Find or create a <meta>/<link> in the head.
function ensure(tag, attr, name) {
  let el = document.head.querySelector(`${tag}[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement(tag);
    el.setAttribute(attr, name);
    document.head.append(el);
  }
  return el;
}

// Per-route document title, description, canonical URL and Open Graph basics.
// `noindex` keeps a page (the 404, which is served with a 200) out of search results.
export default function useMeta({ title, description = site.description, image, noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${site.titleSuffix}` : site.title;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);

    const url = window.location.origin + window.location.pathname;
    ensure('link', 'rel', 'canonical').setAttribute('href', url);
    ensure('meta', 'property', 'og:url').setAttribute('content', url);

    const abs = new URL(image ?? site.ogImage, window.location.origin).href;
    setMeta('meta[property="og:image"]', 'content', abs);
    setMeta('meta[name="twitter:image"]', 'content', abs);

    const robots = document.head.querySelector('meta[name="robots"]');
    if (noindex) ensure('meta', 'name', 'robots').setAttribute('content', 'noindex');
    else robots?.remove();
  }, [title, description, image, noindex]);
}
