import { useLayoutEffect, useRef } from 'react';
import { ANGLE, gsap, MOTION_OK, RM } from '../rumh.motion';

/*
 * The two key concepts, on the red the opening's aperture left on the screen. As
 * the section holds, a navy spear rises from the foot of the screen to a point near
 * its top, its two edges on the mark's left-edge angle, and divides the red into the
 * two planes of the guidelines' concept page; each idea is set in its own plane.
 * Then the spear widens until its navy is the whole screen: the field of the next
 * section. (On narrow screens the ideas stack and the spear only closes the scene.)
 */
const SLANT = Math.tan(ANGLE * (Math.PI / 180)); // 0.31: the spear's edges move this far across per unit down
const lerp = (a, b, t) => a + (b - a) * t;

export default function Concept({ project }) {
  const rootRef = useRef(null);
  const { concept } = project.copy;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const svg = root.querySelector('.rm-concept__planes');
    const spear = svg.querySelector('polygon');
    // grow: the tip rises from the foot of the screen; fill: the corners open to the screen's
    const state = { grow: 1, fill: 0 };
    const draw = () => {
      const { width: W, height: H } = svg.getBoundingClientRect();
      // narrow screens: no spear behind the stacked ideas
      const grow = window.matchMedia('(min-width: 900px)').matches ? state.grow : 0;
      const [ax, ay] = [W / 2, lerp(H + 2, H * 0.18, grow)];
      const hw = (H - ay) * SLANT;
      const from = [
        [ax, ay],
        [ax, ay],
        [ax + hw, H + 1],
        [ax - hw, H + 1],
      ];
      const to = [
        [-1, -1],
        [W + 1, -1],
        [W + 1, H + 1],
        [-1, H + 1],
      ];
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      spear.setAttribute(
        'points',
        from.map((p, i) => `${lerp(p[0], to[i][0], state.fill)},${lerp(p[1], to[i][1], state.fill)}`).join(' '),
      );
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(svg);

    const mm = gsap.matchMedia(root);
    mm.add({ ok: MOTION_OK, wide: '(min-width: 900px)' }, ({ conditions }) => {
      if (!conditions.ok) return undefined;
      const q = gsap.utils.selector(root);
      state.grow = 0;
      draw();
      // the heading is on the red as it arrives (thrown in once); the spear and the ideas follow the scroll
      gsap.from(q('.rm-concept__head > *'), {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: RM.throw,
        stagger: 0.06,
        scrollTrigger: { trigger: root, start: 'top 40%', once: true },
      });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root, start: 'top top', end: '+=170%', pin: true, scrub: RM.scrub },
      });
      if (conditions.wide) tl.to(state, { grow: 1, duration: 0.35, ease: RM.throw, onUpdate: draw }, 0.05);
      tl.from(q('.rm-concept__idea'), { opacity: 0, y: 24, duration: 0.18, stagger: 0.1, ease: 'power3.out' }, 0.25)
        .to(q('.rm-concept__head, .rm-concept__ideas'), { opacity: 0, duration: 0.08 }, 0.74)
        .to(state, { fill: 1, duration: 0.2, ease: 'power3.in', onUpdate: draw }, 0.78)
        .to({}, { duration: 0.04 });
      return () => {
        state.grow = 1;
        state.fill = 0;
        draw();
      };
    });
    return () => {
      ro.disconnect();
      mm.revert();
    };
  }, []);

  return (
    <section className="rm-concept" ref={rootRef} aria-labelledby="rm-concept-title">
      <svg className="rm-concept__planes" aria-hidden="true" focusable="false">
        <polygon fill="var(--rm-navy)" />
      </svg>

      <header className="rm-concept__head">
        <p className="rm-label">
          <span>{concept.label}</span>
          <span lang="ar" dir="rtl">
            {concept.labelAr}
          </span>
        </p>
        <h2 className="rm-concept__title" id="rm-concept-title">
          {concept.title}
        </h2>
      </header>

      <div className="rm-concept__ideas">
        {concept.ideas.map((idea) => (
          <article key={idea.ar} className="rm-concept__idea">
            <h3 lang="ar" dir="rtl">
              {idea.ar}
            </h3>
            <p className="rm-concept__en">{idea.en}</p>
            <p className="rm-concept__text">{idea.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
