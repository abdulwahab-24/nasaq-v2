import { useLayoutEffect, useRef } from 'react';
import { BlockLabel } from '../../../components/projects/story/Frame';
import ResponsiveImage from '../../../components/ui/ResponsiveImage';
import { gsap, MOTION_OK } from '../../../motion/gsap';
import { inkOn } from '../../../utils/colour';
import { polygon, RECT, shapeIn } from '../../../utils/shape';

/*
 * Rumh signature (spear) — story block `aperture`.
 * The spearhead mark (theme.shape) is the aperture: it opens onto the
 * photograph as the page scrolls.
 */
export default function Aperture({ block, project }) {
  const rootRef = useRef(null);
  const { shape } = project.theme;

  useLayoutEffect(() => {
    if (!shape) return undefined;
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const frame = root.querySelector('.paperture__frame');
      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: 'top 75%', end: 'top top', scrub: 0.5, invalidateOnRefresh: true },
        })
        .fromTo(frame, { clipPath: () => shapeIn(frame, shape, 0.56) }, { clipPath: polygon(RECT), ease: 'power2.in' })
        .fromTo(frame.querySelector('img'), { scale: 1.25 }, { scale: 1, ease: 'none' }, 0);
    });
    return () => mm.revert();
  }, [shape]);

  return (
    <section className="pb pb--aperture" ref={rootRef} style={{ '--field': project.theme.surface, '--field-ink': inkOn(project.theme.surface) }}>
      <BlockLabel label={block.label} labelAr={block.labelAr} />
      <figure className="paperture__frame">
        <ResponsiveImage media={block.media} sizes="100vw" />
      </figure>
    </section>
  );
}
