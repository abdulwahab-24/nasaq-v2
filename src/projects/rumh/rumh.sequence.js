/*
 * Rumh in the Selected Work sequence: precision hits the target.
 * The spearhead is thrown in along its own axis (its point is the mark's top-left
 * corner, so it flies up and to the left) and lands exactly on its place; the
 * wordmark is cut open from it. While it holds, the whole logo keeps aiming, a
 * few pixels further along the same line (mark and wordmark never part at rest).
 * Leaving, the throw carries on out of frame, the wordmark is drawn after it, and
 * the next identity's field follows the spear in along the same diagonal (Rumh
 * hands off: it opens the next scene itself).
 * Timeline API: sections/SelectedWork/sequence.js.
 */
export default {
  handoff: true,

  enter({ tl, part }, at) {
    tl.fromTo(
      part('mark'),
      { x: () => innerWidth * 0.55, y: () => innerHeight * 0.42, scale: 1.3, autoAlpha: 0 },
      { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.6, ease: 'power3.out' },
      at,
    ).fromTo(
      part('word'),
      { clipPath: 'inset(0% 100% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power2.out' },
      at + 0.42,
    );
  },

  hold({ tl, logo, u }, at, duration) {
    tl.to(logo, { x: () => -u(16), y: () => -u(6), duration, ease: 'none' }, at);
  },

  leave({ tl, part }, at, next) {
    tl.to(
      part('mark'),
      { x: () => -innerWidth * 0.8, y: () => -innerHeight * 0.7, scale: 1.5, duration: 0.6, ease: 'power2.in' },
      at,
    ).to(part('word'), { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.4, ease: 'power2.in' }, at + 0.12);
    if (next) {
      // the next field comes in behind the spear: a diagonal edge, square to its flight
      tl.fromTo(
        next.scene,
        { clipPath: 'polygon(100% 100%, 100% 100%, 100% 100%)' },
        { clipPath: 'polygon(100% 100%, -100% 100%, 100% -100%)', duration: 0.8, ease: 'power2.inOut' },
        at + 0.22,
      );
    }
  },
};
