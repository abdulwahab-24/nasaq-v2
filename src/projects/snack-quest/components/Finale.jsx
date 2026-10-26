import LogoMotion from '../../../components/projects/LogoMotion';
import { Ticker } from './Ticker';

/*
 * Closing: the logo film (the plate appearing pixel by pixel and the letters typed
 * in, rendered from the official logo by scripts/logo-motion/) on the purple it was
 * filmed on, then the slogan strip marching along the bottom, the page's last word.
 */
export default function Finale({ project }) {
  const strip = project.sig.ticker;
  return (
    <section className="sq-finale" aria-label={project.copy.finale.label}>
      {project.motionLogo && <LogoMotion film={project.motionLogo} seamless className="sq-finale__film" />}
      <Ticker strip={strip} label={strip.alt} />
    </section>
  );
}
