import { useLayoutEffect, useRef } from 'react';
import { gsap, MOTION_OK, RM } from '../rumh.motion';

/*
 * The four arrangements of the logo, as supplied (4× PNG, trimmed by
 * scripts/project-assets.mjs), in the guidelines' navy on the white of the logo
 * chapter: each supplied file is the mask its navy is painted through, so the
 * drawing is the file's own. A quiet section: each is cut open from the side the
 * spearhead leads with, then left alone.
 */
export default function Lockups({ project }) {
  const rootRef = useRef(null);
  const { lockups } = project.copy;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        root.querySelectorAll('.rm-lockups__logo'),
        { clipPath: 'inset(0% 100% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1,
          ease: RM.cut,
          stagger: 0.12,
          scrollTrigger: { trigger: root.querySelector('.rm-lockups__grid'), start: 'top 75%', once: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="rm-lockups" ref={rootRef} aria-labelledby="rm-lockups-title">
      <p className="rm-label">
        <span>{lockups.label}</span>
        <span lang="ar" dir="rtl">
          {lockups.labelAr}
        </span>
      </p>
      <h2 className="visually-hidden" id="rm-lockups-title">
        {lockups.label}
      </h2>
      <ul className="rm-lockups__grid">
        {project.media.lockups.map((item) => (
          <li key={item.src} className={`rm-lockups__item rm-lockups__item--${item.shape}`}>
            <span
              className="rm-lockups__logo"
              role="img"
              aria-label={item.alt}
              style={{ '--src': `url(${item.src})`, aspectRatio: `${item.width} / ${item.height}` }}
            />
            <span className="rm-lockups__name">{item.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
