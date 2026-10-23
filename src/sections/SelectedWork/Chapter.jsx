import Arrow from '../../components/ui/Arrow';
import Flip from '../../components/ui/Flip';
import ResponsiveImage from '../../components/ui/ResponsiveImage';
import { projectPath } from '../../projects';
import TransitionLink from '../../transition/TransitionLink';
import { inkOn } from '../../utils/colour';
import { pad } from '../../utils/format';
import { polygon } from '../../utils/shape';

/*
 * One featured project's chapter in Selected Work. Chapters share one
 * vocabulary (number, bilingual name, cover that opens into the project) but
 * use different compositions. A project chooses its composition with
 * `home.layout`; projects without one cycle through the set, so new projects
 * slot in without layout work. A project can place its own art into a
 * composition through `home.slots` (spread / type / floor — components from its
 * own folder, see projects/index.js). Scroll motion: SelectedWork.jsx.
 */
const LAYOUTS = ['cinema', 'spread', 'type', 'mosaic'];

function detailsOf(project) {
  if (project.home?.details?.length) return project.home.details;
  return (project.story ?? []).flatMap((b) => (b.media ? [b.media] : b.items ?? [])).slice(0, 2);
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

export default function Chapter({ project, index, total }) {
  const layout = project.home?.layout ?? LAYOUTS[index % LAYOUTS.length];
  const [d1, d2] = detailsOf(project);
  const id = `chapter-${project.slug}`;
  const light = inkOn(project.theme.surface) !== '#FFFFFF';
  const { signature, theme } = project;
  const { spread: SpreadArt, type: TypeArt, floor: Floor } = project.home?.slots ?? {};

  return (
    <article
      className={`chapter chapter--${layout}${light ? ' chapter--light' : ''}${signature ? ` chapter--sig-${signature}` : ''}`}
      aria-labelledby={id}
      data-surface={theme.surface}
      data-motion={project.motion}
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
            {SpreadArt && <SpreadArt project={project} />}
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
              {TypeArt ? (
                <TypeArt project={project} />
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
      {Floor && <Floor project={project} />}
    </article>
  );
}
