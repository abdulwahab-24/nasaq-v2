import { useLayoutEffect, useRef } from 'react';
import { statement } from '../../data/siteConfig';
import { gsap, MOTION_OK } from '../../motion/gsap';

/*
 * Studio statement — scattered → aligned. The words start out of order and
 * off their baseline and settle into a strict, left-aligned column as the
 * statement reaches the reader: the brand idea, said in type.
 */

// Deterministic scatter so every visit (and SSR, if added later) matches.
const scatter = (i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12543.123;
  const r1 = a - Math.floor(a);
  const r2 = b - Math.floor(b);
  return { x: (r1 - 0.5) * 2.4, y: (r2 - 0.5) * 1.8, r: (r1 - 0.5) * 14 };
};

function Words({ text, offset, accent }) {
  return text.split(' ').map((word, i) => {
    const key = `${offset + i}-${word}`;
    const clean = word.replace(/[.,]/g, '');
    return (
      <span className="word" key={key} data-i={offset + i}>
        {clean === accent ? <em>{word}</em> : word}{' '}
      </span>
    );
  });
}

// Running word index per sentence, so each word keeps its own scatter.
const OFFSETS = statement.map((_, i) =>
  statement.slice(0, i).reduce((n, s) => n + s.split(' ').length, 0),
);

export default function Statement() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const words = root.querySelectorAll('.word');
      gsap
        .timeline({
          scrollTrigger: { trigger: root.querySelector('.statement__text'), start: 'top 85%', end: 'center 50%', scrub: 0.8 },
        })
        .fromTo(
          words,
          {
            xPercent: (i, el) => scatter(+el.dataset.i).x * 100,
            yPercent: (i, el) => scatter(+el.dataset.i).y * 100,
            rotate: (i, el) => scatter(+el.dataset.i).r,
            opacity: 0.25,
          },
          { xPercent: 0, yPercent: 0, rotate: 0, opacity: 1, ease: 'power2.out', stagger: 0.012 },
        )
        .fromTo(
          root.querySelector('.statement__rule'),
          { scaleX: 0 },
          { scaleX: 1, ease: 'power2.inOut' },
          0.2,
        );
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="statement" ref={rootRef} aria-labelledby="statement-title">
      <div className="statement__inner">
        <p className="statement__label label">
          <span id="statement-title">Studio statement</span>
          <span lang="ar" dir="rtl">
            نسق
          </span>
        </p>
        <span className="statement__rule" aria-hidden="true" />
        <div className="statement__text">
          {statement.map((sentence, i) => (
            <p key={sentence} className={`statement__p statement__p--${i + 1}`}>
              <Words text={sentence} offset={OFFSETS[i]} accent="NASAQ" />
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
