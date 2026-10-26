import { useLayoutEffect, useRef } from 'react';
import { gsap, MOTION_OK, RM } from '../rumh.motion';

/*
 * Three colours, as the colour page sets them: three straight panels side by side,
 * navy, red, white, each carrying its values. They rise into place one after the
 * other, each stopping dead, as the section comes up the screen.
 */
export default function Colour({ project }) {
  const rootRef = useRef(null);
  const { colour } = project.copy;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: 'top 70%', end: 'top 5%', scrub: RM.scrub } })
        .from(q('.rm-colour__plane'), { yPercent: 100, duration: 0.5, ease: RM.throw, stagger: 0.14 }, 0)
        .from(q('.rm-colour__values'), { opacity: 0, y: 14, duration: 0.25, stagger: 0.1 }, 0.5);
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="rm-colour" ref={rootRef} aria-labelledby="rm-colour-title">
      <h2 className="visually-hidden" id="rm-colour-title">
        {colour.label}
      </h2>
      {project.identity.colours.map((c) => (
        <div key={c.hex} className={`rm-colour__plane rm-colour__plane--${c.key}`}>
          <dl className="rm-colour__values">
            <dt>{c.name}</dt>
            <dd>{c.hex}</dd>
            <dd>{c.rgb}</dd>
          </dl>
        </div>
      ))}
      <p className="rm-label rm-colour__label">
        <span>{colour.label}</span>
        <span lang="ar" dir="rtl">
          {colour.labelAr}
        </span>
      </p>
    </section>
  );
}
