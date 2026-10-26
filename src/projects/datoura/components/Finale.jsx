import { useLayoutEffect, useRef } from 'react';
import { MOTION_OK } from '../../../motion/gsap';
import { DT, gsap } from '../datoura.motion';
import Art from './Art';

/*
 * The last moment: the tagline lockup (artboard 13: the symbol and "From
 * Numbers / to Vision", in the identity's own type) on Electric Violet, the colour
 * at the centre of every graduated wave. Arriving, the rings settle from the
 * inside out and the two lines rise into place; then everything rests.
 */
export default function Finale({ project }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(rootRef);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(rootRef);
      const rings = q('[data-role="ring"]'); // outermost first
      const tl = gsap.timeline({
        paused: true,
        scrollTrigger: { trigger: rootRef.current, start: 'top 55%', once: true, onEnter: () => tl.play() },
      });
      tl.fromTo(
        rings.reverse(),
        { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' },
        { opacity: 1, scale: 1, duration: 0.9, ease: DT.ease, stagger: 0.12 },
      ).fromTo(
        [q('[data-role="line-1"]'), q('[data-role="line-2"]')],
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8, ease: DT.ease, stagger: 0.12 },
        0.35,
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="dt-end" ref={rootRef} aria-label={project.copy.tagline}>
      {/* the artboard sets symbol and words far apart on a strip; here one stands over the other */}
      <Art name="tagline" only={(r) => r === 'ring'} fit={2} className="dt-end__symbol" />
      <Art name="tagline" only={(r) => r !== 'ring'} fit={2} className="dt-end__words" label={project.copy.tagline} />
    </section>
  );
}
