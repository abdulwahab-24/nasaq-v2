import { useLayoutEffect, useRef } from 'react';
import { BlockLabel } from '../../../components/projects/story/Frame';
import { gsap, MOTION_OK } from '../../../motion/gsap';

/*
 * Louiza signature (bloom) — the leaf pattern grows from a single leaf.
 * The leaf is the supplied mark used as a CSS mask (sig.leaf); nothing is redrawn.
 *
 *   Bloom         one 5 × 5 plate of leaves, grown on scroll
 *   BloomBlock    story block `bloom`: the pattern page, rebuilt live
 *   ChapterBloom  homepage slot (home.slots.spread): the plate leaning on the cover
 */
const BLOOM = 5; // the identity's own pattern pages are 5 × 5

export function Bloom({ mark, field, ink, className = '' }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const leaves = root.querySelectorAll('.bloom__leaf');
      gsap.from(leaves, {
        scale: 0,
        rotate: -28,
        ease: 'back.out(1.6)',
        duration: 0.5,
        stagger: { each: 0.09, grid: [BLOOM, BLOOM], from: BLOOM * (BLOOM - 1) },
        scrollTrigger: { trigger: root, start: 'top 82%', end: 'center 45%', scrub: 0.6 },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      className={`bloom ${className}`}
      ref={ref}
      aria-hidden="true"
      style={{ '--bloom-field': field, '--bloom-ink': ink, '--bloom-mark': `url(${mark.src})` }}
    >
      {Array.from({ length: BLOOM * BLOOM }, (_, i) => (
        <span key={i} className="bloom__leaf" />
      ))}
    </div>
  );
}

export function BloomBlock({ block, project }) {
  const mark = project.sig?.leaf;
  if (!mark) return null;
  return (
    <section className="pb pb--bloom" aria-label={block.label}>
      <BlockLabel label={block.label} labelAr={block.labelAr} />
      <div className="pbloom" role="img" aria-label={`${project.name} leaf pattern`}>
        {block.plates.map((plate) => (
          <Bloom key={plate.field} mark={mark} {...plate} />
        ))}
      </div>
    </section>
  );
}

export function ChapterBloom({ project }) {
  const mark = project.sig?.leaf;
  if (!mark || !project.home?.bloom) return null;
  return <Bloom mark={mark} {...project.home.bloom} className="spread__bloom" />;
}
