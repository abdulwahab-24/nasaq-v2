import { useLayoutEffect, useRef } from 'react';
import LogoMotion from '../../../components/projects/LogoMotion';
import { gsap, MOTION_OK, NB } from '../nurba.motion';

/*
 * Closing, on navy: the logo film (rendered from the traced logo by
 * scripts/logo-motion/, the same moves as the page) laid straight onto the navy it
 * was filmed on, and the identity's own line beneath it.
 */
export default function Finale({ project }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const root = ref.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.from(root.querySelectorAll('.nb-finale__line > *'), {
        y: -12,
        opacity: 0,
        duration: 1.1,
        ease: NB.set,
        stagger: 0.1,
        scrollTrigger: { trigger: root.querySelector('.nb-finale__line'), start: 'top 85%', once: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="nb-finale" ref={ref} aria-label={project.copy.finale.label}>
      {project.motionLogo && <LogoMotion film={project.motionLogo} seamless className="nb-finale__film" />}
      <p className="nb-finale__line">
        <span>{project.copy.lines.envelope}</span>
        <span lang="ar" dir="rtl">
          {project.nameAr}
        </span>
      </p>
    </section>
  );
}
