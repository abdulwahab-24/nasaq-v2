import { useLayoutEffect, useRef } from 'react';
import { MOTION_OK, ScrollTrigger } from '../../../motion/gsap';
import { gsap } from '../datoura.motion';
import Art from './Art';

/*
 * Typography, as the typography artboard pairs it: Brando Arabic on the deep
 * violet, DM Sans on Electric Violet. أب is drawn from the artboard itself (Brando
 * Arabic was not supplied as a font, so its letterforms come as vector); Aa is set
 * live in DM Sans from the supplied files. Crossing the section, both step through
 * their weights together, Thin to Black, a step at a time.
 */
const STEPS = 5;

export default function Type({ project }) {
  const rootRef = useRef(null);
  const { type } = project.copy;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const step = (w) => (root.dataset.w = String(w));
      step(0);
      ScrollTrigger.create({
        trigger: root,
        start: 'top 55%',
        end: 'bottom 70%',
        onUpdate: (self) => step(Math.min(STEPS - 1, Math.floor(self.progress * STEPS))),
      });
      return () => step(STEPS - 1);
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="dt-type" ref={rootRef} data-w={STEPS - 1} aria-labelledby="dt-type-title">
      <h2 className="visually-hidden" id="dt-type-title">
        {type.label}
      </h2>
      {type.faces.map((face, side) => (
        <div key={face.name} className={`dt-type__half dt-type__half--${side ? 'latin' : 'arabic'}`}>
          <p className="dt-label">
            <span>{face.name}</span>
          </p>
          {side ? (
            <p className="dt-type__glyph" aria-hidden="true">
              Aa
            </p>
          ) : (
            <Art name="arabic" className="dt-type__glyph dt-type__glyph--ar" label="أب" />
          )}
          <ol className="dt-type__weights">
            {face.weights.map((w, i) => (
              <li key={w} data-step={i}>
                {w}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}
