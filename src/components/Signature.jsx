import { useLayoutEffect, useRef } from 'react';
import { gsap, MOTION_OK } from '../motion/gsap';

/*
 * Project signatures — interface pieces built from a project's own artwork
 * (see exportSignatures in scripts/build-media.mjs). Each project gets one:
 *
 *   spear   Rumh         the spearhead mark is the aperture work is seen through
 *   bloom   Louiza       the leaf pattern grows from a single leaf
 *   strata  Rukaz        the pattern band travels behind the object
 *   arcade  Snack Quest  pixel-stepped frames, stepped motion, the slogan ticker
 *
 * Shapes are the supplied artwork used as CSS masks — nothing is redrawn.
 * A project without a signature simply renders none of this.
 */

/* ---------- bloom: a plate of leaves that grows from one corner ---------- */
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

/* ---------- strata: the pattern as a band that travels with the scroll ---------- */
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

/* ---------- arcade: the slogan ticker, marching in steps ---------- */
export function Ticker({ strip, label, className = '' }) {
  return (
    <div
      className={`ticker ${className}`}
      role="img"
      aria-label={label}
      style={{ '--ticker-img': `url(${strip.src})`, '--ticker-ratio': strip.width / strip.height }}
    >
      <span className="ticker__run" />
    </div>
  );
}
