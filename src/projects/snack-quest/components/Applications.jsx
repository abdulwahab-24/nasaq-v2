import ResponsiveImage from '../../../components/ui/ResponsiveImage';
import { Flames, Level } from './Bits';
import Pixels from './Pixels';

/*
 * The identity in use, each picture arriving as a pixel dissolve in its section's colour.
 *   Packaging  the bag and boxes across the screen (photographed on cream above
 *              purple, so the page turns from one to the other through the
 *              picture), then the fries, the poster and the full set of packs
 *   Spaces     the restaurant: the red wall with the slogan ring, and the dining
 *              room's burger wall from two sides
 */
export function Packaging({ project }) {
  const { packaging: copy } = project.copy;
  const { products, fries, poster, applications } = project.media;
  return (
    <section className="sq-pack" aria-labelledby="sq-pack-title">
      <header className="sq-head">
        <Level n={4} title={copy.label} />
        <h2 className="sq-head__title" id="sq-pack-title">
          {copy.title}
        </h2>
      </header>
      <figure className="sq-pack__wide">
        <ResponsiveImage media={products} sizes="100vw" />
        <Pixels colour="#F4E8C6" cells={6} />
      </figure>
      <div className="sq-pack__grid">
        <figure className="sq-frame sq-pack__fries">
          <ResponsiveImage media={fries} sizes="(min-width: 768px) 30vw, 60vw" />
          <Pixels colour="#4D3468" />
        </figure>
        <figure className="sq-frame sq-pack__poster">
          <ResponsiveImage media={poster} sizes="(min-width: 768px) 34vw, 70vw" />
          <Pixels colour="#4D3468" />
        </figure>
        <figure className="sq-frame sq-pack__set">
          <ResponsiveImage media={applications} sizes="(min-width: 768px) 26vw, 60vw" />
          <Pixels colour="#4D3468" />
        </figure>
      </div>
    </section>
  );
}

export function Spaces({ project }) {
  const { spaces: copy } = project.copy;
  const { interior, wallA, wallB } = project.media;
  return (
    <section className="sq-space" aria-labelledby="sq-space-title">
      <Flames flip />
      <header className="sq-head">
        <Level n={5} title={copy.label} />
        <h2 className="visually-hidden" id="sq-space-title">
          {copy.label}
        </h2>
      </header>
      <figure className="sq-space__wide">
        <ResponsiveImage media={interior} sizes="100vw" />
        <Pixels colour="#BA2F2F" cells={10} />
      </figure>
      <div className="sq-space__pair">
        <figure className="sq-frame">
          <ResponsiveImage media={wallA} sizes="(min-width: 768px) 46vw, 90vw" />
          <Pixels colour="#BA2F2F" />
        </figure>
        <figure className="sq-frame">
          <ResponsiveImage media={wallB} sizes="(min-width: 768px) 46vw, 90vw" />
          <Pixels colour="#BA2F2F" />
        </figure>
      </div>
    </section>
  );
}
