import { useLayoutEffect, useRef } from 'react';
import ResponsiveImage from '../components/ResponsiveImage';
import { about } from '../data/site';
import { gsap, MOTION_OK, STAGED } from '../motion/gsap';
import useReveals from '../motion/useReveals';
import { img } from '../utils/media';

/*
 * Studio — fragmented → aligned → system.
 *
 * The NASAQ symbol is constructed from four circles: each has an inscribed
 * square, and the mark is formed by the circles' inner caps (identity sheet 02).
 * Here the four construction circles start scattered across the scene, close
 * into their 2 × 2 alignment, their squares draw in, and the official mark
 * (the supplied artwork, untouched) resolves exactly in their geometry.
 * At the same time "Studio" (behind the portrait) and "الاستوديو" (in front)
 * move from opposite offsets onto one shared baseline.
 *
 * Without motion (or JS) the CSS layout is the resolved final state.
 */

const portrait = img('studio/portrait', 'Portrait in shadow, lit by a blue rim light — NASAQ identity photography');
const badge = img('studio/badge', 'NASAQ identity badge with the slash pattern and wordmark');
const sign = img('studio/sign', 'NASAQ lockup on a sign, in black and white');

const PALETTE = [
  { name: 'Deep Navy', hex: '#000628' },
  { name: 'Black', hex: '#000000' },
  { name: 'Primary Blue', hex: '#374EFF' },
  { name: 'Secondary Blue', hex: '#4860FF' },
  { name: 'Light Blue', hex: '#C9D4FF' },
  { name: 'Soft White', hex: '#F7F7F7' },
  { name: 'White', hex: '#FFFFFF' },
];

/* Construction geometry, in the official symbol's own pixel units (470 × 470).
   t = cap thickness = gap; R = t / (1 − 1/√2); circle centres sit R + t/2 from
   the middle; the inscribed squares have side R√2. Verified against the artwork. */
const SIZE = 470;
const T = SIZE / 12.657;
const R = T / (1 - Math.SQRT1_2);
const C = R + T / 2;
const HALF_SQ = R * Math.SQRT1_2;
const MID = SIZE / 2;
const CIRCLES = [
  { id: 'tl', x: MID - C, y: MID - C },
  { id: 'tr', x: MID + C, y: MID - C },
  { id: 'bl', x: MID - C, y: MID + C },
  { id: 'br', x: MID + C, y: MID + C },
];
// Construction lines through the mark's outer edges and its central gap.
const GUIDES = [0, MID - T / 2, MID + T / 2, SIZE];
const LONG = 6000;

function Construction() {
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

// Where each circle starts, as a fraction of the scene (fragmented state).
const SCATTER = {
  tl: [0.34, 0.42],
  tr: [0.7, 0.08],
  bl: [0.12, 0.62],
  br: [0.84, 0.5],
};

// …and how large: the fragments begin as sweeping arcs, not small rings.
const SCALE = [6.5, 4.2, 7.5, 5];

function choreograph(root, q, { pinned }) {
  const svg = q('.sc')[0];
  // SVG units per CSS pixel, so circles can start anywhere in the scene.
  const unit = () => SIZE / svg.getBoundingClientRect().width;
  const sceneRect = () => q('.studio__scene')[0].getBoundingClientRect();
  const markRect = () => svg.getBoundingClientRect();
  const offset = (axis) => (i, el) => {
    const id = el.dataset.c;
    const s = sceneRect();
    const m = markRect();
    const [fx, fy] = SCATTER[id];
    const circle = CIRCLES.find((c) => c.id === id);
    const cx = m.left + (circle.x / SIZE) * m.width;
    const cy = m.top + (circle.y / SIZE) * m.height;
    const px = axis === 'x' ? s.left + fx * s.width - cx : s.top + fy * s.height - cy;
    return px * unit();
  };

  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    scrollTrigger: pinned
      ? {
          id: 'studio',
          trigger: q('.studio__scene')[0],
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
        }
      : {
          trigger: q('.studio__scene')[0],
          // resolves exactly as the scene fills the screen
          start: 'top 95%',
          end: 'top top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
  });

  // 1 — fragmented: guides draw, circles are scattered, words offset, portrait in shadow
  tl.fromTo(q('.sc__line--h'), { scaleX: 0 }, { scaleX: 1, duration: 0.35, stagger: 0.04 }, 0)
    .fromTo(q('.sc__line--v'), { scaleY: 0 }, { scaleY: 1, duration: 0.35, stagger: 0.04 }, 0.05)
    // 2 — reveal + 3 — alignment
    .fromTo(
      q('.sc__circle'),
      { x: offset('x'), y: offset('y'), scale: (i) => SCALE[i], opacity: 0.5 },
      { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.6, stagger: 0.03 },
      0,
    )
    .fromTo(q('.sc__square'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.25, stagger: 0.03 }, 0.55)
    .fromTo(q('.studio__mark'), { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.2 }, 0.78)
    .fromTo(q('.sc'), { opacity: 1 }, { opacity: 0.32, duration: 0.2 }, 0.82)
    .fromTo(q('.studio__shade'), { opacity: 0.94 }, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.05)
    .fromTo(
      q('.studio__portrait'),
      { yPercent: 7, xPercent: 4, scale: 1.06 },
      { yPercent: 0, xPercent: 0, scale: 1, duration: 0.75 },
      0,
    )
    .fromTo(q('.studio__en'), { xPercent: -16, yPercent: 26, opacity: 0.12 }, { xPercent: 0, yPercent: 0, opacity: 1, duration: 0.6 }, 0.12)
    .fromTo(q('.studio__ar'), { xPercent: -28, yPercent: -120, opacity: 0 }, { xPercent: 0, yPercent: 0, opacity: 1, duration: 0.6 }, 0.18)
    .fromTo(q('.studio__baseline'), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.inOut' }, 0.66)
    .fromTo(q('.studio__caption'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.15 }, 0.85);

  return tl;
}

export default function Studio() {
  const rootRef = useRef(null);
  useReveals(rootRef);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia(root);

    mm.add({ staged: STAGED, motion: MOTION_OK }, (ctx) => {
      const { staged, motion } = ctx.conditions;
      if (!motion) return;
      choreograph(root, q, { pinned: staged });

      // The colour system arrives out of step and settles onto one line.
      gsap.fromTo(
        q('.system__item'),
        { y: (i) => [56, -40, 90, -24, 64, -60, 30, -48, 72][i % 9] },
        {
          y: 0,
          ease: 'power2.out',
          scrollTrigger: { trigger: q('.system')[0], start: 'top 95%', end: 'center 60%', scrub: 0.6 },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="studio" id="studio" ref={rootRef} aria-labelledby="studio-title">
      <div className="studio__scene">
        <div className="studio__markbox">
          <Construction />
          <img className="studio__mark" src="/brand/nasaq-symbol-white.png" alt="" width="470" height="470" />
        </div>
        <p className="studio__caption label" aria-hidden="true">
          <span>Symbol construction</span>
          <span lang="ar" dir="rtl">
            بناء الرمز
          </span>
        </p>

        <span className="studio__baseline" aria-hidden="true" />

        {/* One heading, two scripts: English passes behind the portrait, Arabic in front */}
        <h2 className="studio__title" id="studio-title" tabIndex={-1}>
          <span className="studio__en">Studio</span>{' '}
          <span className="studio__ar" lang="ar" dir="rtl">
            الاستوديو
          </span>
        </h2>

        <div className="studio__portrait">
          <ResponsiveImage media={portrait} sizes="(min-width: 1024px) 50vw, 120vw" />
          <span className="studio__shade" aria-hidden="true" />
        </div>
      </div>

      <div className="studio__message">
        <p className="studio__lead" data-reveal="up">
          {about[0]}
        </p>
        <p className="studio__body" data-reveal="up">
          {about[1]}
        </p>
      </div>

      <ul className="system" aria-label="The NASAQ colour system and identity">
        {PALETTE.map((c) => (
          <li key={c.hex} className="system__item system__chip" style={{ '--chip': c.hex }}>
            <span className="system__name">{c.name}</span>
            <span className="system__hex">{c.hex}</span>
          </li>
        ))}
        <li className="system__item system__media">
          <ResponsiveImage media={badge} sizes="(min-width: 1024px) 18vw, 45vw" />
        </li>
        <li className="system__item system__media">
          <ResponsiveImage media={sign} sizes="(min-width: 1024px) 18vw, 45vw" />
        </li>
      </ul>
    </section>
  );
}
