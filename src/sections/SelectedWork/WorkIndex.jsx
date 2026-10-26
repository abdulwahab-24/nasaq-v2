import { useEffect, useRef, useState } from 'react';
import Arrow from '../../components/ui/Arrow';
import ProjectLogo from '../../components/projects/ProjectLogo';
import ResponsiveImage from '../../components/ui/ResponsiveImage';
import { projectPath } from '../../projects';
import { sectionTitles } from '../../data/siteConfig';
import { FINE_POINTER, gsap, prefersReducedMotion } from '../../motion/gsap';
import useReveals from '../../hooks/useReveals';
import TransitionLink from '../../transition/TransitionLink';


/*
 * Index of every project — the part of the homepage that grows with the
 * portfolio. Rows are plain links; the active row rises into the project's own
 * colour. On fine pointers the active project's
 * logo follows the cursor on that project's own field, on touch each row
 * carries the same plate, small. Projects without a logo file show their cover.
 */
function Plate({ project, sizes }) {
  const { logo, theme } = project;
  if (!logo) return <ResponsiveImage media={project.cover} sizes={sizes} alt="" />;
  return (
    <span
      className="index__plate"
      style={{ '--plate-field': project.logoField ?? theme.gradient ?? theme.surface }}
    >
      <ProjectLogo logo={logo} ink={theme.ink} decorative className="index__logo" />
    </span>
  );
}

export default function WorkIndex({ projects }) {
  const rootRef = useRef(null);
  const previewRef = useRef(null);
  const [active, setActive] = useState(null);
  useReveals(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    const preview = previewRef.current;
    if (!window.matchMedia(FINE_POINTER).matches || !preview) return undefined;
    const dur = prefersReducedMotion() ? 0.01 : 0.6;
    const x = gsap.quickTo(preview, 'x', { duration: dur, ease: 'power3' });
    const y = gsap.quickTo(preview, 'y', { duration: dur, ease: 'power3' });
    const onMove = (e) => {
      const r = root.getBoundingClientRect();
      x(e.clientX - r.left);
      y(e.clientY - r.top);
    };
    root.addEventListener('pointermove', onMove);
    return () => root.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <section className="index" ref={rootRef} aria-labelledby="index-title">
      <header className="index__head">
        <h2 className="index__title" id="index-title" data-reveal="lines">
          <span className="line">
            <span>{sectionTitles.index.en}</span>
          </span>
        </h2>
        <p className="index__ar" lang="ar" dir="rtl" data-reveal="lines">
          <span className="line">
            <span>{sectionTitles.index.ar}</span>
          </span>
        </p>
      </header>

      <div className="index__table" role="list" onPointerLeave={() => setActive(null)}>
        <div className="index__row index__row--head" aria-hidden="true">
          <span>Project</span>
          <span>Arabic</span>
          <span>Discipline</span>
          <span>Year</span>
        </div>
        {projects.map((p) => (
          <div role="listitem" key={p.slug}>
            <TransitionLink
              to={projectPath(p)}
              className={`index__row${active === p.slug ? ' is-active' : ''}`}
              onPointerEnter={() => setActive(p.slug)}
              onFocus={() => setActive(p.slug)}
              onBlur={() => setActive(null)}
              style={{ '--row-bg': p.theme.surface, '--row-ink': p.theme.ink, '--row-accent': p.theme.accent }}
              data-reveal="up"
            >
              <span className="index__name">{p.name}</span>
              <span className="index__name-ar" lang="ar" dir="rtl">
                {p.nameAr ?? ''}
              </span>
              <span className="index__cat">{p.category}</span>
              <span className="index__year">{p.year ?? '—'}</span>
              <span className="index__thumb" aria-hidden="true">
                <Plate project={p} sizes="96px" />
              </span>
              <span className="index__arrow" aria-hidden="true">
                <Arrow />
              </span>
            </TransitionLink>
          </div>
        ))}
      </div>

      <div className="index__preview" ref={previewRef} aria-hidden="true">
        {projects.map((p) => (
          <div key={p.slug} className={`index__preview-item${active === p.slug ? ' is-active' : ''}`}>
            <Plate project={p} sizes="26vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
