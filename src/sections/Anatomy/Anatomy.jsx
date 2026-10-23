import { useLayoutEffect, useRef } from 'react';
import Arrow from '../../components/ui/Arrow';
import ResponsiveImage from '../../components/ui/ResponsiveImage';
import { projectPath } from '../../projects';
import { DESKTOP, gsap } from '../../motion/gsap';
import useReveals from '../../hooks/useReveals';
import TransitionLink from '../../transition/TransitionLink';
import { pad } from '../../utils/format';

/*
 * Anatomy of one identity — separate → connected. The parts of a real NASAQ
 * identity start apart and close into one continuous strip as the section
 * scrolls: individual elements becoming a system. (Desktop scrubs it; on
 * smaller screens the strip is a native horizontal scroller.)
 */
export default function Anatomy({ project, parts }) {
  const rootRef = useRef(null);
  useReveals(rootRef);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(DESKTOP, () => {
      const strip = root.querySelector('.anatomy__strip');
      const items = root.querySelectorAll('.anatomy__part');
      const mid = (items.length - 1) / 2;
      gsap
        .timeline({ scrollTrigger: { trigger: strip, start: 'top 90%', end: 'center 50%', scrub: 0.6 } })
        .fromTo(
          items,
          { x: (i) => (i - mid) * 46, y: (i) => (i % 2 ? 60 : -30) },
          { x: 0, y: 0, ease: 'power2.out' },
        )
        .fromTo(strip, { '--gap': '3.5vw' }, { '--gap': '0vw', ease: 'power2.inOut' }, 0)
        .fromTo(root.querySelectorAll('.anatomy__frame'), { scale: 0.86 }, { scale: 1, ease: 'power2.out' }, 0);
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="anatomy" ref={rootRef} aria-labelledby="anatomy-title">
      <header className="anatomy__head">
        <p className="label anatomy__kicker">Anatomy of an identity</p>
        <h2 className="anatomy__title" id="anatomy-title" data-reveal="lines">
          <span className="line">
            <span>From pieces </span>
          </span>
          <span className="line">
            <span>to a system.</span>
          </span>
        </h2>
        <p className="anatomy__project">
          <span>{project.name}</span>
          {project.nameAr && (
            <span lang="ar" dir="rtl">
              {project.nameAr}
            </span>
          )}
        </p>
      </header>

      <ol className="anatomy__strip" data-allow-overflow tabIndex={0} aria-label={`${project.name} identity, part by part`}>
        {parts.map((part, i) => (
          <li className="anatomy__part" key={part.label}>
            <figure>
              <span className={`anatomy__frame anatomy__frame--${part.kind ?? 'image'}`}>
                {part.kind === 'logo' && (
                  <img
                    src={project.logo.src}
                    alt={project.logo.alt}
                    width={project.logo.width}
                    height={project.logo.height}
                    loading="lazy"
                  />
                )}
                {part.kind === 'colour' &&
                  project.identity.colours.map((c) => (
                    <span key={c.hex} className="anatomy__chip" style={{ '--chip': c.hex }}>
                      {c.hex}
                    </span>
                  ))}
                {part.media && <ResponsiveImage media={part.media} sizes="(min-width: 1024px) 20vw, 66vw" />}
              </span>
              <figcaption>
                <span className="anatomy__num">{pad(i + 1)}</span>
                <span>{part.label}</span>
                <span className="anatomy__ar" lang="ar" dir="rtl">
                  {part.labelAr}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>

      <div className="anatomy__foot">
        <TransitionLink to={projectPath(project)} className="text-link">
          See the full {project.name} identity
          <Arrow />
        </TransitionLink>
      </div>
    </section>
  );
}
