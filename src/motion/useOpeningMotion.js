import { useLayoutEffect } from 'react';
import { COMPACT, gsap, introDone, MOTION_OK, ScrollTrigger, STAGED } from './gsap';

/*
 * One idea, executed in three modes: separate ↔ aligned.
 *
 *   intro    — both languages emerge from the shared axis while the symbol's
 *              four pieces settle into alignment on it.
 *   staged   — (desktop) the opening pins; the pieces separate and the space
 *              between them opens into the reel of work. The clip rectangle's
 *              corners are interpolated with exactly the same values as the
 *              pieces, so the pieces always sit on the corners of the opening.
 *   compact  — (mobile / short screens) no pinning: the frame's own corner marks
 *              part from its centre as it scrolls into view.
 *
 * Reduced motion: nothing runs; the CSS layout is already the final state.
 */

const DIR = {
  tl: [-1, -1],
  tr: [1, -1],
  bl: [-1, 1],
  br: [1, 1],
};

const dirOf = (el) => DIR[el.dataset.quadrant] ?? DIR[el.closest('[data-quadrant]')?.dataset.quadrant];

function intro(q) {
  const tl = gsap.timeline({ paused: true });

  tl.from(q('.hero__en .line > span'), {
    xPercent: -102,
    duration: 1.25,
    ease: 'expo.out',
    stagger: 0.07,
  })
    .from(
      q('.hero__ar .line > span'),
      { xPercent: 102, duration: 1.25, ease: 'expo.out', stagger: 0.07 },
      0.05,
    )
    .from(
      q('.hero__mark .quad'),
      {
        xPercent: (i, el) => dirOf(el)[0] * 22,
        yPercent: (i, el) => dirOf(el)[1] * 22,
        rotate: (i, el) => dirOf(el)[0] * dirOf(el)[1] * 30,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.05,
      },
      0,
    )
    .from(q('.hero__rule'), { scaleY: 0, duration: 1.4, ease: 'expo.inOut' }, 0)
    .from(
      q('.hero__intro, .hero__actions > *'),
      { opacity: 0, y: 16, duration: 1, ease: 'power2.out', stagger: 0.08 },
      0.45,
    );

  let alive = true;
  introDone.then(() => alive && tl.play());
  return () => {
    alive = false;
  };
}

function staged(root, q) {
  const mark = q('.hero__mark .mark')[0];
  const pieces = q('.hero__mark .mark__piece');
  const frame = q('.frame')[0];
  const media = q('.frame__media')[0];
  const cornerProbe = q('.frame__marks .corners__piece')[0];

  const geometry = () => {
    const m = mark.getBoundingClientRect();
    const f = frame.getBoundingClientRect();
    return {
      cx: m.left + m.width / 2,
      cy: m.top + m.height / 2,
      f,
      scale: cornerProbe.offsetWidth / m.width,
    };
  };

  const cornerOf = (el, f) => {
    const [dx, dy] = dirOf(el);
    return [dx < 0 ? f.left : f.right, dy < 0 ? f.top : f.bottom];
  };

  const closedClip = () => {
    const { cx, cy, f } = geometry();
    return `inset(${cy - f.top}px ${f.right - cx}px ${f.bottom - cy}px ${cx - f.left}px)`;
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      id: 'opening',
      trigger: root,
      start: 'top top',
      end: '+=110%',
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  const OPEN = { duration: 1, ease: 'power2.inOut' };

  tl.fromTo(q('.hero__en .line'), { x: 0, opacity: 1 }, { x: -60, opacity: 0, immediateRender: false, duration: 0.35, ease: 'power2.in', stagger: 0.03 }, 0)
    .fromTo(q('.hero__ar .line'), { x: 0, opacity: 1 }, { x: 60, opacity: 0, immediateRender: false, duration: 0.35, ease: 'power2.in', stagger: 0.03 }, 0)
    .fromTo(q('.hero__foot'), { y: 0, opacity: 1 }, { y: -24, opacity: 0, immediateRender: false, duration: 0.25 }, 0)
    .fromTo(q('.hero__axis'), { '--rule': 1 }, { '--rule': 0, immediateRender: false, duration: 0.3 }, 0)
    .fromTo(media, { clipPath: closedClip }, { clipPath: 'inset(0px 0px 0px 0px)', ...OPEN }, 0.12)
    .to(
      pieces,
      {
        x: (i, el) => {
          const { cx, f } = geometry();
          return cornerOf(el, f)[0] - cx;
        },
        y: (i, el) => {
          const { cy, f } = geometry();
          return cornerOf(el, f)[1] - cy;
        },
        scale: () => geometry().scale,
        ...OPEN,
      },
      0.12,
    )
    .fromTo(q('.frame__video'), { scale: 1.35 }, { scale: 1, duration: 1.1, ease: 'power2.out' }, 0.12)
    .from(
      q('.frame__caption .line > span'),
      { yPercent: 115, duration: 0.22, ease: 'power2.out', stagger: 0.05 },
      0.95,
    );
}

function compact(q) {
  const frame = q('.frame')[0];
  const media = q('.frame__media')[0];
  const corners = q('.frame__marks .corners__piece');
  const OPENING = 0.36;

  const tl = gsap.timeline({
    defaults: { duration: 1, ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: frame,
      start: 'top 92%',
      end: 'center 52%',
      scrub: 0.5,
      invalidateOnRefresh: true,
    },
  });

  const pct = `${OPENING * 100}%`;
  tl.fromTo(media, { clipPath: `inset(${pct} ${pct} ${pct} ${pct})` }, { clipPath: 'inset(0% 0% 0% 0%)' }, 0)
    .from(
      corners,
      {
        x: (i, el) => -dirOf(el)[0] * frame.offsetWidth * OPENING,
        y: (i, el) => -dirOf(el)[1] * frame.offsetHeight * OPENING,
      },
      0,
    )
    .fromTo(q('.frame__video'), { scale: 1.25 }, { scale: 1 }, 0);

  gsap.to(q('.hero__mark .mark__piece'), {
    xPercent: (i, el) => dirOf(el)[0] * 14,
    yPercent: (i, el) => dirOf(el)[1] * 14,
    ease: 'none',
    scrollTrigger: { trigger: q('.hero__mark')[0], start: 'top 40%', end: 'bottom top', scrub: true },
  });
}

export default function useOpeningMotion(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia(root);

    mm.add(MOTION_OK, () => intro(q));
    mm.add(STAGED, () => staged(root, q));
    mm.add(COMPACT, () => compact(q));

    let alive = true;
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

    return () => {
      alive = false;
      mm.revert();
    };
  }, [rootRef]);
}
