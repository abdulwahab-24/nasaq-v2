import { useLayoutEffect, useRef } from 'react';
import { gsap, LZ, MOTION_OK } from '../louiza.motion';

/*
 * Louiza signature (bloom): the leaf pattern grows from a single leaf.
 * One 5 × 5 plate of leaves, the supplied mark used as a CSS mask (sig.leaf; nothing
 * is redrawn), grown leaf by leaf from the lower corner as the plate scrolls in.
 */
const BLOOM = 5; // the identity's own pattern pages are 5 × 5

export default function Bloom({ mark, field, ink, className = '' }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const leaves = root.querySelectorAll('.bloom__leaf');
      gsap.from(leaves, {
        scale: 0,
        rotate: -24,
        opacity: 0,
        ease: LZ.grow,
        duration: 0.6,
        stagger: {
          each: 0.09,
          grid: [BLOOM, BLOOM],
          from: BLOOM * (BLOOM - 1),
        },
        scrollTrigger: {
          trigger: root,
          start: 'top 85%',
          end: 'center 40%',
          scrub: 1,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      className={`bloom ${className}`}
      ref={ref}
      aria-hidden="true"
      style={{
        '--bloom-field': field,
        '--bloom-ink': ink,
        '--bloom-mark': `url(${mark.src})`,
      }}
    >
      {Array.from({ length: BLOOM * BLOOM }, (_, i) => (
        <span key={i} className="bloom__leaf" />
      ))}
    </div>
  );
}
