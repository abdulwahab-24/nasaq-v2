import { useLayoutEffect, useRef } from 'react';
import { COLOURS, gsap, LOGO, MOTION_OK, NB } from '../nurba.motion';

/*
 * The pattern, as board 6 sets it, rebuilt live so it can move: N and B from the
 * wordmark (the traced letters) alternating with the four-point glint, in light
 * blue on navy, a checkerboard in which every row starts one step on from the last.
 * Holding the screen, the rows are set from the middle outwards; then a line of
 * light crosses the field diagonally, turning each glint gold as it passes.
 *
 * Laid out to the screen: whole steps across, as many rows as fill it.
 */
const STEP = { min: 34, vw: 0.034, max: 62 }; // board 6: 53 px steps on a 1920 px board
const letter = (name) => {
  const [, , w, h] = LOGO.parts[name];
  return { src: `url(/work/nurba/parts/${name}.png)`, ratio: `${w} / ${h}` };
};
const N = letter('latin-0');
const B = letter('latin-3');

export default function Pattern({ project }) {
  const rootRef = useRef(null);
  const fieldRef = useRef(null);
  const { pattern: copy } = project.copy;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const field = fieldRef.current;

    const layout = () => {
      const { width, height } = field.getBoundingClientRect();
      const step = Math.min(STEP.max, Math.max(STEP.min, width * STEP.vw));
      const cols = Math.ceil(width / step) + 1;
      const rows = Math.ceil(height / step) + 1;
      field.style.setProperty('--step', `${step}px`);
      field.style.setProperty('--cols', cols);
      const cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const el = document.createElement('span');
          if ((r + c) % 2 === 0) {
            el.className = 'nb-pattern__glint';
          } else {
            const L = Math.floor(c / 2) % 2 === 0 ? N : B;
            el.className = 'nb-pattern__letter';
            el.style.setProperty('--src', L.src);
            el.style.setProperty('--ratio', L.ratio);
          }
          cells.push(el);
        }
      }
      field.replaceChildren(...cells);
      return { cols, rows };
    };
    let grid = layout();

    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const build = () => {
        const glints = field.querySelectorAll('.nb-pattern__glint');
        const order = { grid: [grid.rows, grid.cols] };
        return gsap
          .timeline({
            scrollTrigger: { trigger: root, start: 'top top', end: '+=150%', pin: true, scrub: 0.8 },
          })
          .from(
            field.children,
            { y: -10, opacity: 0, duration: 0.3, ease: NB.set, stagger: { ...order, from: 'center', amount: 0.4 } },
            0,
          )
          .from(
            root.querySelectorAll('.nb-pattern__cap > *'),
            { opacity: 0, y: 12, duration: 0.15, stagger: 0.04 },
            0.5,
          )
          .to(
            glints,
            { backgroundColor: COLOURS.gold, duration: 0.06, stagger: { ...order, from: 'start', amount: 0.45 } },
            0.62,
          )
          .to(
            glints,
            { backgroundColor: COLOURS.blue, duration: 0.1, stagger: { ...order, from: 'start', amount: 0.45 } },
            0.7,
          )
          .to({}, { duration: 0.1 });
      };
      let tl = build();
      // a much wider or narrower screen changes the number of steps: lay out and build again
      let lastW = field.offsetWidth;
      const onResize = () => {
        if (Math.abs(field.offsetWidth - lastW) < 40) return;
        lastW = field.offsetWidth;
        tl.scrollTrigger.kill();
        tl.revert();
        grid = layout();
        tl = build();
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="nb-pattern" ref={rootRef} aria-labelledby="nb-pattern-title">
      <div
        className="nb-pattern__field"
        ref={fieldRef}
        role="img"
        aria-label="The NURBA pattern: N, glint, B, glint, in alternating rows"
      />
      <div className="nb-pattern__cap">
        <p className="nb-label">
          <span>{copy.label}</span>
          <span lang="ar" dir="rtl">
            {copy.labelAr}
          </span>
        </p>
        <h2 className="nb-pattern__text" id="nb-pattern-title">
          {copy.text}
        </h2>
      </div>
    </section>
  );
}
