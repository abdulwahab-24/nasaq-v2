import { useLayoutEffect, useRef } from 'react';
import { MOTION_OK } from '../../../motion/gsap';
import { boxOf, DT, gsap } from '../datoura.motion';
import art from '../art.json';
import Art from './Art';

/*
 * The idea: three drawings from the concept artboard (a shield, graduated sound
 * waves, the arc of a chart) become the symbol, and the symbol becomes the lockup.
 *
 * Both artboards share one coordinate space, so with motion the two drawings are
 * laid over each other and the section holds the screen while the scroll turns one
 * into the other: the captions step back, the shield is morphed into the symbol's
 * outer contour, the wave bars fold into the middle ring, the arc winds itself into
 * the inner ring, then the wordmark is written where the three ideas stood and the
 * construction lines are drawn through it. Without motion the two drawings simply
 * follow each other.
 */
const UNION = [530, 405, 860, 590]; // both drawings, with room for the captions
const pct = (v, from, size) => `${(((v - from) / size) * 100).toFixed(3)}%`;

export default function Idea({ project }) {
  const rootRef = useRef(null);
  const conceptRef = useRef(null);
  const lockupRef = useRef(null);
  const { idea } = project.copy;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const concept = conceptRef.current;
    const lockup = lockupRef.current;
    const [cx, cy, cw, ch] = art.concept.viewBox;
    const own = { concept: [cx, cy, cw, ch + 70], lockup: art.lockup.viewBox };

    // each caption under its own drawing, in the units of whichever viewBox is in use
    const place = (vb) => {
      root.querySelectorAll('.dt-idea__cap').forEach((cap, i) => {
        const [x, y, w, h] = boxOf(concept.querySelectorAll(`[data-col="${i}"]`));
        cap.style.setProperty('--x', pct(x + w / 2, vb[0], vb[2]));
        cap.style.setProperty('--y', pct(y + h + 14, vb[1], vb[3]));
      });
    };
    const view = (vbConcept, vbLockup) => {
      concept.setAttribute('viewBox', vbConcept.join(' '));
      lockup.setAttribute('viewBox', vbLockup.join(' '));
      place(vbConcept);
    };
    view(own.concept, own.lockup);

    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      root.classList.add('dt-idea--staged');
      view(UNION, UNION);
      const c = gsap.utils.selector(concept);
      const l = gsap.utils.selector(lockup);
      const [shield] = c('[data-role="shield"]');
      const bars = c('[data-role="bar"]');
      const arc = c('[data-role="arc"]');
      const [outer, middle, inner] = l('[data-role="ring"]');
      const centre = (els) => {
        const [x, y, w, h] = boxOf(els);
        return [x + w / 2, y + h / 2];
      };
      const toward = (from, to) => {
        const [a, b] = [centre(from), centre(to)];
        return { x: b[0] - a[0], y: b[1] - a[1] };
      };

      gsap.set(outer, { opacity: 0 }); // the shield becomes it
      gsap.set([middle, inner], { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' });
      gsap.set(l('[data-role="letter"]'), { opacity: 0, x: -40 });
      gsap.set(l('[data-role="guide"]'), { drawSVG: '0%' });
      gsap.set([l('[data-role="line"]'), root.querySelector('.dt-idea__after')], { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: { trigger: root, start: 'top top', end: '+=170%', pin: true, scrub: 0.6 },
      });
      tl.to([c('[data-role="plus"], [data-role="title"], [data-role="note"]'), root.querySelectorAll('.dt-idea__cap')], { opacity: 0, duration: 0.14 }, 0)
        .to(shield, { morphSVG: { shape: outer, map: 'size' }, fill: '#f4f4f4', duration: 0.42 }, 0.1)
        .to(bars, { ...toward(bars, [middle]), scaleY: 0, transformOrigin: '50% 50%', duration: 0.36, stagger: 0.012 }, 0.12)
        .to(middle, { opacity: 1, scale: 1, duration: 0.3, ease: DT.ease }, 0.32)
        .to(arc, { ...toward(arc, [inner]), drawSVG: '100% 100%', duration: 0.38 }, 0.16)
        .to(inner, { opacity: 1, scale: 1, duration: 0.3, ease: DT.ease }, 0.4)
        .to(l('[data-role="letter"]'), { opacity: 1, x: 0, duration: 0.24, stagger: 0.035, ease: DT.ease }, 0.56)
        .to(l('[data-role="guide"]'), { drawSVG: '100%', duration: 0.3, stagger: 0.025, ease: 'none' }, 0.72)
        .to([l('[data-role="line"]'), root.querySelector('.dt-idea__after')], { opacity: 1, y: 0, duration: 0.2, ease: DT.ease }, 0.9)
        .to(l('[data-role="guide"]'), { opacity: 0.4, duration: 0.15 }, 1.05);

      return () => {
        root.classList.remove('dt-idea--staged');
        view(own.concept, own.lockup);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="dt-idea" ref={rootRef} aria-labelledby="dt-idea-title">
      <div className="dt-idea__stage">
        <p className="dt-label">
          <span>{idea.label}</span>
          <span lang="ar" dir="rtl">
            {idea.labelAr}
          </span>
        </p>

        <div className="dt-idea__art">
          <div className="dt-idea__panel">
            <Art name="concept" ref={conceptRef} className="dt-idea__concept" label={idea.conceptLabel} />
            <ol className="dt-idea__caps">
              {idea.captions.map(([title, note]) => (
                <li key={title} className="dt-idea__cap">
                  <span>{title}</span>
                  {note}
                </li>
              ))}
            </ol>
          </div>
          <Art name="lockup" ref={lockupRef} className="dt-idea__lockup" label={idea.lockupLabel} />
        </div>

        <div className="dt-idea__after">
          <h2 className="dt-idea__title" id="dt-idea-title">
            {idea.title}
          </h2>
          <p>{idea.line}</p>
        </div>
      </div>
    </section>
  );
}
