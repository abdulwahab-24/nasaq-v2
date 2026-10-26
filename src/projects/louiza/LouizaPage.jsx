import { useLayoutEffect } from 'react';
import { ScrollTrigger } from '../../motion/gsap';
import Applications from './components/Applications';
import Colour from './components/Colour';
import Construction from './components/Construction';
import Finale from './components/Finale';
import Opening from './components/Opening';
import Pattern from './components/Pattern';
import Words from './components/Words';

/*
 * Louiza — لويزا. One system, from the logo outward.
 *
 * Grid: twelve columns. The left column is the spine: every index, label and caption
 * starts there; titles start at the fourth column. Every section is opened by the
 * same header (components/Head.jsx) and spaced by the same rhythm (--lz-pad).
 * Colour: Antique White is the page; the identity's soft field (rose and blue blurred
 * over it) frames the identity itself; Pacific Blue and Rosy Taupe each own one
 * section, where the identity's own pages use them. Chocolate Plum is the text,
 * Smoky Rose the accent. Sections melt into each other through their colours.
 * Motion: grow, write, settle (louiza.motion.js); three scenes hold the screen.
 *
 * Each section is made from the one before it:
 *   Opening       the logo assembles on the soft field, then becomes the mark (01)
 *   Construction  the mark's leaf opens onto the construction page (02)
 *   Words         the typography page's four words (03)
 *   Colour        the six columns and the blurred band across them (04)
 *   Pattern       the mark repeated outward from the logo, then two plates (05)
 *   Applications  starting from the box lined with that pattern (06)
 *   Finale        the logo film on Rosy Taupe, the four words
 *
 * Content and media: louiza.data.js. Styles: louiza.css. Geometry and motion: louiza.motion.js.
 */
export default function LouizaPage({ project }) {
  // the page arrives as its own chunk, after the rest of the project page: measure again
  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="lz">
      <Opening project={project} />
      <Construction project={project} />
      <Words project={project} />
      <Colour project={project} />
      <Pattern project={project} />
      <Applications project={project} />
      <Finale project={project} />
    </div>
  );
}
