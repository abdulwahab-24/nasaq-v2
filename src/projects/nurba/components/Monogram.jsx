import { useLayoutEffect, useRef } from 'react';
import { applyMask, COLOURS, gsap, LOGO, MOTION_OK, NB, STEM, traceMask } from '../nurba.motion';

/*
 * The monogram, taken apart in three steps while the section holds the screen,
 * navy on cream and as large as the screen allows:
 *   01  the two lines of the octagon are traced again in gold, outer then inner
 *   02  N and B step back: the stroke they share is lit
 *   03  the glint flares on the upper-left facet
 * Every piece is the traced logo (public/work/nurba/parts): NB is shown as three
 * cuts of the one part (N, the shared stem, B) that meet exactly.
 */
const [MW] = [LOGO.parts['ring-0'][2]];
const box = ([x, y, w, h]) => ({
  left: `${(x / MW) * 100}%`,
  top: `${(y / MW) * 100}%`,
  width: `${(w / MW) * 100}%`,
  height: `${(h / MW) * 100}%`,
});
const src = (name) => ({ '--src': `url(/work/nurba/parts/${name}.png)` });
const NB_BOX = LOGO.parts.nb;
// N up to the stem, the stem, B after it
const cutN = `inset(-2% ${(1 - STEM[0]) * 100 - 0.4}% -2% -2%)`; // a hair of overlap: no seam
const cutB = `inset(-2% -2% -2% ${STEM[1] * 100 - 0.4}%)`;
const cutStem = `inset(-2% ${(1 - STEM[1]) * 100}% -2% ${STEM[0] * 100}%)`;

export default function Monogram({ project }) {
  const rootRef = useRef(null);
  const { monogram: copy } = project.copy;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      const gold = q('.nb-mono__gold');
      gold.forEach((el) => applyMask(el, traceMask('var(--src)')));
      gsap.set(gold, { '--nb-trace': '0deg' });
      gsap.set(q('.nb-mono__step:not(:first-child)'), { opacity: 0, y: 14 });
      gsap.set(q('.nb-mono__stem'), { opacity: 0 });
      gsap.set(q('.nb-mono .nb-glint'), { opacity: 0, scale: 0 });

      const steps = q('.nb-mono__step');
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root, start: 'top top', end: '+=220%', pin: true, scrub: 0.8 },
      });
      // 01 — two lines
      tl.to(gold[0], { '--nb-trace': '360deg', duration: 0.18, ease: NB.trace }, 0.02)
        .to(gold[1], { '--nb-trace': '360deg', duration: 0.18, ease: NB.trace }, 0.08)
        .to(steps[0], { opacity: 0, y: -14, duration: 0.05 }, 0.3)
        .to(gold, { opacity: 0, duration: 0.06 }, 0.3)
        // 02 — one stem
        .to(steps[1], { opacity: 1, y: 0, duration: 0.05 }, 0.35)
        .to(q('.nb-mono__n, .nb-mono__b'), { opacity: 0.18, duration: 0.08, ease: 'power2.inOut' }, 0.37)
        .to(q('.nb-mono__stem'), { opacity: 1, duration: 0.08, ease: 'power2.inOut' }, 0.4)
        .to(q('.nb-mono__n, .nb-mono__b'), { opacity: 1, duration: 0.08, ease: 'power2.inOut' }, 0.56)
        .to(steps[1], { opacity: 0, y: -14, duration: 0.05 }, 0.64)
        .to(q('.nb-mono__stem'), { opacity: 0, duration: 0.06 }, 0.66)
        // 03 — one glint
        .to(steps[2], { opacity: 1, y: 0, duration: 0.05 }, 0.69)
        .to(q('.nb-mono .nb-glint'), { opacity: 1, scale: 1, duration: 0.1, ease: 'power2.out' }, 0.72)
        .to(q('.nb-mono .nb-glint'), { opacity: 0.85, scale: 0.8, duration: 0.12, ease: 'power2.inOut' }, 0.84)
        .to({}, { duration: 0.04 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="nb-mono" ref={rootRef} aria-labelledby="nb-mono-title">
      <div className="nb-mono__text">
        <p className="nb-label">
          <span>{copy.label}</span>
          <span lang="ar" dir="rtl">
            {copy.labelAr}
          </span>
        </p>
        <h2 className="visually-hidden" id="nb-mono-title">
          {copy.label}
        </h2>
        <ol className="nb-mono__steps">
          {copy.steps.map((s) => (
            <li key={s.n} className="nb-mono__step">
              <span className="nb-mono__n-label">{s.n}</span>
              <span className="nb-mono__title">{s.title}</span>
              <span className="nb-mono__desc">{s.text}</span>
            </li>
          ))}
        </ol>
      </div>

      <div
        className="nb-mono__art"
        role="img"
        aria-label="The NURBA monogram: N and B sharing one stem inside an octagon of two lines"
      >
        <span className="nb-mono__piece" style={{ ...box(LOGO.parts['ring-0']), ...src('ring-0') }} />
        <span className="nb-mono__piece" style={{ ...box(LOGO.parts['ring-1']), ...src('ring-1') }} />
        <span className="nb-mono__piece nb-mono__gold" style={{ ...box(LOGO.parts['ring-0']), ...src('ring-0') }} />
        <span className="nb-mono__piece nb-mono__gold" style={{ ...box(LOGO.parts['ring-1']), ...src('ring-1') }} />
        <span className="nb-mono__piece nb-mono__n" style={{ ...box(NB_BOX), ...src('nb'), clipPath: cutN }} />
        <span className="nb-mono__piece nb-mono__b" style={{ ...box(NB_BOX), ...src('nb'), clipPath: cutB }} />
        <span className="nb-mono__piece" style={{ ...box(NB_BOX), ...src('nb'), clipPath: cutStem }} />
        <span
          className="nb-mono__piece nb-mono__stem"
          style={{ ...box(NB_BOX), ...src('nb'), clipPath: cutStem, color: COLOURS.gold }}
        />
        <span className="nb-mono__glint" style={box([6, 6, 92, 92])}>
          <span className="nb-glint" />
        </span>
      </div>
    </section>
  );
}
