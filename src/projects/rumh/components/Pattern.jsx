import { useLayoutEffect, useRef } from 'react';
import { ANGLE, gsap, MOTION_OK, RM } from '../rumh.motion';

/*
 * The pattern, rebuilt live from its geometry instead of shown as a picture.
 * On the guidelines' pattern pages each tile holds one asterisk: two pairs of bars
 * crossing at its centre along the spearhead's two angles, each bar running out to
 * the tile's edge, where it meets the bar of the next tile. Tiles alternate red and
 * navy on white. Here every asterisk grows out of its own centre, the ones nearest
 * the middle of the screen first, until the arms meet and the lattice locks.
 */
const K = 0.5 * Math.tan(ANGLE * (Math.PI / 180)); // where an arm crosses the tile edge, off centre (× tile)
const BAR = 0.105; // bar width (× tile), measured on the pattern pages
const ARMS = [
  [0.5 - K, 0, 0.5 + K, 1],
  [0.5 + K, 0, 0.5 - K, 1],
  [0, 0.5 - K, 1, 0.5 + K],
  [0, 0.5 + K, 1, 0.5 - K],
];

// columns and rows enough to cover the lattice box at its current tile size (--tile)
function measure(el) {
  const { width, height } = el.getBoundingClientRect();
  const tile = parseFloat(getComputedStyle(el).getPropertyValue('--tile')) || 160;
  return { cols: Math.ceil(width / tile) + 1, rows: Math.ceil(height / tile) + 1, tile, width, height };
}

export default function Pattern({ project }) {
  const rootRef = useRef(null);
  const fieldRef = useRef(null);
  const { pattern } = project.copy;

  useLayoutEffect(() => {
    const field = fieldRef.current;
    const svg = field.querySelector('svg');
    const NS = 'http://www.w3.org/2000/svg';
    let lines = [];
    let built = '';

    const build = () => {
      const { cols, rows, tile, width, height } = measure(field);
      const key = `${cols}x${rows}x${tile}`;
      if (key === built) return;
      built = key;
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.querySelectorAll('g').forEach((g) => g.remove());
      lines = [];
      // centred on the box, so the middle tile sits in the middle
      const ox = (width - cols * tile) / 2;
      const oy = (height - rows * tile) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const g = document.createElementNS(NS, 'g');
          g.setAttribute('clip-path', 'url(#rm-tile)');
          g.setAttribute('stroke', (r + c) % 2 ? 'var(--rm-navy)' : 'var(--rm-red)');
          g.setAttribute('stroke-width', BAR * tile);
          const [x, y] = [ox + c * tile, oy + r * tile];
          ARMS.forEach(([x1, y1, x2, y2]) => {
            const l = document.createElementNS(NS, 'line');
            l.setAttribute('x1', x + x1 * tile);
            l.setAttribute('y1', y + y1 * tile);
            l.setAttribute('x2', x + x2 * tile);
            l.setAttribute('y2', y + y2 * tile);
            l.dataset.d = Math.hypot(x + tile / 2 - width / 2, y + tile / 2 - height / 2);
            g.append(l);
            lines.push(l);
          });
          svg.append(g);
        }
      }
    };
    build();

    let mm;
    const animate = () => {
      mm?.revert();
      mm = gsap.matchMedia(rootRef.current);
      mm.add(MOTION_OK, () => {
        const far = Math.max(...lines.map((l) => +l.dataset.d)) || 1;
        gsap.fromTo(
          lines,
          { drawSVG: '50% 50%' },
          {
            drawSVG: '0% 100%',
            ease: 'power2.out',
            duration: 0.35,
            stagger: (i) => (+lines[i].dataset.d / far) * 0.65,
            scrollTrigger: { trigger: field, start: 'top 85%', end: 'center 45%', scrub: RM.scrub },
          },
        );
      });
    };
    animate();

    const ro = new ResizeObserver(() => {
      const before = built;
      build();
      if (built !== before) animate();
    });
    ro.observe(field);
    return () => {
      ro.disconnect();
      mm?.revert();
    };
  }, []);

  return (
    <section className="rm-pattern" ref={rootRef} aria-labelledby="rm-pattern-title">
      <div className="rm-pattern__field" ref={fieldRef} role="img" aria-label={pattern.artLabel}>
        <svg focusable="false" aria-hidden="true">
          <defs>
            <clipPath id="rm-tile" clipPathUnits="objectBoundingBox">
              <rect width="1" height="1" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="rm-pattern__text">
        <p className="rm-label">
          <span>{pattern.label}</span>
          <span lang="ar" dir="rtl">
            {pattern.labelAr}
          </span>
        </p>
        <h2 className="rm-pattern__title" id="rm-pattern-title">
          {pattern.title}
        </h2>
        <p className="rm-pattern__body">{pattern.text}</p>
      </div>
    </section>
  );
}
