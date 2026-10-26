import { useLayoutEffect, useRef } from 'react';
import { gsap, LZ, MOTION_OK, settle } from '../louiza.motion';
import Head from './Head';

/*
 * The typography page, rebuilt: its four words in the identity's own lettering
 * (lifted from the page as masks), at one shared scale and in the page's own
 * arrangement, two by two and read from the right. Each is written in from the
 * right, one after another, when the set comes up the screen.
 */
const LONGEST = 2256; // the longest word's width in the masks' pixels: it fills its column

export default function Words({ project }) {
  const rootRef = useRef(null);
  const { words: copy } = project.copy;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      settle(root.querySelectorAll('.lz-head > *'), root);
      const list = root.querySelector('.lz-words__list');
      gsap
        .timeline({
          scrollTrigger: { trigger: list, start: 'top 78%', once: true },
        })
        .fromTo(
          root.querySelectorAll('.lz-words__ar'),
          { clipPath: 'inset(-10% -2% -10% 102%)' },
          {
            clipPath: 'inset(-10% -2% -10% -2%)',
            duration: 1.4,
            ease: LZ.melt,
            stagger: 0.25,
          },
        )
        .from(
          root.querySelectorAll('.lz-words__en'),
          { opacity: 0, y: 10, duration: 0.9, ease: LZ.grow, stagger: 0.25 },
          0.6,
        );
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="lz-words" ref={rootRef} aria-labelledby="lz-words-title">
      <Head copy={copy} id="lz-words-title" />
      <ul className="lz-words__list lz-grid" dir="rtl">
        {project.media.words.map((w) => (
          <li key={w.key} className="lz-words__item">
            <span
              className="lz-words__ar"
              role="img"
              aria-label={w.ar}
              lang="ar"
              style={{
                '--src': `url(${w.src})`,
                width: `${(w.width / LONGEST) * 100}%`,
                aspectRatio: `${w.width} / ${w.height}`,
              }}
            />
            <span className="lz-words__en" dir="ltr">
              {w.en}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
