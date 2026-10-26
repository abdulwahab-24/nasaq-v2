import { useLayoutEffect, useRef } from 'react';
import { MOTION_OK } from '../../../motion/gsap';
import { boxOf, DT, gsap } from '../datoura.motion';
import Art from './Art';

/*
 * The wordmark in outline (artboard 5), set wider than the screen. Arriving, its
 * letters are drawn as single strokes; crossing the screen, the line travels
 * sideways with the scroll so the whole word passes, the two Λ included.
 */
export default function Wordmark({ project }) {
  const rootRef = useRef(null);
  const artRef = useRef(null);
  const { wordmark } = project.copy;

  useLayoutEffect(() => {
    const svg = artRef.current;
    const letters = svg.querySelectorAll('[data-role="letter"]');
    // the letters' own extent, with the guides running through it
    const [x, y, w, h] = boxOf(letters, 6);
    svg.setAttribute('viewBox', [x, y, w, h].join(' '));
    svg.style.setProperty('--ratio', w / h);

    const mm = gsap.matchMedia(rootRef);
    mm.add(MOTION_OK, () => {
      const root = rootRef.current;
      gsap.fromTo(
        letters,
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          ease: DT.draw,
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: 'top 75%', end: 'top 15%', scrub: 0.6 },
        },
      );
      gsap.fromTo(
        svg,
        { x: () => root.clientWidth * 0.15 },
        {
          x: () => Math.min(0, root.clientWidth - svg.getBoundingClientRect().width) - root.clientWidth * 0.05,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="dt-word" ref={rootRef} aria-labelledby="dt-word-title">
      <div className="dt-word__line">
        <Art name="outline" ref={artRef} className="dt-word__art" />
      </div>
      <div className="dt-word__copy">
        <h2 className="dt-label" id="dt-word-title">
          {wordmark.label}
        </h2>
        <p className="dt-lede">{wordmark.text}</p>
      </div>
    </section>
  );
}
