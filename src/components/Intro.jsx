import { useLayoutEffect, useRef, useState } from 'react';
import { finishIntro, gsap, prefersReducedMotion } from '../motion/gsap';
import { lockScroll } from '../motion/lenis';

/*
 * Opening: the four pieces of the NASAQ symbol arrive scattered and lock into
 * alignment; then the screen opens from the symbol's centre, each piece riding
 * its quarter of the screen outwards — the same "symbol becomes the frame"
 * idea the homepage uses for its work. ~2s, once per session, click/key skips.
 */
const KEY = 'nasaq-intro';
const SYMBOL = '/brand/nasaq-symbol-white.png';
const QUADS = [
  ['tl', -1, -1],
  ['tr', 1, -1],
  ['bl', -1, 1],
  ['br', 1, 1],
];

let decision; // decided once per page load

function shouldPlay() {
  if (decision !== undefined) return decision;
  try {
    decision = !prefersReducedMotion() && !sessionStorage.getItem(KEY);
    sessionStorage.setItem(KEY, '1');
  } catch {
    decision = false;
  }
  return decision;
}

export default function Intro() {
  const [play] = useState(shouldPlay);
  const [done, setDone] = useState(!play);
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!play) {
      finishIntro();
      return undefined;
    }
    const root = rootRef.current;
    const q = gsap.utils.selector(root);
    document.documentElement.classList.add('is-intro');
    lockScroll(true);
    let locked = true;
    const unlock = () => {
      if (locked) lockScroll(false);
      locked = false;
    };

    const scatter = [
      [-34, -22, -110],
      [28, -30, 75],
      [-24, 30, 60],
      [36, 18, -90],
    ];

    let tl;
    const ctx = gsap.context(() => {
      tl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
          document.documentElement.classList.remove('is-intro');
          unlock();
          setDone(true);
        },
      });

      tl.from(q('.intro__piece'), {
        x: (i) => `${scatter[i][0]}vmin`,
        y: (i) => `${scatter[i][1]}vmin`,
        rotate: (i) => scatter[i][2],
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.inOut',
        stagger: 0.04,
      })
        .add(finishIntro, '+=0.12')
        .to(
          q('.intro__panel'),
          {
            xPercent: (i) => QUADS[i][1] * 100,
            yPercent: (i) => QUADS[i][2] * 100,
            duration: 1,
            ease: 'expo.inOut',
          },
          '<',
        );
    }, root);

    const skip = () => tl.timeScale(5);
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });

    return () => {
      ctx.revert();
      document.documentElement.classList.remove('is-intro');
      unlock();
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
    };
  }, [play]);

  if (done) return null;

  return (
    <div className="intro" ref={rootRef} aria-hidden="true">
      {QUADS.map(([q]) => (
        <div key={q} className={`intro__panel intro__panel--${q}`}>
          <div className="intro__piece">
            <img className={`quad quad--${q}`} src={SYMBOL} alt="" width="470" height="470" />
          </div>
        </div>
      ))}
    </div>
  );
}
