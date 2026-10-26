import { Suspense, useRef } from 'react';
import { useParams } from 'react-router-dom';
import NextProject from '../components/projects/NextProject';
import ProjectHero from '../components/projects/ProjectHero';
import ProjectIntro from '../components/projects/ProjectIntro';
import ProjectStory from '../components/projects/story/ProjectStory';
import { getNextProject, getProject } from '../projects';
import { site } from '../data/siteConfig';
import useMeta from '../hooks/useMeta';
import useReveals from '../hooks/useReveals';
import { largestSrc } from '../utils/media';
import NotFoundPage from './NotFoundPage';

/*
 * /work/:slug — every registered project, resolved by slug from the registry (src/projects).
 * The shared page is hero → facts → story; a project whose record carries its
 * own `page` component (projects/<slug>/<Name>Page.jsx) renders that instead; such a
 * page may be lazy (its own chunk), and holds a screen of its field while it loads.
 * Both end on the next project.
 */
function ProjectPage({ project }) {
  const rootRef = useRef(null);
  const next = getNextProject(project.slug);

  // A supplied `description` wins; otherwise one is composed from the project's known facts.
  useMeta({
    title: project.name,
    description:
      project.description ??
      `${project.name}${project.nameAr ? ` (${project.nameAr})` : ''} — ${project.category} by ${site.name}, an independent brand identity studio.`,
    image: largestSrc(project.cover),
  });
  useReveals(rootRef, [project.slug]);

  const Custom = project.page;

  return (
    <article
      className={`project project--${project.theme.mode}${project.signature ? ` project--sig-${project.signature}` : ''}${Custom ? ` project--page-${project.slug}` : ''}`}
      data-motion={project.motion}
      ref={rootRef}
      style={{ '--accent-p': project.theme.accent, '--surface': project.theme.surface }}
    >
      {Custom ? (
        <Suspense fallback={<div className="project__loading" />}>
          <Custom project={project} />
        </Suspense>
      ) : (
        <>
          <ProjectHero project={project} />
          <ProjectIntro project={project} />
          <ProjectStory project={project} />
        </>
      )}
      {next && next !== project && <NextProject project={next} />}
    </article>
  );
}

export default function ProjectRoute() {
  const { slug } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFoundPage />;
  // keyed so every project mounts fresh (motion, reveals, scroll triggers)
  return <ProjectPage key={project.slug} project={project} />;
}
