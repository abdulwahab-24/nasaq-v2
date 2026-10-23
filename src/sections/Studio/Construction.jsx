import { CIRCLES, GUIDES, HALF_SQ, LONG, R, SIZE } from './geometry';

// The symbol's construction drawing: four circles, their squares and the guides.
export default function Construction() {
  return (
    <svg className="sc" viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" focusable="false">
      <g className="sc__guides">
        {GUIDES.map((v) => (
          <line key={`h${v}`} className="sc__line sc__line--h" x1={-LONG} x2={LONG} y1={v} y2={v} />
        ))}
        {GUIDES.map((v) => (
          <line key={`v${v}`} className="sc__line sc__line--v" x1={v} x2={v} y1={-LONG} y2={LONG} />
        ))}
      </g>
      {CIRCLES.map((c) => (
        <g key={c.id} className="sc__circle" data-c={c.id}>
          <circle cx={c.x} cy={c.y} r={R} />
          <rect
            className="sc__square"
            x={c.x - HALF_SQ}
            y={c.y - HALF_SQ}
            width={HALF_SQ * 2}
            height={HALF_SQ * 2}
            pathLength="1"
          />
        </g>
      ))}
    </svg>
  );
}
