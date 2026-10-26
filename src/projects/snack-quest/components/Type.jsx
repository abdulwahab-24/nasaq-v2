import { useId } from 'react';
import { Flames, Level } from './Bits';

/*
 * Level 2: the typeface, set live. As on the presentation's type page, the slogan
 * runs in a ring around the specimen (an SVG text path in Pixelify Sans) on the
 * identity's red, with the flames along the bottom; here the ring turns, a tick at
 * a time (CSS, steps), and the alphabet inside is real text.
 */
const PAIRS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c) => `${c}${c.toLowerCase()}`);

export default function Type({ project }) {
  const { type: copy, slogan } = project.copy;
  const ring = useId();
  return (
    <section className="sq-type" aria-labelledby="sq-type-title">
      <header className="sq-head">
        <Level n={2} title={copy.label} />
      </header>

      <div className="sq-type__stage">
        <svg className="sq-type__ring" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
          <defs>
            <path id={ring} d="M200,200 m-176,0 a176,176 0 1,1 352,0 a176,176 0 1,1 -352,0" />
          </defs>
          <text>
            <textPath href={`#${ring}`} textLength="1100" lengthAdjust="spacing">
              {`${slogan} ${slogan} `}
            </textPath>
          </text>
        </svg>
        <div className="sq-type__specimen">
          <h2 className="sq-type__name" id="sq-type-title">
            {copy.face}
          </h2>
          <p className="sq-type__set">
            {PAIRS.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </p>
        </div>
      </div>
      <Flames />
    </section>
  );
}
