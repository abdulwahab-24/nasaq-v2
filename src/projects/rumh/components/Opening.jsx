import { useLayoutEffect, useRef } from 'react';
import Arrow from '../../../components/ui/Arrow';
import { useTransition } from '../../../transition/context';
import TransitionLink from '../../../transition/TransitionLink';
import logoParts from '../logo-parts.json';
import { DIRECTIONS, gsap, introDone, MARK, MOTION_OK, pointsOf, RM } from '../rumh.motion';

/*
 * Opening: one point. Eight lines come in from the edges of the screen along the
 * identity's two angles and meet at a single point; the spearhead lands on it (two of
 * the lines are its own edges), then the wordmark is cut open beside it. Scrolling,
 * the mark becomes an aperture: it opens out until its red fills the screen.
 * The mark's box is where the page transition lands ([data-hero-target]): the cover,
 * the spearhead debossed in leather, settles exactly where the red mark appears.
 */
const { width: LW, height: LH, parts } = logoParts;
const box = ([x, y, w, h]) => ({
  left: `${(x / LW) * 100}%`,
  top: `${(y / LH) * 100}%`,
  width: `${(w / LW) * 100}%`,
  height: `${(h / LH) * 100}%`,
});

export default function Opening({ project }) {
  const { registerHero, whenSettled } = useTransition();
  const rootRef = useRef(null);
  const { copy } = project;

  useLayoutEffect(() => {
    registerHero(Promise.resolve());
    const root = rootRef.current;
    const svg = root.querySelector('.rm-open__rays');
    const lines = [...svg.querySelectorAll('line')];
    const stops = [...svg.querySelectorAll('linearGradient')];

    // the lines start beyond the screen and end on the spearhead's tip
    const layout = () => {
      const r = root.getBoundingClientRect();
      const m = root.querySelector('.rm-open__mark').getBoundingClientRect();
      const [px, py] = [m.left - r.left, m.top - r.top];
      const reach = Math.hypot(r.width, r.height) * 1.1;
      svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
      lines.forEach((line, i) => {
        const [dx, dy] = DIRECTIONS[i];
        const [fx, fy] = [px + dx * reach, py + dy * reach];
        line.setAttribute('x1', fx);
        line.setAttribute('y1', fy);
        line.setAttribute('x2', px);
        line.setAttribute('y2', py);
        stops[i].setAttribute('x1', fx);
        stops[i].setAttribute('y1', fy);
        stops[i].setAttribute('x2', px);
        stops[i].setAttribute('y2', py);
      });
      return [px, py];
    };
    layout();
    const ro = new ResizeObserver(() => layout());
    ro.observe(root);

    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      gsap.set(lines, { drawSVG: '0%' });
      gsap.set(q('.rm-open__mark svg'), { scale: 0, transformOrigin: '0% 0%' });
      gsap.set(q('.rm-open__word'), { clipPath: 'inset(0% 100% 0% 0%)' });
      gsap.set(q('.rm-open__meta > *, .rm-open__foot > *'), { opacity: 0, y: 14 });

      const tl = gsap.timeline({ paused: true });
      tl.to(lines, { drawSVG: '100%', duration: 1.15, ease: 'expo.inOut', stagger: 0.035 })
        .to(q('.rm-open__mark svg'), { scale: 1, duration: 0.75, ease: RM.throw }, 1.0)
        .to(q('.rm-open__word'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: RM.cut }, 1.2)
        .to(lines, { opacity: 0.7, duration: 0.8, ease: 'power2.out' }, 1.5)
        .to(
          q('.rm-open__meta > *, .rm-open__foot > *'),
          { opacity: 1, y: 0, duration: 0.8, ease: RM.throw, stagger: 0.06 },
          1.45,
        );

      // leaving, the aperture: the screen holds, the lines run on past the point and the
      // wordmark goes; the mark opens out from the square at its heart until its red is
      // the whole screen, the field the key concepts are set on
      const mark = q('.rm-open__mark')[0];
      const fill = () => {
        const r = root.getBoundingClientRect();
        const m = mark.getBoundingClientRect();
        // the square inside the mark (31–100% of its box) has to cover the screen
        const [cx, cy] = [m.left - r.left + m.width * 0.655, m.top - r.top + m.height * 0.655];
        const half = Math.min(m.width, m.height) * 0.345;
        return (Math.max(cx, r.width - cx, cy, r.height - cy) / half) * 1.02;
      };
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: RM.scrub,
            invalidateOnRefresh: true,
          },
        })
        .to(
          svg,
          {
            scale: 1.35,
            opacity: 0,
            duration: 0.4,
            transformOrigin: () =>
              layout()
                .map((v) => `${v}px`)
                .join(' '),
          },
          0,
        )
        .to(q('.rm-open__word, .rm-open__meta, .rm-open__foot'), { opacity: 0, duration: 0.2 }, 0)
        .to(mark, { scale: fill, transformOrigin: '65.5% 65.5%', duration: 0.8, ease: 'power3.in' }, 0.1)
        .set(root, { backgroundColor: 'var(--rm-red)' }, 0.9)
        .to({}, { duration: 0.1 });

      let alive = true;
      Promise.all([introDone, whenSettled()]).then(() => alive && tl.play());
      return () => {
        alive = false;
      };
    });
    return () => {
      ro.disconnect();
      mm.revert();
    };
  }, [registerHero, whenSettled]);

  return (
    <header className="rm-open" ref={rootRef}>
      <svg className="rm-open__rays" aria-hidden="true" focusable="false">
        <defs>
          {DIRECTIONS.map((_, i) => (
            <linearGradient key={i} id={`rm-ray-${i}`} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="var(--rm-red)" stopOpacity="1" />
              <stop offset="0.82" stopColor="var(--rm-red)" stopOpacity="0.55" />
              <stop offset="1" stopColor="var(--rm-red)" stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {DIRECTIONS.map((_, i) => (
          <line key={i} stroke={`url(#rm-ray-${i})`} />
        ))}
      </svg>

      <div className="rm-open__meta">
        <TransitionLink to="/" section="work" className="text-link rm-open__back">
          <Arrow direction="left" />
          All work
        </TransitionLink>
        <p className="rm-label">
          <span>{project.category}</span>
          {project.year && <span>{project.year}</span>}
        </p>
      </div>

      <h1 className="rm-open__lockup" style={{ aspectRatio: `${LW} / ${LH}` }}>
        <span className="visually-hidden">
          {project.name} — <span lang="ar">{project.nameAr}</span>
        </span>
        <span className="rm-open__mark" style={box(parts.mark)} data-hero-target aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
            <polygon points={pointsOf(MARK)} fill="var(--rm-red)" />
          </svg>
        </span>
        <span
          className="rm-open__word"
          style={{ ...box(parts.word), '--src': `url(/work/rumh/parts/word.png)` }}
          aria-hidden="true"
        />
      </h1>

      <div className="rm-open__foot">
        <p className="rm-open__line">{copy.tagline}</p>
        <p className="rm-open__ar" lang="ar" dir="rtl">
          {copy.nameFullAr}
        </p>
      </div>
    </header>
  );
}
