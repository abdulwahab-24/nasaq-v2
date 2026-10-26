import { useLayoutEffect, useRef } from 'react';
import { ANGLE, gsap, MARK, MOTION_OK, pointsOf, RM, SQUARE } from '../rumh.motion';

/*
 * The mark, built the way the guidelines describe it: a square of right angles,
 * its upper-left corner raised into the head of a spear. The square is drawn as the
 * section comes up; then the section holds the screen while the corner rises, the
 * two new edges are carried out as construction lines, and the shape fills with red.
 * Below, the mark at falling sizes: it is drawn to stay clear when very small.
 */
const RAD = Math.PI / 180;
const REACH = 150;
// a line through the tip (0, 0) along `deg`, in both directions
const through = (deg) => {
  const [dx, dy] = [Math.cos(deg * RAD) * REACH, Math.sin(deg * RAD) * REACH];
  return { x1: -dx * 0.3, y1: -dy * 0.3, x2: dx, y2: dy };
};
const lerp = (a, b, t) => a + (b - a) * t;
const SIZES = [1, 0.5, 0.25, 0.125, 0.0625];

export default function Mark({ project }) {
  const rootRef = useRef(null);
  const { mark } = project.copy;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      root.classList.add('rm-mark--staged');
      const shapes = q('.rm-mark__outline, .rm-mark__fill');
      const corner = { t: 0 };
      // the upper-left corner travels from the square's corner to the spear's tip
      const raise = () => {
        const pts = SQUARE.map((p, i) =>
          i === 0 ? [lerp(p[0], MARK[0][0], corner.t), lerp(p[1], MARK[0][1], corner.t)] : p,
        );
        shapes.forEach((s) => s.setAttribute('points', pointsOf(pts)));
      };
      raise();
      // the square arrives drawn (when the section comes up); the hold raises its corner
      gsap.set(q('.rm-mark__guide--edge'), { drawSVG: '0%' });
      gsap.set(q('.rm-mark__fill'), { opacity: 0 });
      gsap.set(q('.rm-mark__step:not(:first-child)'), { opacity: 0, y: 14 });
      gsap.from(q('.rm-mark__outline, .rm-mark__guide--square'), {
        drawSVG: '0%',
        duration: 1.1,
        ease: 'power3.inOut',
        stagger: 0.08,
        scrollTrigger: { trigger: root, start: 'top 70%', once: true },
      });

      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.querySelector('.rm-mark__stage'),
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: RM.scrub,
          },
        })
        .to(q('.rm-mark__step')[0], { opacity: 0, y: -14, duration: 0.06 }, 0.24)
        .to(corner, { t: 1, duration: 0.3, ease: 'power3.inOut', onUpdate: raise }, 0.3)
        .to(q('.rm-mark__step')[1], { opacity: 1, y: 0, duration: 0.08 }, 0.38)
        .to(q('.rm-mark__guide--edge'), { drawSVG: '100%', duration: 0.16, stagger: 0.04, ease: 'power2.out' }, 0.56)
        .to(q('.rm-mark__guide--square'), { opacity: 0.25, duration: 0.1 }, 0.6)
        .to(q('.rm-mark__step')[1], { opacity: 0, y: -14, duration: 0.06 }, 0.66)
        .to(q('.rm-mark__fill'), { opacity: 1, duration: 0.1, ease: 'power2.out' }, 0.72)
        .to(q('.rm-mark__step')[2], { opacity: 1, y: 0, duration: 0.08 }, 0.74)
        .to({}, { duration: 0.2 });

      gsap.from(q('.rm-mark__scale li'), {
        scale: 0,
        transformOrigin: '0% 0%',
        duration: 0.6,
        ease: RM.throw,
        stagger: 0.07,
        scrollTrigger: { trigger: q('.rm-mark__scale'), start: 'top 80%', once: true },
      });
      return () => root.classList.remove('rm-mark--staged');
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="rm-mark" ref={rootRef} aria-labelledby="rm-mark-title">
      <div className="rm-mark__stage">
        <p className="rm-label">
          <span>{mark.label}</span>
          <span lang="ar" dir="rtl">
            {mark.labelAr}
          </span>
        </p>
        <h2 className="visually-hidden" id="rm-mark-title">
          {mark.label}
        </h2>

        <svg className="rm-mark__art" viewBox="-36 -36 176 176" role="img" aria-label={mark.artLabel} focusable="false">
          <g className="rm-mark__guides" fill="none" strokeWidth="0.35">
            <line className="rm-mark__guide rm-mark__guide--square" x1="-36" y1="31" x2="140" y2="31" />
            <line className="rm-mark__guide rm-mark__guide--square" x1="31" y1="-36" x2="31" y2="140" />
            <line className="rm-mark__guide rm-mark__guide--edge" {...through(ANGLE)} />
            <line className="rm-mark__guide rm-mark__guide--edge" {...through(90 - ANGLE)} />
          </g>
          <polygon className="rm-mark__fill" points={pointsOf(MARK)} fill="var(--rm-red)" />
          <polygon className="rm-mark__outline" points={pointsOf(MARK)} fill="none" strokeWidth="0.5" />
        </svg>

        <ol className="rm-mark__steps">
          {mark.steps.map((step) => (
            <li key={step} className="rm-mark__step">
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="rm-mark__small">
        <ul className="rm-mark__scale" aria-hidden="true">
          {SIZES.map((s) => (
            <li key={s} style={{ '--s': s }}>
              <svg viewBox="0 0 100 100" focusable="false">
                <polygon points={pointsOf(MARK)} fill="var(--rm-red)" />
              </svg>
            </li>
          ))}
        </ul>
        <p className="rm-mark__note">{mark.scale}</p>
      </div>
    </section>
  );
}
