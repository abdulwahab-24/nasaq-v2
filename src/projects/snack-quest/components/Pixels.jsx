import { useLayoutEffect, useRef } from 'react';
import { gsap, MOTION_OK, pixelCover } from '../snack-quest.motion';

/*
 * A picture's way onto the page: a cover of square pixels in the section's colour,
 * taken away pixel by pixel as the picture comes up the screen (at the pace of the
 * scroll, so it can be played backwards). Under reduced motion there is no cover.
 * Place inside a positioned frame.
 */
export default function Pixels({ colour, cells = 14 }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    const host = canvas.parentElement;
    const mm = gsap.matchMedia(canvas);
    mm.add(MOTION_OK, () => {
      const cover = pixelCover(canvas, colour, cells);
      const ro = new ResizeObserver(() => cover.fit());
      ro.observe(host);
      gsap.to(cover.state, {
        p: 1,
        ease: 'none',
        onUpdate: cover.draw,
        scrollTrigger: { trigger: host, start: 'top 88%', end: 'top 35%', scrub: true },
      });
      return () => ro.disconnect();
    });
    return () => mm.revert();
  }, [colour, cells]);

  return <canvas className="sq-pixels" ref={ref} aria-hidden="true" />;
}
