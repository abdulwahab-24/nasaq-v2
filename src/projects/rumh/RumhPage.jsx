import { useLayoutEffect } from 'react';
import { ScrollTrigger } from '../../motion/gsap';
import { ArtDirection, Digital, Objects, Sign, Wayfinding } from './components/Applications';
import Colour from './components/Colour';
import Concept from './components/Concept';
import Finale from './components/Finale';
import Lockups from './components/Lockups';
import Mark from './components/Mark';
import Opening from './components/Opening';
import Pattern from './components/Pattern';
import Traits from './components/Traits';

/*
 * Rumh — رمح. A page built on one point and two angles.
 *
 * The identity is about precision: everything aimed at a single point. Its mark is a
 * square with one corner raised into a spearhead, and its pattern's arms follow the
 * same two angles as the mark's edges. The page is drawn on that geometry, and the
 * mark is its aperture: the opening ends by opening the mark onto the screen, and two
 * of the photographs are seen first through it. Motion is still, then fast, then
 * stops dead.
 *
 * Colour moves in a rhythm of whole screens, from the identity's three colours:
 * navy (opening) → red (concept, the aperture's red) → navy (traits) → white (the
 * logo chapter: mark, lockups, pattern) → navy | red | white (colour) → the
 * photographs, each full-bleed → navy (close). Red owns the concept, the colour
 * panel and the badges; elsewhere it is only the mark.
 *
 *   Opening       eight lines meet at one point; the spearhead lands on it, then opens
 *   Concept       the two key concepts on red, divided by a navy spear
 *   Traits        the six personality words, each on the identity's flag
 *   Mark          a square, its corner raised into a spear; then at falling sizes
 *   Lockups       the four supplied arrangements of the logo, in navy on white
 *   Pattern       the lattice, rebuilt live from its geometry
 *   Colour        navy, red, white: three straight panels
 *   ArtDirection  a spearhead on stone, opened through the mark
 *   Wayfinding    the gate sign, revealed by one slanted cut
 *   Sign          the acrylic plaque, opened through the mark
 *   Objects       key rings on white beside badges on the red pattern
 *   Digital       the phone on the red-to-navy gradient
 *   Finale        the logo film, on its own navy
 *
 * Content and media: rumh.data.js. Styles: rumh.css. Geometry and easing: rumh.motion.js.
 */
export default function RumhPage({ project }) {
  // the page arrives as its own chunk, after the rest of the project page: measure again
  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="rm">
      <Opening project={project} />
      <Concept project={project} />
      <Traits project={project} />
      <Mark project={project} />
      <Lockups project={project} />
      <Pattern project={project} />
      <Colour project={project} />
      <ArtDirection project={project} />
      <Wayfinding project={project} />
      <Sign project={project} />
      <Objects project={project} />
      <Digital project={project} />
      <Finale project={project} />
    </div>
  );
}
