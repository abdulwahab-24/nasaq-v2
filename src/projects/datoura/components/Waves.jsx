import { useLayoutEffect, useRef } from 'react';
import { MOTION_OK } from '../../../motion/gsap';
import { boxOf, gsap } from '../datoura.motion';
import Art from './Art';

/*
 * The graduated waves (artboard 11): contour bands stepping from violet at the
 * centre to near-black at the edge, drawn on the near-black they dissolve into.
 * Crossing the screen, the bands arrive from the centre outward, one step at a
 * time, each settling into its place. On narrow screens the field on the left is
 * shown alone, larger.
 */
export default function Waves({ project }) {
  const rootRef = useRef(null);
  const artRef = useRef(null);
  const { waves } = project.copy;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const svg = artRef.current;
    const whole = svg.getAttribute('viewBox');
    const mm = gsap.matchMedia(root);

    mm.add('(max-width: 767.98px)', () => {
      svg.setAttribute('viewBox', boxOf(svg.querySelectorAll('[data-role="field"]'), 8).join(' '));
      return () => svg.setAttribute('viewBox', whole);
    });

    mm.add(MOTION_OK, () => {
      // drawn outermost first; arriving innermost first
      const groups = ['field', 'symbol'].map((role) => [...svg.querySelectorAll(`[data-role="${role}"]`)].reverse());
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 70%', end: 'center center', scrub: 0.6 },
      });
      groups.forEach((bands, g) => {
        bands.forEach((band, i) => {
          tl.fromTo(
            band,
            { opacity: 0, scale: 0.82, transformOrigin: '50% 50%' },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
            g * 0.15 + (i / bands.length) * 1.2,
          );
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="dt-waves" ref={rootRef} aria-labelledby="dt-waves-title">
      <Art name="waves" ref={artRef} className="dt-waves__art" label={waves.artLabel} />
      <div className="dt-waves__copy">
        <h2 className="dt-label" id="dt-waves-title">
          <span>{waves.label}</span>
          <span lang="ar" dir="rtl">
            {waves.labelAr}
          </span>
        </h2>
        <p className="dt-lede">{waves.text}</p>
      </div>
    </section>
  );
}
