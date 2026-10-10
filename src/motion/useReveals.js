import { useLayoutEffect } from 'react';
import { gsap, MOTION_OK } from './gsap';

/*
 * Declarative scroll reveals inside a root element.
 *
 *   data-reveal="lines"   masked lines (.line > span) rise into place
 *   data-reveal="up"      element rises and fades in
 *   data-reveal="clip"    cropped → revealed: the frame opens from a tight crop
 *                          while the image inside settles from a slight zoom
 *   data-parallax="n"     drifts by n × its height while crossing the viewport
 *
 * Nothing is hidden by CSS, so without JS or with reduced motion the final
 * state is simply shown.
 */
export default function useReveals(rootRef, deps = []) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const mm = gsap.matchMedia(root);

    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);

      q('[data-reveal="lines"]').forEach((el) => {
        gsap.from(el.querySelectorAll('.line > span'), {
          yPercent: 112,
          duration: 1.15,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      q('[data-reveal="up"]').forEach((el) => {
        gsap.from(el, {
          y: 48,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });

      q('[data-reveal="clip"]').forEach((el) => {
        const media = el.querySelector('img, video');
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        });
        tl.fromTo(
          el,
          { clipPath: 'inset(14% 18% 14% 18%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' },
        );
        if (media) tl.fromTo(media, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'expo.inOut' }, 0);
      });

      q('[data-parallax]').forEach((el) => {
        const amount = parseFloat(el.dataset.parallax) || 0.1;
        gsap.fromTo(
          el,
          { yPercent: amount * 100 },
          {
            yPercent: -amount * 100,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    });

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
