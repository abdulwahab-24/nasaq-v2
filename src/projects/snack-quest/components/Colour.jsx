import { useLayoutEffect, useRef } from 'react';
import { gsap, MOTION_OK, SQ } from '../snack-quest.motion';
import { Level } from './Bits';

/*
 * Level 3: the colours, as the presentation's palette page draws them: five tall bars
 * with stepped pixel ends, side by side on black. They rise in whole steps as the
 * section comes up, like a level meter, and two of the identity's sprites (the coin
 * and the burger, cut from its colour page) sit on their own colours, bobbing a pixel
 * at a time.
 */
export default function Colour({ project }) {
  const rootRef = useRef(null);
  const { colour: copy } = project.copy;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.from(root.querySelectorAll('.sq-colour__bar'), {
        scaleY: 0,
        transformOrigin: '50% 100%',
        ease: SQ.frame(8),
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: 'top 75%', end: 'top 15%', scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="sq-colour" ref={rootRef} aria-labelledby="sq-colour-title">
      <header className="sq-head">
        <Level n={3} title={copy.label} />
        <h2 className="visually-hidden" id="sq-colour-title">
          {copy.label}
        </h2>
      </header>
      <ul className="sq-colour__bars">
        {project.identity.colours.map((c) => (
          <li key={c.hex} className="sq-colour__bar" style={{ background: c.hex, color: c.ink }}>
            <span className="sq-colour__hex">{c.hex}</span>
            {c.sprite && <img className="sq-colour__sprite" src={c.sprite.src} alt="" width={c.sprite.width} height={c.sprite.height} />}
          </li>
        ))}
      </ul>
    </section>
  );
}
