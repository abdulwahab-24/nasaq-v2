import { useLayoutEffect, useRef } from 'react';
import { gsap, MOTION_OK, NB, octagon } from '../nurba.motion';

/*
 * The seven colours as the facets of a step-cut stone: concentric octagons in the
 * colour board's own order, its deepest navy outside and gold at the table. They
 * are cut one after another from the outside in as the section comes up, each line
 * of the list arriving with its facet. The values are the board's.
 */
const rings = Array.from({ length: 7 }, (_, i) => 100 * (1 - i * 0.125));

export default function Colour({ project }) {
  const rootRef = useRef(null);
  const { colour: copy } = project.copy;
  const { colours } = project.identity;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        defaults: { ease: NB.set },
        scrollTrigger: { trigger: root, start: 'top 70%', end: 'center 45%', scrub: 0.8 },
      });
      q('.nb-colour__facet').forEach((el, i) => {
        tl.from(el, { scale: 0.86, opacity: 0, svgOrigin: '0 0', duration: 0.3 }, i * 0.1);
      });
      q('.nb-colour__item').forEach((el, i) => {
        tl.from(el, { opacity: 0, y: 10, duration: 0.25 }, 0.05 + i * 0.1);
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="nb-colour" ref={rootRef} aria-labelledby="nb-colour-title">
      <header className="nb-colour__head">
        <p className="nb-label">
          <span>{copy.label}</span>
          <span lang="ar" dir="rtl">
            {copy.labelAr}
          </span>
        </p>
        <h2 className="nb-colour__text" id="nb-colour-title">
          {copy.text}
        </h2>
      </header>

      <svg className="nb-colour__stone" viewBox="-102 -102 204 204" aria-hidden="true" focusable="false">
        {rings.map((r, i) => (
          <polygon
            key={colours[i].hex}
            className="nb-colour__facet"
            points={octagon(0, 0, r)
              .map((p) => p.join(','))
              .join(' ')}
            fill={colours[i].hex}
          />
        ))}
      </svg>

      <ol className="nb-colour__list">
        {colours.map((c) => (
          <li key={c.hex} className="nb-colour__item">
            <span className="nb-colour__chip" style={{ background: c.hex }} />
            <span className="nb-colour__hex">{c.hex}</span>
            <span className="nb-colour__val">RGB {c.rgb}</span>
            <span className="nb-colour__val">CMYK {c.cmyk}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
