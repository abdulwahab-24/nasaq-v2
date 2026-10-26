import { useLayoutEffect, useRef } from 'react';
import Arrow from '../../components/ui/Arrow';
import ResponsiveImage from '../../components/ui/ResponsiveImage';
import { projectPath } from '../../projects';
import { DESKTOP, gsap } from '../../motion/gsap';
import useReveals from '../../hooks/useReveals';
import TransitionLink from '../../transition/TransitionLink';

/*
 * Anatomy of one identity: separate → connected. On desktop the section holds
 * the screen as an exploded view: the parts of a real NASAQ identity lie
 * scattered across the stage, turned and at different depths, and as the reader
 * scrolls they fly into one seamless strip, individual elements becoming a
 * system. Their names arrive once the system is whole. On smaller screens (and
 * without motion) the strip is a native horizontal scroller.
 */

// Deterministic scatter around each part's own place (x in vw, y in svh, degrees, scale),
// so every visit matches. Each part stays near its slot, so none leaves the screen.
const SCATTER = [
  [5, -12, -8, 0.82],
  [-3, 22, 6, 0.9],
  [2, -14, 3, 0.78],
  [-4, 16, -7, 0.88],
  [-6, -9, 9, 0.8],
];
export default function Anatomy({ project, parts }) {
  const rootRef = useRef(null);
  useReveals(rootRef);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(DESKTOP, () => {
      const q = gsap.utils.selector(root);
      root.classList.add('anatomy--staged');
      const at = (i) => SCATTER[i % SCATTER.length];
      const vw = () => window.innerWidth / 100;
      const vh = () => window.innerHeight / 100;
      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true },
        })
        .fromTo(
          q('.anatomy__frame'),
          {
            x: (i) => at(i)[0] * vw(),
            y: (i) => at(i)[1] * vh(),
            rotate: (i) => at(i)[2],
            scale: (i) => at(i)[3],
          },
          // no stagger: the timeline is re-rendered at its start on every refresh (sizes are in
          // viewport units), and a staggered part that had not begun yet would not be reset
          { x: 0, y: 0, rotate: 0, scale: 1, duration: 1, ease: 'power3.inOut' },
          0,
        )
        .fromTo(q('.anatomy__strip'), { '--gap': '2.5vw' }, { '--gap': '0vw', duration: 0.6, ease: 'power2.inOut' }, 0.55)
        .fromTo(
          q('.anatomy__part figcaption'),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
          1.05,
        )
        .fromTo(q('.anatomy__foot'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 1.3);
      return () => root.classList.remove('anatomy--staged');
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="anatomy" ref={rootRef} aria-labelledby="anatomy-title">
      <div className="anatomy__stage">
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
          {parts.map((part) => (
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
      </div>
    </section>
  );
}
