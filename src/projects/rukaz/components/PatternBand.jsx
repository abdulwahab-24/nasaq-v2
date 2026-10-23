import { useLayoutEffect, useRef } from 'react';
import { gsap, MOTION_OK } from '../../../motion/gsap';

/*
 * Rukaz signature (strata) — the pattern as a band that travels with the scroll.
 * The tile is lifted from the supplied pattern page (sig.pattern) and used as a mask.
 *
 *   PatternBand  the band itself (also used throughout RukazPage)
 *   ChapterBand  homepage slot (home.slots.type): the band behind the mug
 */
export function PatternBand({ tile, rows = 6, className = '' }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        root.querySelector('.band__run'),
        { xPercent: 0 },
        {
          xPercent: -16,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <div className={`band ${className}`} ref={ref} aria-hidden="true" style={{ '--band-tile': `url(${tile.src})`, '--band-rows': rows }}>
      <span className="band__run" />
    </div>
  );
}

export function ChapterBand({ project }) {
  return <PatternBand tile={project.sig.pattern} className="type__band" />;
}
