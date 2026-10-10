import { useLayoutEffect, useRef } from 'react';
import Arrow from '../components/Arrow';
import Flip from '../components/Flip';
import ResponsiveImage from '../components/ResponsiveImage';
import { Bloom, PatternBand, Ticker } from '../components/Signature';
import { projectPath } from '../data/projects';
import { gsap, MOTION_OK, ScrollTrigger } from '../motion/gsap';
import useReveals from '../motion/useReveals';
import TransitionLink from '../transition/TransitionLink';
import { inkOn } from '../utils/colour';
import { polygon, RECT, shapeIn } from '../utils/shape';

/*
 * Selected Work — each featured project gets a chapter. Chapters share one
 * vocabulary (number, bilingual name, cover that opens into the project) but
 * use different compositions, and the section itself turns into each
 * project's own colour as it arrives, so the work never reads as a grid.
 *
 * A project chooses its composition with `home.layout`; projects without one
 * cycle through the set, so new projects slot in without layout work.
 *
 * A project's `signature` then bends that composition around its own artwork:
 * the Rumh mark is the aperture its cover opens through, Louiza's leaf pattern
 * grows beside the bag, the Rukaz pattern travels behind the mug, Snack Quest
 * moves in pixel steps above its slogan ticker.
 */
const LAYOUTS = ['cinema', 'spread', 'type', 'mosaic'];
const pad = (n) => String(n).padStart(2, '0');

function detailsOf(project) {
  if (project.home?.details?.length) return project.home.details;
  return project.story.flatMap((b) => (b.media ? [b.media] : b.items ?? [])).slice(0, 2);
}

function Meta({ project, index, total }) {
  const facts = [project.category, project.year].filter(Boolean).join(' — ');
  return (
    <p className="chapter__meta label">
      <span className="chapter__num">
        {pad(index + 1)} / {pad(total)}
      </span>
      {facts && <span>{facts}</span>}
    </p>
  );
}

function Names({ project, id }) {
  return (
    <>
      <h3 className="chapter__name" id={id}>
        <span className="line">
          <span>{project.name}</span>
        </span>
      </h3>
      {project.nameAr && (
        <p className="chapter__name-ar" lang="ar" dir="rtl">
          <span className="line">
            <span>{project.nameAr}</span>
          </span>
        </p>
      )}
    </>
  );
}

// The cover: one link wrapping the media, which travels into the project page.
function Cover({ project, className = '', sizes, labelledBy }) {
  return (
    <TransitionLink
      to={projectPath(project)}
      media
      color={project.theme.surface}
      className={`chapter__cover ${className}`}
      data-cursor="View"
      aria-labelledby={labelledBy}
    >
      <span className="chapter__frame" data-transition-media>
        <ResponsiveImage media={project.home?.cover ?? project.cover} sizes={sizes} className="chapter__img" />
      </span>
    </TransitionLink>
  );
}

function Detail({ media, className = '', sizes, parallax, shape }) {
  // `shape`: the project's mark as the crop of this image
  const style = { maxWidth: `${media.width}px`, clipPath: shape ? polygon(shape) : undefined };
  return (
    <figure className={`chapter__detail ${className}`} data-parallax={parallax} style={style}>
      <span className="chapter__frame" data-reveal="clip">
        <ResponsiveImage media={media} sizes={sizes} />
      </span>
    </figure>
  );
}

function ViewLink({ project, id }) {
  return (
    <TransitionLink to={projectPath(project)} className="text-link chapter__link" aria-describedby={id}>
      View project
      <Arrow />
    </TransitionLink>
  );
}

function Chapter({ project, index, total }) {
  const layout = project.home?.layout ?? LAYOUTS[index % LAYOUTS.length];
  const [d1, d2] = detailsOf(project);
  const id = `chapter-${project.slug}`;
  const light = inkOn(project.theme.surface) !== '#FFFFFF';
  const { signature, sig = {}, theme } = project;

  return (
    <article
      className={`chapter chapter--${layout}${light ? ' chapter--light' : ''}${signature ? ` chapter--sig-${signature}` : ''}`}
      aria-labelledby={id}
      data-surface={theme.surface}
      data-motion={signature === 'arcade' ? 'steps' : undefined}
      data-shape={theme.shape ? JSON.stringify(theme.shape) : undefined}
      style={{ '--chapter-bg': theme.surface, '--chapter-accent': theme.accent, '--chapter-gradient': theme.gradient }}
    >
      {theme.gradient && <span className="chapter__field" aria-hidden="true" />}
      <div className="chapter__inner">
        {layout === 'cinema' && (
          <>
            <Meta project={project} index={index} total={total} />
            <Cover project={project} className="cinema__cover" sizes="100vw" labelledBy={id} />
            <div className="cinema__names" data-reveal="lines">
              <Names project={project} id={id} />
            </div>
            <div className="cinema__foot">
              {project.tagline && (
                <p className="chapter__tagline" data-reveal="up">
                  {project.tagline}
                </p>
              )}
              <ViewLink project={project} id={id} />
            </div>
            {d1 && <Detail media={d1} className="cinema__d1" sizes="(min-width: 1024px) 46vw, 90vw" />}
            {d2 && (
              <Detail
                media={d2}
                className="cinema__d2"
                sizes="(min-width: 1024px) 24vw, 70vw"
                parallax="0.12"
                shape={theme.shape}
              />
            )}
          </>
        )}

        {layout === 'spread' && (
          <>
            {sig.leaf && project.home?.bloom && <Bloom mark={sig.leaf} {...project.home.bloom} className="spread__bloom" />}
            <Cover project={project} className="spread__cover" sizes="(min-width: 1024px) 46vw, 100vw" labelledBy={id} />
            <div className="spread__text">
              <Meta project={project} index={index} total={total} />
              <div data-reveal="lines">
                <Names project={project} id={id} />
              </div>
              <ViewLink project={project} id={id} />
            </div>
            {d1 && <Detail media={d1} className="spread__d1" sizes="(min-width: 1024px) 36vw, 90vw" />}
            {d2 && <Detail media={d2} className="spread__d2" sizes="(min-width: 1024px) 22vw, 70vw" parallax="0.14" />}
          </>
        )}

        {layout === 'type' && (
          <>
            <Meta project={project} index={index} total={total} />
            <div className="type__stage">
              <p className="type__giant" aria-hidden="true">
                {project.name}
              </p>
              <Cover project={project} className="type__cover" sizes="(min-width: 1024px) 34vw, 80vw" labelledBy={id} />
              {sig.pattern ? (
                <PatternBand tile={sig.pattern} className="type__band" />
              ) : (
                project.nameAr && (
                  <p className="type__giant-ar" lang="ar" dir="rtl" aria-hidden="true">
                    {project.nameAr}
                  </p>
                )
              )}
            </div>
            <div className="type__foot">
              <h3 className="chapter__name chapter__name--small" id={id}>
                {project.name}
                {project.nameAr && (
                  <span className="chapter__inline-ar" lang="ar" dir="rtl">
                    {project.nameAr}
                  </span>
                )}
              </h3>
              <ViewLink project={project} id={id} />
            </div>
            {d1 && <Detail media={d1} className="type__d1" sizes="(min-width: 1024px) 30vw, 80vw" parallax="0.1" />}
          </>
        )}

        {layout === 'mosaic' && (
          <>
            <div className="mosaic__head">
              <Meta project={project} index={index} total={total} />
              <div data-reveal="lines">
                <Names project={project} id={id} />
              </div>
            </div>
            <Cover project={project} className="mosaic__cover" sizes="(min-width: 1024px) 58vw, 100vw" labelledBy={id} />
            {project.home?.flip ? (
              <figure className="chapter__detail mosaic__d1" data-parallax="0.16">
                <Flip items={project.home.flip} sizes="(min-width: 1024px) 26vw, 70vw" className="chapter__frame" />
              </figure>
            ) : (
              d1 && <Detail media={d1} className="mosaic__d1" sizes="(min-width: 1024px) 26vw, 70vw" parallax="0.16" />
            )}
            {d2 && <Detail media={d2} className="mosaic__d2" sizes="(min-width: 1024px) 40vw, 90vw" />}
            <div className="mosaic__foot">
              <ViewLink project={project} id={id} />
            </div>
          </>
        )}
      </div>
      {sig.ticker && <Ticker strip={sig.ticker} label={sig.ticker.alt} className="chapter__ticker" />}
    </article>
  );
}

export default function Work({ projects }) {
  const rootRef = useRef(null);
  useReveals(rootRef);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);

      // Colour takeover: the section turns into each project's own colour.
      const chapters = q('.chapter');
      root.classList.add('work--takeover');
      gsap.set(root, { backgroundColor: chapters[0]?.dataset.surface });
      chapters.forEach((ch) => {
        ScrollTrigger.create({
          trigger: ch,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            ch.classList.toggle('is-active', self.isActive);
            if (self.isActive) {
              const ease = ch.dataset.motion === 'steps' ? 'steps(5)' : 'power2.inOut';
              gsap.to(root, { backgroundColor: ch.dataset.surface, duration: 0.9, ease, overwrite: true });
            }
          },
        });
      });

      // cinema: the cover opens to the full frame — from a centred crop, or,
      // when the project has a mark shape, through the mark itself
      q('.chapter--cinema').forEach((ch) => {
        const frame = ch.querySelector('.cinema__cover .chapter__frame');
        const shape = ch.dataset.shape && JSON.parse(ch.dataset.shape);
        const from = shape ? () => shapeIn(frame, shape, 0.7) : 'inset(0% 22% 0% 22%)';
        const to = shape ? polygon(RECT) : 'inset(0% 0% 0% 0%)';
        gsap
          .timeline({
            scrollTrigger: { trigger: frame, start: 'top 95%', end: 'center 55%', scrub: 0.5, invalidateOnRefresh: true },
          })
          .fromTo(frame, { clipPath: from }, { clipPath: to, ease: shape ? 'power2.in' : 'none' })
          .fromTo(frame.querySelector('img'), { scale: 1.3 }, { scale: 1, ease: 'none' }, 0);
      });

      // type: the project's name slides across behind its own cover
      q('.chapter--type').forEach((ch) => {
        const st = { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: true };
        gsap.fromTo(ch.querySelector('.type__giant'), { xPercent: 8 }, { xPercent: -14, ease: 'none', scrollTrigger: st });
        const ar = ch.querySelector('.type__giant-ar');
        if (ar) gsap.fromTo(ar, { xPercent: -10 }, { xPercent: 12, ease: 'none', scrollTrigger: { ...st } });
        gsap.fromTo(
          ch.querySelector('.type__cover img'),
          { yPercent: -5, scale: 1.1 },
          { yPercent: 5, scale: 1.1, ease: 'none', scrollTrigger: { ...st } },
        );
      });

      // spread + mosaic covers: cropped → revealed, once
      // (a project that moves in steps opens in steps)
      q('.spread__cover .chapter__frame, .mosaic__cover .chapter__frame').forEach((frame) => {
        const stepped = frame.closest('[data-motion="steps"]');
        gsap
          .timeline({ scrollTrigger: { trigger: frame, start: 'top 85%', once: true } })
          .fromTo(
            frame,
            { clipPath: 'inset(16% 12% 16% 12%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: stepped ? 0.9 : 1.5, ease: stepped ? 'steps(8)' : 'expo.inOut' },
          )
          .fromTo(
            frame.querySelector('img'),
            { scale: 1.3 },
            { scale: 1, duration: stepped ? 0.9 : 1.7, ease: stepped ? 'steps(8)' : 'expo.inOut' },
            0,
          )
          .set(frame, { clearProps: 'clipPath' });
      });
    });
    return () => {
      mm.revert();
      root.classList.remove('work--takeover');
      root.querySelectorAll('.chapter.is-active').forEach((ch) => ch.classList.remove('is-active'));
      root.style.backgroundColor = '';
    };
  }, []);

  return (
    <section className="work" ref={rootRef} aria-label="Selected work">
      {projects.map((project, i) => (
        <Chapter key={project.slug} project={project} index={i} total={projects.length} />
      ))}
    </section>
  );
}
