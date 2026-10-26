import { useLayoutEffect, useRef } from 'react';
import { sectionTitles, services } from '../../data/siteConfig';
import { gsap, MOTION_OK, ScrollTrigger } from '../../motion/gsap';
import { fadeUp, riseLines, TYPE } from '../../motion/typeMotion';

/*
 * Services as a typographic index on Deep Navy — no icons, no cards.
 * Each discipline is set at display size with its Arabic counterpart aligned
 * to the opposite edge; the NASAQ slash pattern closes the list.
 *
 * Motion (the shared language in motion/typeMotion.js):
 *   head   the title and its Arabic fade up, the top hairline draws across
 *   rows   as they come into view, in order: each row's hairline draws, its name
 *          rises out of its mask, then its Arabic (a whole line, never split, so
 *          its shaping is untouched) and its number. Rows arriving together
 *          follow one another at a fixed interval.
 * Pointing at a row sets it in Primary Blue (CSS). Reduced motion: shown as it is.
 */
const pad = (n) => String(n).padStart(2, '0');
const ROW_GAP = 0.12; // between rows that arrive together

export default function Services() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, (ctx) => {
      const q = gsap.utils.selector(root);
      const list = q('.services__list')[0];
      const head = q('.services__head > *');
      const rows = q('.service');
      const parts = (row) => ({
        en: row.querySelector('.service__en > span'),
        ar: row.querySelector('.service__ar > span'),
        num: row.querySelector('.service__num'),
      });

      // held until they arrive (masks and space stay as they are)
      gsap.set(head, { autoAlpha: 0 });
      gsap.set([list, ...rows], { '--rule': 0 });
      rows.forEach((row) => {
        const { en, ar, num } = parts(row);
        gsap.set([en, ar], { yPercent: TYPE.from });
        gsap.set(num, { autoAlpha: 0 });
      });

      const headTl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 80%', once: true },
      });
      fadeUp(headTl, head, 0);
      headTl.to(list, { '--rule': 1, duration: TYPE.rule, ease: 'power3.inOut' }, 0.1);

      ScrollTrigger.batch(rows, {
        start: 'top 90%',
        once: true,
        // run in the context, so leaving (or reduced motion) reverts these too
        onEnter: (batch) =>
          ctx.add(() => {
            const tl = gsap.timeline({ defaults: { ease: TYPE.ease } });
            batch.forEach((row, i) => {
              const { en, ar, num } = parts(row);
              const at = i * ROW_GAP;
              tl.to(row, { '--rule': 1, duration: TYPE.rule, ease: 'power3.inOut' }, at);
              riseLines(tl, en, at + 0.05);
              riseLines(tl, ar, at + 0.2, { duration: TYPE.rise * 0.85 });
              fadeUp(tl, num, at + 0.25);
            });
            // hand the names back to the stylesheet (their hover moves them with `translate`)
            tl.set(
              batch.flatMap((row) => [parts(row).en, parts(row).ar]),
              { clearProps: 'transform' },
            );
          }),
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="services" id="services" ref={rootRef} aria-labelledby="services-title">
      <header className="services__head">
        <h2 className="services__title label" id="services-title" tabIndex={-1}>
          {sectionTitles.services.en}
        </h2>
        <p className="services__title-ar label" lang="ar" dir="rtl">
          {sectionTitles.services.ar}
        </p>
      </header>

      <ol className="services__list">
        {services.map((s, i) => (
          <li className="service" key={s.en}>
            <span className="service__num" aria-hidden="true">
              {pad(i + 1)}
            </span>
            <span className="line service__en">
              <span>{s.en}</span>
            </span>
            <span className="line service__ar" lang="ar" dir="rtl">
              <span>{s.ar}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="services__pattern" aria-hidden="true" />
    </section>
  );
}
