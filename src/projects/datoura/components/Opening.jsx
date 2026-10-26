import { useLayoutEffect, useRef } from 'react';
import Arrow from '../../../components/ui/Arrow';
import LoopVideo from '../../../components/ui/LoopVideo';
import { introDone, MOTION_OK } from '../../../motion/gsap';
import { useTransition } from '../../../transition/context';
import TransitionLink from '../../../transition/TransitionLink';
import { DT, gsap } from '../datoura.motion';
import Art from './Art';

/*
 * Opening. The supplied film of the symbol's contour (pure black around a glowing
 * line) is screen-blended onto DATOURA's field, so the black disappears and the
 * contour hums on the page itself. Beneath it the wordmark is built letter by
 * letter, each rising from the baseline it is drawn on. Scrolling on, the
 * contour widens away and the letters lift out.
 * The whole first screen is where the page transition lands ([data-hero-target]).
 */
export default function Opening({ project }) {
  const { registerHero, whenSettled } = useTransition();
  const rootRef = useRef(null);
  const { copy, film } = project;

  useLayoutEffect(() => {
    registerHero(Promise.resolve());

    const mm = gsap.matchMedia(rootRef);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(rootRef);
      const letters = q('.dt-open__word path');
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(q('.dt-open__film'), { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 1.6, ease: 'expo.out' })
        .fromTo(letters, { yPercent: 120 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07 }, 0.25)
        .fromTo(q('.dt-open__meta > *, .dt-open__line'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: DT.ease, stagger: 0.08 }, 0.7);

      // leaving: the contour widens away, the letters lift out one after another
      const out = { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(q('.dt-open__film'), { scale: 1.6, opacity: 0, ease: 'none', scrollTrigger: out });
      gsap.to(letters, { yPercent: -60, opacity: 0, ease: 'none', stagger: 0.04, scrollTrigger: out });

      let alive = true;
      Promise.all([introDone, whenSettled()]).then(() => alive && tl.play());
      return () => {
        alive = false;
      };
    });
    return () => mm.revert();
  }, [registerHero, whenSettled]);

  return (
    <header className="dt-open" ref={rootRef}>
      <div className="dt-open__frame" data-hero-target>
        <LoopVideo sources={film.sources} poster={film.poster} label={film.label} className="dt-open__film" />
      </div>

      <div className="dt-open__meta">
        <TransitionLink to="/" section="work" className="text-link dt-open__back">
          <Arrow direction="left" />
          All work
        </TransitionLink>
        <p className="dt-label">{project.category}</p>
      </div>

      <div className="dt-open__foot">
        <p className="dt-open__line">{copy.tagline}</p>
        <h1 className="dt-open__title">
          <span className="visually-hidden">{project.name}</span>
          <Art name="lockup" only={(r) => r === 'letter'} fit className="dt-open__word" />
        </h1>
      </div>
    </header>
  );
}
