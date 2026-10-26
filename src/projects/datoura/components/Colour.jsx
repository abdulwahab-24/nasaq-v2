import { useLayoutEffect, useRef } from 'react';
import { MOTION_OK } from '../../../motion/gsap';
import { contourPolygon, coverScale, outerContour, SHUT } from '../contour';
import { gsap } from '../datoura.motion';
import Art from './Art';

/*
 * Colour. The six colours of the palette take the whole screen one after another,
 * from near-black to soft white, each carrying the symbol in the colour the palette
 * artboard pairs it with. With motion the section holds the screen and each colour
 * opens out of the symbol's own contour, from its centre, over the last one.
 * Without motion the six fields follow each other down the page.
 */
export default function Colour({ project }) {
  const rootRef = useRef(null);
  const { colour } = project.copy;
  const fields = project.palette;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      root.classList.add('dt-colour--staged');
      const layers = [...root.querySelectorAll('.dt-colour__field')];
      const { points } = outerContour();
      const opening = layers.slice(1);
      opening.forEach((el) => (el.style.clipPath = SHUT));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${opening.length * 70}%`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      opening.forEach((el, i) => {
        const state = { k: 0 };
        const draw = () => {
          if (state.k <= 0) {
            el.style.clipPath = SHUT;
            return;
          }
          // the symbol sits in the same place on every field
          const sym = el.querySelector('.dt-colour__symbol').getBoundingClientRect();
          const box = el.getBoundingClientRect();
          const cx = sym.left + sym.width / 2 - box.left;
          const cy = sym.top + sym.height / 2 - box.top;
          const max = coverScale(cx, cy, sym.width, sym.height, box.width, box.height);
          el.style.clipPath = contourPolygon(points, cx, cy, sym.width, sym.height, state.k * max);
        };
        tl.fromTo(state, { k: 0 }, { k: 1, duration: 1, ease: 'power2.in', onUpdate: draw }, i + 0.15);
      });
      tl.set({}, {}, opening.length + 0.15); // the last colour rests before the section moves on

      return () => {
        root.classList.remove('dt-colour--staged');
        opening.forEach((el) => (el.style.clipPath = ''));
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="dt-colour" ref={rootRef} aria-labelledby="dt-colour-title">
      <h2 className="visually-hidden" id="dt-colour-title">
        {colour.label}
      </h2>
      <div className="dt-colour__stage">
        {fields.map(({ hex, ink }) => (
          <div key={hex} className="dt-colour__field" style={{ '--field': hex, '--ink': ink }}>
            <p className="dt-label" aria-hidden="true">
              <span>{colour.label}</span>
              <span lang="ar" dir="rtl">
                {colour.labelAr}
              </span>
            </p>
            <Art name="lockup" only={(r) => r === 'ring'} paint={() => ({ fill: ink })} fit className="dt-colour__symbol" />
            <p className="dt-colour__hex">{hex}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
