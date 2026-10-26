/*
 * Louiza in the Selected Work sequence: a bloom.
 * The tall leaf grows up out of its foot, the small leaf unfolds from the stem,
 * then the Arabic wordmark is written in from right to left, the way it reads.
 * While it holds, the leaves sway a little with the scroll. Leaving, the leaves
 * fold back into the stem and the writing runs on out of view to the left.
 * Timeline API: sections/SelectedWork/sequence.js.
 */
export default {
  enter({ tl, part }, at) {
    const big = part('leafBig');
    const small = part('leafSmall');
    tl.set(big, { transformOrigin: '62% 100%' }, at)
      .set(small, { transformOrigin: '2% 92%' }, at)
      .fromTo(
        big,
        { scaleY: 0, scaleX: 0.5, autoAlpha: 0 },
        {
          scaleY: 1,
          scaleX: 1,
          autoAlpha: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        at,
      )
      .fromTo(
        small,
        { rotate: -75, scale: 0.15, autoAlpha: 0 },
        {
          rotate: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.5,
          ease: 'back.out(1.6)',
        },
        at + 0.32,
      )
      .fromTo(
        part('word'),
        { clipPath: 'inset(0% 0% 0% 100%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power1.inOut' },
        at + 0.5,
      );
  },

  hold({ tl, part }, at, duration) {
    const half = duration / 2;
    tl.to(part('leafBig'), { rotate: 2.5, duration: half, ease: 'sine.inOut' }, at)
      .to(part('leafBig'), { rotate: 0, duration: half, ease: 'sine.inOut' }, at + half)
      .to(part('leafSmall'), { rotate: -7, duration: half, ease: 'sine.inOut' }, at)
      .to(part('leafSmall'), { rotate: 0, duration: half, ease: 'sine.inOut' }, at + half);
  },

  leave({ tl, part }, at) {
    tl.to(
      part('leafSmall'),
      {
        rotate: -75,
        scale: 0.15,
        autoAlpha: 0,
        duration: 0.4,
        ease: 'power2.in',
      },
      at,
    )
      .to(
        part('leafBig'),
        {
          scaleY: 0,
          scaleX: 0.5,
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power2.in',
        },
        at + 0.1,
      )
      .to(part('word'), { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.45, ease: 'power1.in' }, at + 0.05);
  },
};
