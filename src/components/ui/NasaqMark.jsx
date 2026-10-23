import { brandAssets } from '../../data/siteConfig';

/*
 * The official NASAQ symbol, rendered as its four constituent pieces.
 * Each piece is the untouched official artwork clipped to one quadrant, so the
 * assembled state is pixel-identical to the supplied logo. Splitting it lets
 * the pieces move independently (separate ↔ aligned) without redrawing the mark.
 */

const SYMBOL_SRC = brandAssets.symbol.src;
const QUADRANTS = ['tl', 'tr', 'bl', 'br'];

function Quadrant({ quadrant }) {
  return (
    <img
      className={`quad quad--${quadrant}`}
      src={SYMBOL_SRC}
      alt=""
      width="470"
      height="470"
      draggable="false"
      decoding="async"
    />
  );
}

export default function NasaqMark({ className = '' }) {
  return (
    <div className={`mark ${className}`} aria-hidden="true">
      {QUADRANTS.map((q) => (
        <span key={q} className="mark__piece" data-quadrant={q}>
          <Quadrant quadrant={q} />
        </span>
      ))}
    </div>
  );
}

// The same four pieces, parked on the corners of a frame: the NASAQ frame system.
export function CornerMarks({ className = '' }) {
  return (
    <div className={`corners ${className}`} aria-hidden="true">
      {QUADRANTS.map((q) => (
        <span key={q} className={`corners__piece corners__piece--${q}`} data-quadrant={q}>
          <Quadrant quadrant={q} />
        </span>
      ))}
    </div>
  );
}
