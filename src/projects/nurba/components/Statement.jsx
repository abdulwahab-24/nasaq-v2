import { useLayoutEffect, useRef } from 'react';
import { gsap, MOTION_OK, NB } from '../nurba.motion';

/*
 * A quiet page of cream after the opening: one sentence about what the identity is
 * made of, set large. Its words are set into their line one after another, the way
 * the letters of the logo were, once, as it comes up the screen.
 */
export default function Statement({ project }) {
  const rootRef = useRef(null);
  const words = project.copy.statement.text.split(' ');

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.from(root.querySelectorAll('.nb-statement__w'), {
        y: -14,
        opacity: 0,
        duration: 1,
        ease: NB.set,
        stagger: 0.035,
        scrollTrigger: { trigger: root, start: 'top 65%', once: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="nb-statement" ref={rootRef}>
      <p className="nb-statement__text">
        {words.map((w, i) => (
          <span key={i} className="nb-statement__w">
            {w}{' '}
          </span>
        ))}
      </p>
    </section>
  );
}
