/*
 * Rukaz in the Selected Work sequence: steadiness and repetition.
 * Its field is laid down in strata, band by band from the ground up. The
 * symbol's four pieces then lock together, and both wordmarks rise from one
 * fixed baseline, the Latin letter by letter, like layers settling. While it
 * holds, nothing moves: that is the identity. Leaving, the letters sink back
 * below their baseline and the pieces part.
 * Timeline API: sections/SelectedWork/sequence.js.
 */
const BANDS = 6;
const PIECES = { 'piece-tl': [-1, -1], 'piece-tr': [1, -1], 'piece-bl': [-1, 1], 'piece-br': [1, 1] };
const LATIN = ['latin-0', 'latin-1', 'latin-2', 'latin-3', 'latin-4'];

// a wordmark rising from (or sinking below) the baseline it stands on
const below = (s, name) => ({ clipPath: 'inset(0% 0% 100% 0%)', y: () => s.u(s.box(name)[3]) });
const onLine = { clipPath: 'inset(0% 0% 0% 0%)', y: 0 };

export default {
  // the field is drawn as bands, so it can be laid down one stratum at a time
  setup({ field }) {
    const colour = getComputedStyle(field).backgroundColor;
    field.style.background = 'none';
    const bands = Array.from({ length: BANDS }, (_, i) => {
      const band = document.createElement('span');
      band.className = 'seq__band';
      band.style.cssText = `top:${(100 / BANDS) * (BANDS - 1 - i)}%;height:${100 / BANDS + 0.2}%;background:${colour}`;
      field.append(band);
      return band;
    });
    return {
      bands,
      cleanup: () => {
        bands.forEach((b) => b.remove());
        field.style.background = '';
      },
    };
  },

  reveal({ tl, setup }, at) {
    setup.bands.forEach((band, i) => {
      tl.fromTo(
        band,
        { scaleY: 0, transformOrigin: '50% 100%' },
        { scaleY: 1, duration: 0.36, ease: 'power2.out' },
        at + i * 0.09,
      );
    });
  },

  enter(s, at) {
    const { tl, part, u } = s;
    Object.entries(PIECES).forEach(([name, [dx, dy]]) => {
      tl.fromTo(
        part(name),
        { x: () => dx * u(150), y: () => dy * u(150), autoAlpha: 0 },
        { x: 0, y: 0, autoAlpha: 1, duration: 0.55, ease: 'power3.inOut' },
        at,
      );
    });
    tl.fromTo(part('ar'), below(s, 'ar'), { ...onLine, duration: 0.4, ease: 'power2.out' }, at + 0.45);
    LATIN.forEach((name, i) => {
      tl.fromTo(part(name), below(s, name), { ...onLine, duration: 0.3, ease: 'power2.out' }, at + 0.55 + i * 0.06);
    });
  },

  leave(s, at) {
    const { tl, part, u } = s;
    [...LATIN].reverse().forEach((name, i) => {
      tl.to(part(name), { ...below(s, name), duration: 0.25, ease: 'power2.in' }, at + i * 0.04);
    });
    tl.to(part('ar'), { ...below(s, 'ar'), duration: 0.3, ease: 'power2.in' }, at + 0.1);
    Object.entries(PIECES).forEach(([name, [dx, dy]]) => {
      tl.to(
        part(name),
        { x: () => dx * u(150), y: () => dy * u(150), autoAlpha: 0, duration: 0.45, ease: 'power3.in' },
        at + 0.2,
      );
    });
  },
};
