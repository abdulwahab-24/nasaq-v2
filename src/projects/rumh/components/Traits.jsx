import { useLayoutEffect, useRef } from 'react';
import { gsap, MOTION_OK, RM } from '../rumh.motion';

/*
 * The brand's six traits, each on the identity's flag (sig.flag, cut from the graphic
 * elements page and used as a mask). They land in order, each thrown in along the
 * flag's own slant and stopping dead on the grid.
 */
export default function Traits({ project }) {
  const rootRef = useRef(null);
  const { traits } = project.copy;
  const flag = project.sig.flag;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ scrollTrigger: { trigger: q('.rm-traits__list'), start: 'top 72%', once: true } })
        .from(q('.rm-traits__flag'), {
          xPercent: -26,
          yPercent: 8,
          skewX: -14,
          opacity: 0,
          duration: 0.7,
          ease: RM.throw,
          stagger: 0.08,
        })
        .from(q('.rm-traits__en'), { opacity: 0, duration: 0.5, stagger: 0.08 }, 0.3);
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="rm-traits" ref={rootRef} aria-labelledby="rm-traits-title">
      <header className="rm-traits__head">
        <p className="rm-label">
          <span>{traits.label}</span>
          <span lang="ar" dir="rtl">
            {traits.labelAr}
          </span>
        </p>
        <h2 className="visually-hidden" id="rm-traits-title">
          {traits.label}
        </h2>
      </header>
      <ul
        className="rm-traits__list"
        style={{ '--flag': `url(${flag.src})`, '--flag-ratio': `${flag.width} / ${flag.height}` }}
      >
        {traits.words.map(([ar, en]) => (
          <li key={ar}>
            <span className="rm-traits__flag" lang="ar" dir="rtl">
              {ar}
            </span>
            <span className="rm-traits__en">{en}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
