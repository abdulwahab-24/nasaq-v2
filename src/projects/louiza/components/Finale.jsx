import { useLayoutEffect, useRef } from 'react';
import LogoMotion from '../../../components/projects/LogoMotion';
import { gsap, MOTION_OK, settle } from '../louiza.motion';

/*
 * Closing, on Rosy Taupe (the field the logo is shown on in the identity, and the
 * one its film was made on): the logo film (rendered from the official logo by
 * scripts/logo-motion/) laid straight onto that colour on the left, and on the
 * right, on the same grid as every other section, the four words of the typography
 * page set as text, read from the right.
 */
export default function Finale({ project }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const root = ref.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => settle(root.querySelectorAll('.lz-finale__words > *'), root));
    return () => mm.revert();
  }, []);

  return (
    <section className="lz-finale lz-grid" ref={ref} aria-label={project.copy.finale.label}>
      {project.motionLogo && <LogoMotion film={project.motionLogo} seamless className="lz-finale__film" />}
      <ul className="lz-finale__words">
        {project.media.words.map((w) => (
          <li key={w.key}>
            <span lang="ar" dir="rtl">
              {w.ar}
            </span>
            <span className="lz-finale__en">{w.en}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
