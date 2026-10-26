import { useLayoutEffect, useRef } from 'react';
import Arrow from '../../../components/ui/Arrow';
import { useTransition } from '../../../transition/context';
import TransitionLink from '../../../transition/TransitionLink';
import { gsap, introDone, LZ, MARK_CENTRE, MOTION_OK, PIVOT } from '../louiza.motion';
import Head from './Head';
import Logo from './Logo';

/*
 * Opening, then the mark. On the identity's soft field (rose and blue blurred over
 * Antique White, its two faint circles) the logo assembles in Smoky Rose, as it
 * sits on the presentation's logo page: the tall leaf grows from its foot, the small
 * one unfolds from the stem, the wordmark is written in from the right.
 * Scrolling, the screen holds: the wordmark is taken away, the two leaves move to
 * the centre, grow, and take on the rose-to-blue of the mark page. The logo's
 * frame is where the page transition lands ([data-hero-target]).
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
      const logo = q('.lz-open .lz-logo')[0];
      const intro = q('.lz-open__intro > *, .lz-open__meta > *');

      // arrival
      gsap.set(q('.lz-logo__leaf--big'), {
        transformOrigin: PIVOT.leafBig,
        scaleY: 0,
        scaleX: 0.6,
        opacity: 0,
      });
      gsap.set(q('.lz-logo__leaf--small'), {
        transformOrigin: PIVOT.leafSmall,
        rotate: -60,
        scale: 0.2,
        opacity: 0,
      });
      gsap.set(q('.lz-logo__word'), { clipPath: 'inset(-5% -5% -5% 105%)' });
      gsap.set(intro, { opacity: 0, y: 16 });
      const tl = gsap.timeline({ paused: true, defaults: { ease: LZ.grow } });
      tl.to(q('.lz-logo__leaf--big'), { scaleY: 1, scaleX: 1, opacity: 1, duration: 1.8 }, 0)
        .to(q('.lz-logo__leaf--small'), { rotate: 0, scale: 1, opacity: 1, duration: 1.5 }, 0.6)
        .to(q('.lz-logo__word'), { clipPath: 'inset(-5% -5% -5% -5%)', duration: 1.6, ease: LZ.melt }, 0.5)
        .to(intro, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08 }, 1.1);

      // the hold: logo → mark. The leaves travel to the centre of the screen.
      const toCentre = () => root.offsetWidth / 2 - (logo.offsetLeft + logo.offsetWidth * MARK_CENTRE[0]);
      gsap.set(q('.lz-open__markhead'), { opacity: 0, y: 24 });
      gsap
        .timeline({
          defaults: { ease: LZ.melt },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=110%',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(q('.lz-logo__word'), { clipPath: 'inset(-5% 105% -5% -5%)', duration: 0.3 }, 0)
        .to(intro, { opacity: 0, y: -16, duration: 0.25, stagger: 0.02 }, 0)
        .to(
          logo,
          {
            x: toCentre,
            scale: 1.3,
            transformOrigin: `${MARK_CENTRE[0] * 100}% ${MARK_CENTRE[1] * 100}%`,
            duration: 0.5,
          },
          0.15,
        )
        .to(logo, { '--lz-grad': 1, duration: 0.4 }, 0.3)
        .to(q('.lz-open__markhead'), { opacity: 1, y: 0, duration: 0.25, ease: LZ.grow }, 0.6)
        .to({}, { duration: 0.2 });

      let alive = true;
      Promise.all([introDone, whenSettled()]).then(() => alive && tl.play());
      return () => {
        alive = false;
      };
    });
    return () => mm.revert();
  }, [registerHero, whenSettled]);

  return (
    <header className="lz-open" ref={rootRef}>
      <div className="lz-open__meta lz-grid">
        <TransitionLink to="/" section="work" className="text-link lz-open__back">
          <Arrow direction="left" />
          All work
        </TransitionLink>
        <p className="lz-index">{project.category}</p>
      </div>

      <div className="lz-open__stage lz-grid">
        <div className="lz-open__intro">
          <p className="lz-index">{copy.opening.label}</p>
          <h1 className="lz-open__name">
            {project.name}
            <span className="visually-hidden">
              {' '}
              — <span lang="ar">{project.nameAr}</span>
            </span>
          </h1>
        </div>
        <div className="lz-open__logo" data-hero-target>
          <Logo />
        </div>
      </div>

      <div className="lz-open__markhead">
        <Head copy={copy.mark} />
      </div>
    </header>
  );
}
