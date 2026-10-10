import { ScrollTrigger } from '../motion/gsap';
import { scrollToY } from '../motion/lenis';

/*
 * Scroll to a homepage section by id and move focus to it for keyboard and
 * screen-reader users. When the opening is pinned (desktop), the work is
 * fully revealed at the end of the pin, not at #work's layout position.
 */
export function scrollToSection(id, { instant = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return;

  let top;
  const opening = id === 'work' ? ScrollTrigger.getById('opening') : null;
  if (opening) top = opening.end;
  else top = el.getBoundingClientRect().top + window.scrollY;

  scrollToY(top, { instant });

  const target = el.matches('[tabindex]') ? el : el.querySelector('[tabindex="-1"]');
  target?.focus({ preventScroll: true });
}
