import { useLayoutEffect, useRef } from 'react';
import NasaqMark from '../components/NasaqMark';
import ResponsiveImage from '../components/ResponsiveImage';
import { about } from '../data/site';
import { COMPACT, FINE_POINTER, gsap, MOTION_OK, STAGED } from '../motion/gsap';
import { img } from '../utils/media';

/*
 * Studio — one chapter, told by one piece of geometry.
 *
 *   I    Construction   four circles drift in from far apart, find their 2 × 2
 *                       alignment, and the official symbol resolves inside them.
 *   II   Bridge         the symbol settles onto the crossing of its own two
 *                       construction axes; the axes run on across the screen.
 *   III  Studio         "Studio" and "الاستوديو" land on that horizontal axis from
 *                       opposite sides of the symbol; the portrait rises behind.
 *   IV   System         the axis opens, like a slit, onto the identity in use.
 *   V    Message        the studio in its own words; its colours arrive out of
 *                       step and settle onto one line.
 *   VI   Resolution     the vertical axis runs down to a closed symbol, and on
 *                       into Contact.
 *
 * I–III are one pinned, scrubbed timeline (shorter on small screens); IV–VI
 * each have a single timeline. Everything animates transforms, opacity,
 * clip-path or SVG strokes only. The CSS is the resolved state, so without
 * motion (or JS) every scene simply shows its final composition.
 */

const portrait = img('studio/portrait', 'Portrait in shadow, lit by a blue rim light — NASAQ identity photography');
const billboard = img('studio/billboard', 'The NASAQ wordmark on a sign mounted to a steel frame');
const badge = img('studio/badge', 'NASAQ identity badge with the slash pattern, on a blue lanyard');

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
// Guides through the mark's outer edges and either side of its central gap.
const GUIDES = [0, MID - T / 2, MID + T / 2, SIZE];
const LONG = 6000;

/* Fragmented state, in symbol units from each circle's resting place: far
   apart and much larger, so they read as sweeping arcs rather than rings. */
const SCATTER = {
  tl: { x: -1.5 * SIZE, y: -0.55 * SIZE, scale: 5.2 },
  tr: { x: 1.9 * SIZE, y: -1.1 * SIZE, scale: 3.6 },
  bl: { x: -2.3 * SIZE, y: 0.9 * SIZE, scale: 6.4 },
  br: { x: 1.3 * SIZE, y: 0.7 * SIZE, scale: 4.4 },
};
// Each quarter of the symbol arrives along its own diagonal.
const OUT = { tl: [-1, -1], tr: [1, -1], bl: [-1, 1], br: [1, 1] };

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

/* ---------- I–III: construction → bridge → Studio (one timeline) ---------- */
function opening(q, { pin, distance }) {
  const scene = q('.studio__scene')[0];
  const box = q('.studio__markbox')[0];
  // The symbol starts large in the middle of the screen (never beyond its 470 px
  // artwork) and ends small on the axis crossing, where the CSS places it.
  const bigScale = () => Math.min(scene.clientHeight * 0.46, scene.clientWidth * 0.62, SIZE) / box.offsetWidth;
  const toCentre = () => scene.clientHeight / 2 - (box.offsetTop + box.offsetHeight / 2);
  const piece = (el) => OUT[el.dataset.quadrant];

  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    scrollTrigger: {
      id: 'studio',
      trigger: scene,
      start: pin ? 'top top' : 'top 80%',
      end: pin ? `+=${distance}%` : 'bottom bottom',
      pin,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // from/fromTo tweens render their starting state at once, so everything that
  // belongs to scenes II and III is already out of sight while scene I plays.

  /* I — fragmented → aligned */
  tl.set(q('.sc'), { opacity: 1 }, 0)
    .addLabel('fragments', 0)
    .fromTo(
      q('.sc__circle'),
      {
        x: (i, el) => SCATTER[el.dataset.c].x,
        y: (i, el) => SCATTER[el.dataset.c].y,
        scale: (i, el) => SCATTER[el.dataset.c].scale,
        opacity: 0.55,
      },
      { x: 0, y: 0, scale: 1, opacity: 1, duration: 3.4, stagger: 0.22 },
      'fragments',
    )
    .fromTo(q('.sc__line--h'), { scaleX: 0 }, { scaleX: 1, duration: 1.6, stagger: 0.12, ease: 'power2.inOut' }, 1.6)
    .fromTo(q('.sc__line--v'), { scaleY: 0 }, { scaleY: 1, duration: 1.6, stagger: 0.12, ease: 'power2.inOut' }, 1.8)
    .addLabel('aligned', 4.1)
    .fromTo(q('.sc__square'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.08, ease: 'power2.inOut' }, 'aligned-=0.5')
    // the official symbol: four quarters closing along their diagonals
    .fromTo(
      q('.studio__markbox .mark__piece'),
      {
        xPercent: (i, el) => piece(el)[0] * 16,
        yPercent: (i, el) => piece(el)[1] * 16,
        rotate: (i, el) => piece(el)[0] * piece(el)[1] * -18,
        opacity: 0,
      },
      { xPercent: 0, yPercent: 0, rotate: 0, opacity: 1, duration: 1.1, stagger: 0.07, ease: 'power3.out' },
      'aligned',
    )
    .to(q('.sc__circle'), { opacity: 0.3, duration: 0.7, ease: 'power1.out' }, 'aligned+=0.7')
    .addLabel('symbol', 5.6);

  /* II — the symbol finds its place; its axes carry on across the screen */
  tl.fromTo(box, { scale: bigScale, y: toCentre }, { scale: 1, y: 0, duration: 1.8 }, 'symbol')
    .to(q('.sc'), { opacity: 0, duration: 0.9, ease: 'power1.in' }, 'symbol')
    .fromTo(q('.studio__axis--h'), { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'expo.inOut' }, 'symbol+=0.5')
    .fromTo(q('.studio__axis--v'), { scaleY: 0 }, { scaleY: 1, duration: 1.5, ease: 'expo.inOut' }, 'symbol+=0.65')
    .addLabel('axis', 7.4);

  /* III — two scripts, one baseline */
  tl.fromTo(
    q('.studio__portrait'),
    { opacity: 0, yPercent: 9 },
    { opacity: 1, yPercent: 0, duration: 1.9, ease: 'power2.out' },
    'axis-=0.9',
  )
    .fromTo(
      q('.studio__en'),
      { opacity: 0, xPercent: -22, yPercent: 34 },
      { opacity: 1, xPercent: 0, yPercent: 0, duration: 1.4, ease: 'power3.out' },
      'axis-=0.35',
    )
    .fromTo(
      q('.studio__ar'),
      { opacity: 0, xPercent: 22, yPercent: -40 },
      { opacity: 1, xPercent: 0, yPercent: 0, duration: 1.4, ease: 'power3.out' },
      'axis-=0.2',
    )
    .addLabel('studio', 8.9)
    // a held beat, so the composition is read before the page moves on
    .to({}, { duration: 0.9 });

  // Before the scene is pinned it is already on its way in: the scattered arcs
  // turn slowly towards their alignment, so the screen is never still.
  if (pin) {
    gsap.fromTo(
      q('.sc'),
      { rotate: -14 },
      { rotate: 0, ease: 'none', scrollTrigger: { trigger: scene, start: 'top bottom', end: 'top top', scrub: 0.6 } },
    );
  }

  return tl;
}

/* ---------- IV: the axis opens onto the identity in use ---------- */
function system(q) {
  const root = q('.studio__system')[0];
  return gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root, start: 'top 82%', end: 'center 48%', scrub: 0.6 },
    })
    .fromTo(q('.studio__slit'), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.inOut' }, 0)
    .fromTo(
      q('.studio__billboard'),
      { clipPath: 'inset(49.6% 0% 49.6% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power2.inOut' },
      0.2,
    )
    .fromTo(q('.studio__billboard img'), { scale: 1.16 }, { scale: 1, duration: 0.8 }, 0.2)
    .fromTo(q('.studio__slit'), { opacity: 1 }, { opacity: 0, duration: 0.2 }, 0.5)
    // the badge arrives out of line and hangs true
    .fromTo(
      q('.studio__badge'),
      { yPercent: 24, rotate: 5, opacity: 0 },
      { yPercent: 0, rotate: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
      0.45,
    )
    .fromTo(q('.studio__pattern'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.5);
}

/* ---------- V: message, then the colours settle onto one line ---------- */
function message(q) {
  return gsap
    .timeline({ scrollTrigger: { trigger: q('.studio__message')[0], start: 'top 74%', once: true } })
    .from(q('.studio__lead'), { x: -36, opacity: 0, duration: 1.2, ease: 'expo.out' }, 0)
    .from(q('.studio__body'), { x: 36, opacity: 0, duration: 1.2, ease: 'expo.out' }, 0.12)
    .from(
      q('.system__chip'),
      { y: (i) => [44, -30, 62, -18, 50, -40, 26][i % 7], opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05 },
      0.3,
    );
}

/* ---------- VI: the axis runs down to a closed symbol ---------- */
function resolution(q) {
  const piece = (el) => OUT[el.dataset.quadrant];
  return gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: q('.studio__out')[0], start: 'top 88%', end: 'bottom 62%', scrub: 0.6 },
    })
    .fromTo(q('.studio__drop'), { scaleY: 0 }, { scaleY: 1, duration: 0.7 }, 0)
    .fromTo(
      q('.studio__out .mark__piece'),
      { xPercent: (i, el) => piece(el)[0] * 26, yPercent: (i, el) => piece(el)[1] * 26, opacity: 0.4 },
      { xPercent: 0, yPercent: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
      0.55,
    );
}

export default function Studio() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia(root);

    mm.add({ staged: STAGED, compact: COMPACT, motion: MOTION_OK, pointer: FINE_POINTER }, (ctx) => {
      const { staged, motion, pointer } = ctx.conditions;
      if (!motion) return undefined;

      // Desktop holds the scene for the whole story; small portrait screens for a
      // shorter one; short landscape screens are not pinned at all.
      const portraitScreen = window.matchMedia('(orientation: portrait)').matches;
      const pin = staged || portraitScreen;
      opening(q, { pin, distance: staged ? 210 : 130 });
      system(q);
      message(q);
      resolution(q);

      // The portrait leans a little towards the pointer — capable desktops only.
      if (!staged || !pointer) return undefined;
      const scene = q('.studio__scene')[0];
      const figure = q('.studio__portrait img')[0];
      const x = gsap.quickTo(figure, 'x', { duration: 0.9, ease: 'power3' });
      const onMove = (e) => x((e.clientX / window.innerWidth - 0.5) * -18);
      scene.addEventListener('pointermove', onMove);
      return () => scene.removeEventListener('pointermove', onMove);
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="studio" id="studio" ref={rootRef} aria-labelledby="studio-title">
      {/* I–III */}
      <div className="studio__scene">
        <span className="studio__axis studio__axis--v" aria-hidden="true" />

        <div className="studio__portrait">
          <ResponsiveImage media={portrait} sizes="(min-width: 1024px) 50vw, 110vw" />
        </div>

        <span className="studio__axis studio__axis--h" aria-hidden="true" />

        {/* One heading, two scripts, meeting at the symbol */}
        <h2 className="studio__title" id="studio-title" tabIndex={-1}>
          <span className="studio__en">Studio</span>{' '}
          <span className="studio__ar" lang="ar" dir="rtl">
            الاستوديو
          </span>
        </h2>

        <div className="studio__markbox" aria-hidden="true">
          <Construction />
          <NasaqMark />
        </div>
      </div>

      {/* IV */}
      <div className="studio__system">
        <span className="studio__slit" aria-hidden="true" />
        <figure className="studio__billboard">
          <ResponsiveImage media={billboard} sizes="(min-width: 1024px) 74vw, 100vw" />
        </figure>
        <figure className="studio__badge">
          <ResponsiveImage media={badge} sizes="(min-width: 1024px) 24vw, 52vw" />
        </figure>
        <span className="studio__pattern" aria-hidden="true" />
      </div>

      {/* V */}
      <div className="studio__message">
        <p className="studio__lead">{about[0]}</p>
        <p className="studio__body">{about[1]}</p>
        <ul className="system" aria-label="The NASAQ colours">
          {PALETTE.map((c) => (
            <li key={c.hex} className="system__chip" style={{ '--chip': c.hex }}>
              <span className="system__name">{c.name}</span>
              <span className="system__hex">{c.hex}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* VI */}
      <div className="studio__out" aria-hidden="true">
        <span className="studio__drop" />
        <NasaqMark className="studio__close" />
      </div>
    </section>
  );
}
