import { useLayoutEffect } from 'react';
import { ScrollTrigger } from '../../motion/gsap';
import { Bags, Campaign, Card, Engraving, Envelopes, Vitrine } from './components/Applications';
import Colour from './components/Colour';
import Finale from './components/Finale';
import Lockups from './components/Lockups';
import Monogram from './components/Monogram';
import Opening from './components/Opening';
import Pattern from './components/Pattern';
import Statement from './components/Statement';

/*
 * NURBA — نوربا. A jeweller's identity, presented the way a piece is set.
 *
 * Its monogram sits in an octagon of two fine lines, the outline of a step-cut stone,
 * and its pattern alternates N and B with a four-point glint. The page is built from
 * those two things: the octagon is its one shape (the frame, the colour facets, the
 * opening the card is seen through, the corner of every caption) and the glint its
 * one light. Motion: trace, light, set, glint (nurba.motion.js); slow in, still at rest.
 *
 * Rhythm: navy (the stone, then the signature) → cream (one sentence, then the
 * monogram taken apart) → navy (the arrangements, the pattern) → cream (the colours
 * as facets) → the photographs, from the palest to the darkest → navy (the film).
 *
 *   Opening     the monogram is set and lit, then joined by its names
 *   Statement   what the identity is made of, in one sentence
 *   Monogram    two lines, one stem, one glint
 *   Lockups     the arrangements of board 16
 *   Pattern     N ✦ B, rebuilt live; a line of light crosses it
 *   Colour      seven colours as the facets of a stone
 *   Engraving · Vitrine · Bags · Card · Envelopes · Campaign
 *   Finale      the logo film and the identity's line
 *
 * Content and media: nurba.data.js. Styles: nurba.css. Geometry and motion: nurba.motion.js.
 */
export default function NurbaPage({ project }) {
  // the page arrives as its own chunk, after the rest of the project page: measure again
  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="nb">
      <Opening project={project} />
      <Statement project={project} />
      <Monogram project={project} />
      <Lockups project={project} />
      <Pattern project={project} />
      <Colour project={project} />
      <Engraving project={project} />
      <Vitrine project={project} />
      <Bags project={project} />
      <Card project={project} />
      <Envelopes project={project} />
      <Campaign project={project} />
      <Finale project={project} />
    </div>
  );
}
