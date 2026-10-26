import { useLayoutEffect, useRef } from 'react';
import { statement } from '../../data/siteConfig';
import { gsap, MOTION_OK, ScrollTrigger } from '../../motion/gsap';
import { fadeUp, riseLines, splitLines, TYPE } from '../../motion/typeMotion';

/*
 * Studio statement on Deep Navy: the three sentences at display size, each one
 * stepping further in from the left, NASAQ set in Primary Blue.
 *
 * Motion (one timeline, played once as the section arrives; the shared language
 * in motion/typeMotion.js):
 *   label   fades up            rule   draws from the left
 *   each sentence rises out of its mask line by line, one after another down
 *   the staircase; the second and third also settle onto their indent from a
 *   little to its left. NASAQ turns blue once its sentence has landed.
 * The lines are split when the timeline starts and joined again when it ends,
 * so the text reflows normally on resize. Reduced motion: shown as it is.
 */
function Sentence({ text, accent }) {
  const at = text.indexOf(accent);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <em>{accent}</em>
      {text.slice(at + accent.length)}
    </>
  );
}

export default function Statement() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, (ctx) => {
      const q = gsap.utils.selector(root);
      const label = q('.statement__label > span');
      const rule = q('.statement__rule');
      const paras = q('.statement__p');
      const accent = q('.statement__p--3 em');
      let splits = [];
      let alive = true;

      // held until the section arrives; the paragraphs keep their space
      gsap.set(label, { autoAlpha: 0 });
      gsap.set(rule, { scaleX: 0 });
      gsap.set(paras, { autoAlpha: 0 });

      // run in the context when it is time, so leaving (or reduced motion) reverts it too
      const play = () =>
        ctx.add(() => {
          const ink = getComputedStyle(paras[paras.length - 1]).color;
          const blue = accent[0] && getComputedStyle(accent[0]).color;
          splits = paras.map(splitLines);
          gsap.set(paras, { autoAlpha: 1 });

          const tl = gsap.timeline({
            onComplete: () => {
              splits.forEach((s) => s.revert());
              splits = [];
              gsap.set(accent, { clearProps: 'color' });
            },
          });
          // the staircase indent exists from 1024px (statement.css); only there do lines settle onto it
          const indented = window.matchMedia('(min-width: 1024px)').matches;
          fadeUp(tl, label, 0);
          tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: TYPE.rule, ease: 'power3.inOut' }, 0.05);
          splits.forEach((s, i) => {
            const at = 0.3 + i * TYPE.block * 1.6;
            riseLines(tl, s.lines, at);
            if (i && indented)
              tl.fromTo(
                s.lines,
                { x: -28 },
                { x: 0, duration: TYPE.rise * 1.2, ease: TYPE.ease, stagger: TYPE.line },
                at,
              );
          });
          if (blue) tl.fromTo(accent, { color: ink }, { color: blue, duration: 0.6, ease: 'power2.out' }, '-=0.35');
        });

      ScrollTrigger.create({
        trigger: root.querySelector('.statement__inner'),
        start: 'top 78%',
        once: true,
        // split with the final fonts, or the lines would break in the wrong places
        onEnter: () => document.fonts.ready.then(() => alive && play()),
      });

      return () => {
        alive = false;
        splits.forEach((s) => s.revert());
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="statement" ref={rootRef} aria-labelledby="statement-title">
      <div className="statement__inner">
        <h2 className="statement__label label">
          <span id="statement-title">Studio statement</span>
          <span lang="ar" dir="rtl">
            نسق
          </span>
        </h2>
        <span className="statement__rule" aria-hidden="true" />
        <div className="statement__text">
          {statement.map((sentence, i) => (
            <p key={sentence} className={`statement__p statement__p--${i + 1}`}>
              <Sentence text={sentence} accent="NASAQ" />
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
