import { useEffect } from 'react';
import { site } from '../data/site';

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

// Per-route document title, description and Open Graph basics.
export default function useMeta({ title, description = site.description, image } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — NASAQ نسق` : site.title;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
    if (image) {
      const abs = new URL(image, window.location.origin).href;
      setMeta('meta[property="og:image"]', 'content', abs);
      setMeta('meta[name="twitter:image"]', 'content', abs);
    }
  }, [title, description, image]);
}
