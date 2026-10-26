/*
 * NURBA in the Selected Work sequence: a piece is set, catches the light, and is
 * closed into its setting.
 * Arriving, the four-point glint of the pattern flares at the frame's upper-left
 * facet and the two lines of the octagon are traced round from it, the outer line
 * a moment ahead of the inner; a band of light passes across the monogram and
 * reveals it; the five letters of NURBA come down into their places one by one and
 * نوربا is written in from the right. While it holds, nothing moves but one glint.
 * Leaving, the letters lift away and the Arabic is drawn back; the next identity's
 * field closes in round the monogram through an octagonal opening, holds it for a
 * moment like a stone in its setting, then closes over it (NURBA hands off: it opens
 * the next scene itself).
 * Timeline API: sections/SelectedWork/sequence.js.
 */
import { applyMask, clearMask, LOGO, NB, opening, traceMask, lightMask } from './nurba.motion';

const LETTERS = ['latin-0', 'latin-1', 'latin-2', 'latin-3', 'latin-4'];
const GOLD = '#E6B964';
// the glint sits on the frame's upper-left facet (logo canvas px), at about a tenth of the frame's size
const GLINT = { x: 52, y: 52, size: 92 };

export default {
  handoff: true,

  setup({ logo, part }) {
    const pct = (v, of) => `${((v / of) * 100).toFixed(4)}%`;
    const glint = document.createElement('span');
    glint.className = 'nb-glint';
    glint.setAttribute('aria-hidden', 'true');
    Object.assign(glint.style, {
      left: pct(GLINT.x - GLINT.size / 2, LOGO.width),
      top: pct(GLINT.y - GLINT.size / 2, LOGO.height),
      width: pct(GLINT.size, LOGO.width),
      height: pct(GLINT.size, LOGO.height),
      backgroundColor: GOLD,
    });
    logo.append(glint);
    const traced = [part('ring-0'), part('ring-1')];
    traced.forEach((el) => applyMask(el, traceMask('var(--lp-src)')));
    applyMask(part('nb'), lightMask('var(--lp-src)'));
    return {
      glint,
      cleanup() {
        glint.remove();
        [...traced, part('nb')].forEach(clearMask);
      },
    };
  },

  enter({ tl, part, u, setup: { glint } }, at) {
    tl.fromTo(glint, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: 'power2.out' }, at)
      .fromTo(
        part('ring-0'),
        { '--nb-trace': '0deg' },
        { '--nb-trace': '360deg', duration: 0.7, ease: NB.trace },
        at + 0.05,
      )
      .fromTo(
        part('ring-1'),
        { '--nb-trace': '0deg' },
        { '--nb-trace': '360deg', duration: 0.7, ease: NB.trace },
        at + 0.15,
      )
      .to(glint, { scale: 0.4, opacity: 0, duration: 0.3, ease: 'power2.in' }, at + 0.6)
      .fromTo(part('nb'), { '--nb-light': '0%' }, { '--nb-light': '112%', duration: 0.55, ease: NB.light }, at + 0.32);
    LETTERS.forEach((name, i) => {
      tl.fromTo(
        part(name),
        { y: () => -u(26), opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: NB.set },
        at + 0.45 + i * 0.07,
      );
    });
    tl.fromTo(
      part('ar'),
      { clipPath: 'inset(-10% -2% -10% 102%)' },
      { clipPath: 'inset(-10% -2% -10% -2%)', duration: 0.45, ease: NB.trace },
      at + 0.72,
    );
  },

  hold({ tl, setup: { glint } }, at, duration) {
    tl.to(glint, { scale: 1, opacity: 1, duration: 0.2, ease: 'power2.out' }, at + duration * 0.35).to(
      glint,
      { scale: 0.4, opacity: 0, duration: 0.3, ease: 'power2.in' },
      at + duration * 0.35 + 0.22,
    );
  },

  leave({ tl, scene, part, u, setup: { glint } }, at, next) {
    [...LETTERS].reverse().forEach((name, i) => {
      tl.to(part(name), { y: () => -u(18), opacity: 0, duration: 0.25, ease: 'power2.in' }, at + i * 0.04);
    });
    tl.to(part('ar'), { clipPath: 'inset(-10% 102% -10% -2%)', duration: 0.35, ease: NB.trace }, at);
    if (!next) {
      tl.to(part('nb'), { '--nb-light': '0%', duration: 0.4, ease: NB.light }, at + 0.1)
        .to(part('ring-1'), { '--nb-trace': '0deg', duration: 0.5, ease: NB.trace }, at + 0.2)
        .to(part('ring-0'), { '--nb-trace': '0deg', duration: 0.5, ease: NB.trace }, at + 0.3);
      return;
    }
    // the opening is measured on the monogram's outer frame, wherever the layout has put it
    const frame = () => {
      const s = scene.getBoundingClientRect();
      const r = part('ring-0').getBoundingClientRect();
      return {
        w: s.width,
        h: s.height,
        cx: r.left - s.left + r.width / 2,
        cy: r.top - s.top + r.height / 2,
        r: r.width / 2,
      };
    };
    const at0 = (k) => () => {
      const f = frame();
      const r = k === 'wide' ? Math.hypot(f.w, f.h) : k === 'set' ? f.r * 1.12 : 0;
      return opening(f.w, f.h, f.cx, f.cy, r);
    };
    tl.fromTo(
      next.scene,
      { clipPath: at0('wide') },
      { clipPath: at0('set'), duration: 0.5, ease: 'power2.inOut' },
      at + 0.1,
    )
      .to(glint, { scale: 1, opacity: 1, duration: 0.15, ease: 'power2.out' }, at + 0.52)
      .to(glint, { scale: 0.4, opacity: 0, duration: 0.2, ease: 'power2.in' }, at + 0.68)
      .to(next.scene, { clipPath: at0('shut'), duration: 0.4, ease: 'power3.in' }, at + 0.66)
      // once shut, the next scene is whole again (its clip removed, so nothing of it is cut)
      .set(next.scene, { clipPath: 'none' }, at + 1.07);
  },
};
