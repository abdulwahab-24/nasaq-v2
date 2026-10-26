import { useLayoutEffect, useRef, useState } from 'react';
import { finishIntro, gsap, INTRO } from '../../motion/gsap';
import { lockScroll } from '../../motion/lenis';
import NasaqMark from '../ui/NasaqMark';

/*
 * Opening: disorder → alignment → NASAQ, as the first beat of the hero itself.
 *
 * On the same black as the page, the four pieces of the NASAQ symbol arrive
 * scattered and lock into alignment. The assembled symbol then travels to its
 * place in the hero ([data-intro-target]) while the black lifts and both headlines
 * grow out of the hero's axis — the symbol does not fade out, it takes its seat.
 * Without a hero in view (a project page opened directly) the symbol settles and
 * the black lifts around it.
 *
 * Whether it plays is decided before the first paint (INTRO, from index.html), and
 * the classes that hold the navigation and the hero's symbol back are already on
 * <html> by then (intro.css). There is only ever one visible symbol: the hero's
 * stays hidden until this one has landed on it, and the two are swapped in the
 * same frame.
 *
 * ~2s, once per session, a click or key hurries it. Reduced motion: no intro.
 */
const SCATTER = [
  [-30, -22, -96],
  [26, -28, 70],
  [-22, 28, 58],
  [32, 18, -84],
];

// The hero's symbol, if it is on screen to receive the intro's.
function heroTarget() {
  const el = document.querySelector('[data-intro-target]');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.width && r.bottom > 0 && r.top < window.innerHeight ? el : null;
}

// What the first frames depend on: the symbol's pixels and the hero's final layout.
function ready(root) {
  const img = root.querySelector('img');
  return Promise.all([img?.decode?.().catch(() => {}), document.fonts?.ready]);
}

export default function Intro() {
  const [done, setDone] = useState(!INTRO);
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!INTRO) {
      finishIntro();
      return undefined;
    }
    const root = rootRef.current;
    const q = gsap.utils.selector(root);
    const html = document.documentElement;
    const target = heroTarget();
    // Already set by index.html; set again so a remount (StrictMode, HMR) starts from the same state.
    html.classList.add('is-intro', 'is-intro-mark');
    lockScroll(true);
    let alive = true;
    let locked = true;
    const unlock = () => {
      if (locked) lockScroll(false);
      locked = false;
    };
    const release = () => {
      html.classList.remove('is-intro');
      unlock();
    };
    // The one moment two symbols exist: the hero's is shown and this one hidden in the same frame.
    const land = () => {
      html.classList.remove('is-intro-mark');
      root.style.visibility = 'hidden';
    };

    const mark = q('.intro__mark')[0];
    // where the symbol has to travel to land exactly on the hero's
    const flight = () => {
      const m = mark.getBoundingClientRect();
      const t = target.getBoundingClientRect();
      return {
        x: t.left + t.width / 2 - (m.left + m.width / 2),
        y: t.top + t.height / 2 - (m.top + m.height / 2),
        scale: t.width / m.width,
      };
    };

    let tl;
    const ctx = gsap.context(() => {
      tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          land();
          setDone(true);
        },
      });

      // disorder → alignment (the scattered state is set now, before the first paint)
      tl.from(q('.mark__piece'), {
        x: (i) => `${SCATTER[i][0]}vmin`,
        y: (i) => `${SCATTER[i][1]}vmin`,
        rotate: (i) => SCATTER[i][2],
        autoAlpha: 0,
        duration: 0.95,
        ease: 'expo.inOut',
        stagger: 0.035,
      })
        // alignment → NASAQ: the hero is uncovered as the symbol takes its place
        .addLabel('handoff', '+=0.06')
        .add(() => {
          release();
          finishIntro({ handoff: Boolean(target) });
        }, 'handoff')
        .to(q('.intro__veil'), { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 'handoff');

      if (target) {
        tl.to(
          mark,
          {
            x: () => flight().x,
            y: () => flight().y,
            scale: () => flight().scale,
            duration: 0.85,
            ease: 'expo.inOut',
          },
          'handoff',
        );
      } else {
        tl.to(mark, { scale: 0.7, opacity: 0, duration: 0.6, ease: 'power2.in' }, 'handoff+=0.1');
      }
    }, root);

    // The flight is measured when it starts, so the hero must already have its final layout.
    ready(root).then(() => alive && tl.play());

    const hurry = () => tl.timeScale(4);
    window.addEventListener('pointerdown', hurry, { once: true });
    window.addEventListener('keydown', hurry, { once: true });

    return () => {
      alive = false;
      ctx.revert();
      release();
      land();
      root.style.visibility = '';
      window.removeEventListener('pointerdown', hurry);
      window.removeEventListener('keydown', hurry);
    };
  }, []);

  if (done) return null;

  return (
    <div className="intro" ref={rootRef} aria-hidden="true">
      <div className="intro__veil" />
      <NasaqMark className="intro__mark" />
    </div>
  );
}
