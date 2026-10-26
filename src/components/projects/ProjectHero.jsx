import { useLayoutEffect, useRef } from 'react';
import { gsap, introDone, MOTION_OK } from '../../motion/gsap';
import { useTransition } from '../../transition/context';
import TransitionLink from '../../transition/TransitionLink';
import Arrow from '../ui/Arrow';
import ResponsiveImage from '../ui/ResponsiveImage';
import ProjectLogo from './ProjectLogo';

/*
 * Shared project hero, in three layouts (project.hero.layout):
 *   bleed  the work fills the screen
 *   split  the project's own field beside a tall crop
 *   plate  the work as an object on its colour, the name (or logo) behind it
 * Its frame ([data-hero-target]) is where the page transition lands.
 */
export default function ProjectHero({ project }) {
  const { registerHero, whenSettled, isTransitioning } = useTransition();
  const rootRef = useRef(null);
  const imgRef = useRef(null);
  const { layout, media } = project.hero;
  const facts = [project.category, project.year, project.location].filter(Boolean);

  useLayoutEffect(() => {
    const image = imgRef.current;
    registerHero(image?.decode ? image.decode().catch(() => {}) : Promise.resolve());
    const arriving = isTransitioning();

    const mm = gsap.matchMedia(rootRef);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(rootRef);
      const tl = gsap.timeline({ paused: true });
      tl.from(q('.line > span'), { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: 0.08 }).from(
        q('.phero__meta, .phero__back'),
        { opacity: 0, y: 12, duration: 0.8 },
        0.25,
      );
      if (layout === 'plate') {
        tl.from(q('.phero__giant'), { xPercent: 8, opacity: 0, duration: 1.6, ease: 'expo.out' }, 0);
      }
      // Without a page transition the work opens from a crop instead.
      if (!arriving && layout !== 'bleed') {
        const stepped = project.motion === 'steps';
        tl.fromTo(
          q('.phero__frame'),
          { clipPath: 'inset(18% 18% 18% 18%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: stepped ? 0.9 : 1.5, ease: stepped ? 'steps(8)' : 'expo.inOut' },
          0,
        ).set(q('.phero__frame'), { clearProps: 'clipPath' });
      }

      const scrub = { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(q('.phero__frame img'), { yPercent: layout === 'bleed' ? 12 : 5, ease: 'none', scrollTrigger: scrub });
      if (layout === 'plate') {
        gsap.to(q('.phero__giant'), { xPercent: -12, ease: 'none', scrollTrigger: { ...scrub } });
      }

      let alive = true;
      Promise.all([introDone, whenSettled()]).then(() => alive && tl.play());
      return () => {
        alive = false;
      };
    });
    return () => mm.revert();
  }, [project.slug, project.motion, layout, registerHero, whenSettled, isTransitioning]);

  const style = {
    '--surface': project.theme.surface,
    '--surface-field': project.theme.gradient,
    '--hero-ink': project.theme.ink,
    '--hero-accent': project.theme.accent,
    '--plate-ratio': `${media.width} / ${media.height}`,
    '--plate-w': media.width,
    '--plate-h': media.height,
    '--plate-m-w': (media.mobile ?? media).width,
    '--plate-m-h': (media.mobile ?? media).height,
    '--mark-w': project.logo?.width,
    '--mark-h': project.logo?.height,
  };

  return (
    <header className={`phero phero--${layout}${layout === 'plate' && project.hero.mark && project.logo ? ' phero--mark' : ''}`} ref={rootRef} style={style}>
      {layout === 'plate' &&
        (project.hero.mark && project.logo ? (
          <ProjectLogo logo={project.logo} decorative className="phero__giant phero__giant--mark" loading="eager" />
        ) : (
          <p className="phero__giant" aria-hidden="true">
            {project.name}
          </p>
        ))}

      <div className="phero__media">
        <span className="phero__frame" data-hero-target>
          <ResponsiveImage
            ref={imgRef}
            media={media}
            sizes={layout === 'bleed' ? '100vw' : '(min-width: 1024px) 50vw, 100vw'}
            priority
          />
        </span>
      </div>
      {layout === 'bleed' && <div className="phero__scrim" aria-hidden="true" />}

      <TransitionLink to="/" section="work" className="phero__back text-link">
        <Arrow direction="left" />
        All work
      </TransitionLink>

      <div className="phero__titles">
        <p className="phero__meta label">
          {facts.map((f) => (
            <span key={f}>{f}</span>
          ))}
        </p>
        <h1 className="phero__name">
          <span className="line">
            <span>{project.name}</span>
          </span>
        </h1>
        {project.nameAr && (
          <p className="phero__ar" lang="ar" dir="rtl">
            <span className="line">
              <span>{project.nameAr}</span>
            </span>
          </p>
        )}
      </div>
    </header>
  );
}
