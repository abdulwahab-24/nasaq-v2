import LogoMotion from '../../../components/projects/LogoMotion';

/*
 * Closing: the logo film (the spearhead thrown onto its mark, rendered from the
 * official logo by scripts/logo-motion/) laid straight onto the navy it was filmed
 * on, and the line the guidelines end their typography page with.
 */
export default function Finale({ project }) {
  return (
    <section className="rm-finale" aria-label={project.copy.finale.label}>
      {project.motionLogo && <LogoMotion film={project.motionLogo} seamless className="rm-finale__film" />}
      <p className="rm-finale__line">{project.copy.tagline}</p>
    </section>
  );
}
