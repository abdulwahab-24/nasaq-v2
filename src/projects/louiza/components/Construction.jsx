import { useLayoutEffect, useRef } from 'react';
import ResponsiveImage from '../../../components/ui/ResponsiveImage';
import { gsap, LZ, MOTION_OK, settle } from '../louiza.motion';
import Head from './Head';

/*
 * The construction page, opened through the mark's own shape. The mark has just
 * filled the screen; here a leaf (two opposite corners fully round) opens in the
 * middle of the Pacific Blue and widens until it is the whole page: the logo on its
 * grid of x.
 */
export default function Construction({ project }) {
  const rootRef = useRef(null);
  const { construction: copy } = project.copy;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const frame = root.querySelector('.lz-build__frame');
      settle(root.querySelectorAll('.lz-head > *'), root);
      gsap
        .timeline({
          scrollTrigger: {
            trigger: frame,
            start: 'top 90%',
            end: 'center 55%',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          frame,
          {
            clipPath: () => `inset(18% 32% 18% 32% round ${frame.offsetHeight * 0.4}px 0px)`,
          },
          { clipPath: 'inset(0% 0% 0% 0% round 0px 0px)', ease: LZ.grow },
        )
        .fromTo(frame.querySelector('img'), { scale: 1.2 }, { scale: 1, ease: 'none' }, 0);
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="lz-build" ref={rootRef} aria-labelledby="lz-build-title">
      <Head copy={copy} id="lz-build-title" />
      <figure className="lz-build__frame">
        <ResponsiveImage media={project.media.construction} sizes="100vw" />
      </figure>
    </section>
  );
}
