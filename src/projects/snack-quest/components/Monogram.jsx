import ResponsiveImage from '../../../components/ui/ResponsiveImage';
import { Level } from './Bits';
import Pixels from './Pixels';

/*
 * Level 1: the monogram. The presentation's monogram page (SQ in each of the
 * identity's colours on its purple) is laid straight onto the page's own purple, so
 * the five marks stand on the page itself; it arrives as a pixel dissolve.
 */
export default function Monogram({ project }) {
  const { monogram: copy } = project.copy;
  return (
    <section className="sq-mono" aria-labelledby="sq-mono-title">
      <header className="sq-head">
        <Level n={1} title={copy.label} />
        <h2 className="sq-head__title" id="sq-mono-title">
          {copy.title}
        </h2>
      </header>
      <figure className="sq-mono__strip">
        <ResponsiveImage media={project.media.monogram} sizes="100vw" />
        <Pixels colour="#4D3468" cells={4} />
      </figure>
    </section>
  );
}
