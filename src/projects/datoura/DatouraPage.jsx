import { useLayoutEffect } from 'react';
import { ScrollTrigger } from '../../motion/gsap';
import { Card, Screen, Stadium } from './components/Applications';
import Colour from './components/Colour';
import Finale from './components/Finale';
import Idea from './components/Idea';
import Opening from './components/Opening';
import Type from './components/Type';
import Waves from './components/Waves';
import Wordmark from './components/Wordmark';

/*
 * DATOURA — a page built from the identity itself.
 *
 * The identity is one idea drawn many ways: contours that step, line by line,
 * from near-black to violet (the symbol, the graduated waves, the card). The
 * page is read the same way, travelling inward through the identity's colours,
 * from the near-black and deep violet of its ground to the Electric Violet at
 * the centre of every wave.
 *
 *   Opening    the supplied contour film, alive on the field; the wordmark built
 *   Idea       shield + waves + chart → the symbol → the lockup on its grid
 *   Wordmark   the outline wordmark, drawn and travelling
 *   Colour     the palette, each colour opening out of the symbol
 *   Type       Brando Arabic and DM Sans, stepping through their weights
 *   Waves      the graduated waves, assembled from the centre out
 *   Card       the card front at the scale of the screen, the printed card on it
 *   Stadium    the advertising board, opened through the contour
 *   Screen     the website, in the gradient it was shot in
 *   Finale     From Numbers to Vision, on Electric Violet
 *
 * Every drawing is the supplied vector artwork (art.json); photographs are the
 * supplied mockups. Content and media: datoura.data.js. Styles: datoura.css.
 */
export default function DatouraPage({ project }) {
  // the page arrives as its own chunk, after the rest of the project page: measure again
  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="dt">
      <Opening project={project} />
      <Idea project={project} />
      <Wordmark project={project} />
      <Colour project={project} />
      <Type project={project} />
      <Waves project={project} />
      <Card project={project} />
      <Stadium project={project} />
      <Screen project={project} />
      <Finale project={project} />
    </div>
  );
}
