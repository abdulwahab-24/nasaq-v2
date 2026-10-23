/*
 * Tagline, written copy and facts under the project hero.
 * Only facts present in the project data are shown; nothing is filled in.
 */
export default function ProjectIntro({ project }) {
  const { identity = {} } = project;
  const rows = [
    ['Discipline', project.category],
    ['Year', project.year],
    ['Location', project.location],
    ['Services', project.services?.length ? project.services.join(', ') : null],
    ['Typography', identity.typefaces?.length ? identity.typefaces.join(', ') : null],
  ].filter(([, v]) => v);

  return (
    <section className="pintro" aria-label="Project details">
      {project.tagline && (
        <p className="pintro__tagline" data-reveal="lines">
          <span className="line">
            <span>“{project.tagline}”</span>
          </span>
        </p>
      )}
      {(project.description || project.overview) && (
        <div className="pintro__copy" data-reveal="up">
          {project.description && <p className="pintro__lead">{project.description}</p>}
          {project.overview && <p>{project.overview}</p>}
        </div>
      )}
      <dl className="pintro__facts" data-reveal="up">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="label">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
