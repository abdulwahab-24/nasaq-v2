import { projectPath } from '../../projects';
import TransitionLink from '../../transition/TransitionLink';
import { inkOn } from '../../utils/colour';
import { polygon } from '../../utils/shape';
import Arrow from '../ui/Arrow';
import ResponsiveImage from '../ui/ResponsiveImage';

// The closing link of a project page, into `project` (the next registered one).
export default function NextProject({ project }) {
  const media = project.home?.cover ?? project.cover;
  const style = {
    '--next-field': project.theme.surface,
    '--next-ink': inkOn(project.theme.surface),
    '--next-accent': project.theme.accent,
    '--next-gradient': project.theme.gradient,
    // the next project is glimpsed through its own mark, when it has one
    '--next-shape': project.theme.shape ? polygon(project.theme.shape) : undefined,
  };
  return (
    <section
      className={`pnext${project.signature ? ` pnext--sig-${project.signature}` : ''}`}
      aria-label="Next project"
      style={style}
    >
      <TransitionLink
        to={projectPath(project)}
        media
        color={project.theme.surface}
        className="pnext__link"
        data-cursor="Next"
      >
        <span className="pnext__label label">Next project</span>
        <span className="pnext__name">{project.name}</span>
        {project.nameAr && (
          <span className="pnext__ar" lang="ar" dir="rtl">
            {project.nameAr}
          </span>
        )}
        <span className="pnext__frame" data-transition-media>
          <ResponsiveImage media={media} sizes="(min-width: 1024px) 34vw, 70vw" alt="" />
        </span>
        <span className="pnext__arrow" aria-hidden="true">
          <Arrow />
        </span>
      </TransitionLink>
    </section>
  );
}
