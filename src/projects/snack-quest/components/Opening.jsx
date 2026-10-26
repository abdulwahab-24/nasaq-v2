import { useLayoutEffect, useRef } from 'react';
import Arrow from '../../../components/ui/Arrow';
import { useTransition } from '../../../transition/context';
import TransitionLink from '../../../transition/TransitionLink';
import { gsap, introDone, LETTERS, LOGO_RATIO, MOTION_OK, partBox, SQ } from '../snack-quest.motion';
import { Flames } from './Bits';

/*
 * Opening: the start screen. On the identity's purple the black plate is wiped on in
 * pixel steps, then a block cursor types SNACK QUEST one letter at a time, the way
 * a name is entered on an arcade screen. The slogan comes up beneath, the flames
 * along the bottom of the screen. The plate is where the page transition lands
 * ([data-hero-target]).
 */
export default function Opening({ project }) {
  const { registerHero, whenSettled } = useTransition();
  const rootRef = useRef(null);
  const { copy } = project;

  useLayoutEffect(() => {
    registerHero(Promise.resolve());
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      const letters = q('.sq-open__letter');
      const cursor = q('.sq-open__cursor')[0];
      gsap.set(q('.sq-open__plate'), { clipPath: 'inset(0% 100% 0% 0%)' });
      gsap.set(letters, { autoAlpha: 0 });
      gsap.set(q('.sq-open__meta > *, .sq-open__slogan, .sq-flames'), { autoAlpha: 0 });

      const tl = gsap.timeline({ paused: true });
      tl.to(q('.sq-open__plate'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: SQ.frame(12) });
      // the cursor sits on each letter's place, then the letter appears under it
      LETTERS.forEach((name, i) => {
        const at = 0.75 + i * SQ.type;
        tl.set(cursor, { autoAlpha: 1, ...partBox(name) }, at).set(letters[i], { autoAlpha: 1 }, at + SQ.type * 0.6);
      });
      const end = 0.75 + LETTERS.length * SQ.type;
      tl.to(cursor, { autoAlpha: 0, duration: 0.6, ease: SQ.frame(3), repeat: 1, yoyo: true }, end)
        .set(cursor, { autoAlpha: 0 })
        .to(q('.sq-open__slogan'), { autoAlpha: 1, duration: 0.3, ease: SQ.frame(3) }, end + 0.1)
        .to(q('.sq-flames'), { autoAlpha: 1, duration: 0.4, ease: SQ.frame(4) }, end + 0.2)
        .to(q('.sq-open__meta > *'), { autoAlpha: 1, duration: 0.3, ease: SQ.frame(3), stagger: 0.08 }, end + 0.2);

      // leaving: the logo lifts away in whole steps
      gsap.to(q('.sq-open__logo'), {
        yPercent: -40,
        ease: SQ.frame(10),
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      });

      let alive = true;
      Promise.all([introDone, whenSettled()]).then(() => alive && tl.play());
      return () => {
        alive = false;
      };
    });
    return () => mm.revert();
  }, [registerHero, whenSettled]);

  return (
    <header className="sq-open" ref={rootRef}>
      <div className="sq-open__meta">
        <TransitionLink to="/" section="work" className="text-link sq-open__back">
          <Arrow direction="left" />
          All work
        </TransitionLink>
        <p className="sq-tag">{project.category}</p>
      </div>

      <h1 className="sq-open__logo" data-hero-target style={{ aspectRatio: LOGO_RATIO }}>
        <span className="visually-hidden">{project.name}</span>
        <img className="sq-open__plate" src="/work/snack-quest/parts/plate.png" alt="" width="1095" height="532" />
        {LETTERS.map((name) => (
          <img
            key={name}
            className="sq-open__letter"
            src={`/work/snack-quest/parts/${name}.png`}
            alt=""
            style={partBox(name)}
          />
        ))}
        <span className="sq-open__cursor" aria-hidden="true" />
      </h1>

      <p className="sq-open__slogan">{copy.slogan}</p>
      <Flames />
    </header>
  );
}
