import { useLayoutEffect } from 'react';
import { ScrollTrigger } from '../../motion/gsap';
import { Packaging, Spaces } from './components/Applications';
import Colour from './components/Colour';
import Finale from './components/Finale';
import Monogram from './components/Monogram';
import Opening from './components/Opening';
import Type from './components/Type';

/*
 * Snack Quest. A page played like a game.
 *
 * The identity is 8-bit: a pixel logo plate, Pixelify Sans, pixel flames, sprites, a
 * slogan spelled the way a game would spell it. So the page is a run of levels and
 * moves the way such a game moves: in whole pixels and whole frames. Letters are
 * typed, pictures arrive as pixel dissolves, colours rise like a meter, loops tick;
 * the flames mark the edges between levels.
 *
 *   Opening    the start screen: the plate wiped on, the name typed in by a cursor
 *   Monogram   level 1, SQ in each colour, on its purple
 *   Type       level 2, Pixelify Sans inside the turning slogan ring, on red
 *   Colour     level 3, five stepped bars and two sprites, on black
 *   Packaging  level 4, the packs, from cream into purple
 *   Spaces     level 5, the restaurant, on red
 *   Finale     the logo film and the slogan strip
 *
 * Content and media: snack-quest.data.js. Styles: snack-quest.css.
 * Logo geometry, eases, the pixel cover: snack-quest.motion.js.
 */
export default function SnackQuestPage({ project }) {
  // the page arrives as its own chunk, after the rest of the project page: measure again
  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="sq">
      <Opening project={project} />
      <Monogram project={project} />
      <Type project={project} />
      <Colour project={project} />
      <Packaging project={project} />
      <Spaces project={project} />
      <Finale project={project} />
    </div>
  );
}
