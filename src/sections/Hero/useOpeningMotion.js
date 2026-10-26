import { useLayoutEffect } from 'react';
import { COMPACT, FINE_POINTER, gsap, introDone, MOTION_OK, ScrollTrigger, STAGED } from '../../motion/gsap';

/*
 * One idea, executed in three modes: separate ↔ aligned.
 *
 *   intro    — scattered → aligned: every word rises out of its own mask from a
 *              slightly different place and settles onto the column, the grid
 *              behind draws down, and the axis grows out of the symbol. The
 *              symbol itself arrives with the opening intro
 *              (Intro.jsx lands it here); without an intro it is already in
 *              place, whole, from the first frame.
 *   pointer  — (fine pointers, once the entrance has finished) the pieces part a
 *              little as the pointer nears them.
 *   staged   — (desktop) the opening pins; the pieces separate and the space
 *              between them opens into the reel of work. The clip rectangle's
 *              corners are interpolated with exactly the same values as the
 *              pieces, so the pieces always sit on the corners of the opening.
 *   compact  — (mobile / short screens) no pinning: the frame's own corner marks
 *              part from its centre as it scrolls into view.
 *
 * Reduced motion: nothing runs; the CSS layout is already the final state.
 *
 * Every tween is created synchronously inside the matchMedia context, so its
 * first state is set before the first paint and a revert (unmount, StrictMode's
 * second run, a media change) returns the elements to their CSS exactly. Nothing
 * is created later in a promise: a tween made outside the context survives the
 * revert as stale inline styles, and the next from() would animate *to* them.
 */

const DIR = {
  tl: [-1, -1],
  tr: [1, -1],
  bl: [-1, 1],
  br: [1, 1],
};

const dirOf = (el) => DIR[el.dataset.quadrant] ?? DIR[el.closest('[data-quadrant]')?.dataset.quadrant];

// Deterministic scatter, so every visit starts from the same composition.
const scatter = (i) => {
  const r = Math.sin(i * 12.9898) * 43758.5453;
  return r - Math.floor(r) - 0.5;
};

function intro(q, onSettled) {
  const tl = gsap.timeline({ paused: true, onComplete: onSettled });

  tl.from(q('.hero__grid span'), { scaleY: 0, duration: 1.6, ease: 'expo.inOut', stagger: 0.035 }, 0)
    .from(
      q('.hero__en .word > span'),
      { yPercent: 115, x: (i) => scatter(i) * 90, duration: 1.35, ease: 'expo.out', stagger: 0.06 },
      0.1,
    )
    .from(
      q('.hero__ar .word > span'),
      { yPercent: 115, x: (i) => scatter(i + 11) * 70, duration: 1.35, ease: 'expo.out', stagger: 0.07 },
      0.35,
    )
    .from(q('.hero__rule'), { scaleX: 0, duration: 1.5, ease: 'expo.inOut' }, 0.05)
    .from(
      q('.hero__intro, .hero__actions > *'),
      { opacity: 0, y: 16, duration: 1, ease: 'power2.out', stagger: 0.08 },
      0.6,
    );

  // The symbol is not animated here. With the intro, the intro's symbol lands on this one (which
  // intro.css keeps hidden until then); without it, this one is simply there from the first frame,
  // whole and in place — the fixed point both headlines and the rule grow out of. Fading or
  // scattering it here is what read as a grey, broken symbol on every refresh.

  // fonts: the headlines must not change face while they move
  let alive = true;
  Promise.all([introDone, document.fonts?.ready]).then(() => alive && tl.play());
  return () => {
    alive = false;
  };
}

// separate ↔ aligned, at the scale of a pointer: the pieces open by a few percent
function pointer(q) {
  const mark = q('.hero__mark')[0];
  const quads = q('.hero__mark .quad');
  const to = quads.map((el) => [
    gsap.quickTo(el, 'xPercent', { duration: 0.8, ease: 'power3' }),
    gsap.quickTo(el, 'yPercent', { duration: 0.8, ease: 'power3' }),
  ]);
  const onMove = (e) => {
    const r = mark.getBoundingClientRect();
    const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    const open = Math.max(0, 1 - d / (r.width * 3.2)) * 7;
    quads.forEach((el, i) => {
      to[i][0](dirOf(el)[0] * open);
      to[i][1](dirOf(el)[1] * open);
    });
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  return () => window.removeEventListener('pointermove', onMove);
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

  // the words scatter again as the symbol opens: aligned → separate
  // (English drifts up, Arabic down; sideways only within the gutter, so nothing leaves the page)
  tl.fromTo(q('.hero__en .word'), { x: 0, y: 0, opacity: 1 }, { x: (i) => scatter(i) * 50, y: (i) => -50 + scatter(i + 5) * 40, opacity: 0, immediateRender: false, duration: 0.35, ease: 'power2.in', stagger: 0.02 }, 0)
    .fromTo(q('.hero__ar .word'), { x: 0, y: 0, opacity: 1 }, { x: (i) => scatter(i + 11) * 50, y: (i) => 50 + scatter(i + 3) * 40, opacity: 0, immediateRender: false, duration: 0.35, ease: 'power2.in', stagger: 0.02 }, 0)
    .fromTo(q('.hero__grid'), { opacity: 1 }, { opacity: 0, immediateRender: false, duration: 0.3 }, 0)
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

    mm.add({ motion: MOTION_OK, fine: `${MOTION_OK} and ${FINE_POINTER}` }, (context) => {
      if (!context.conditions.motion) return undefined;
      let detach;
      // the pointer only takes over the pieces once the entrance has put them in place;
      // context.add keeps its tweens inside this context, so a revert clears them too
      const stop = intro(q, () => {
        if (context.conditions.fine) context.add(() => (detach = pointer(q)));
      });
      return () => {
        stop();
        detach?.();
      };
    });
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
