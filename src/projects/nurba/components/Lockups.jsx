import { useLayoutEffect, useRef } from 'react';
import { asset } from '../../../utils/media';
import { applyMask, gsap, lightMask, MOTION_OK, NB } from '../nurba.motion';

/*
 * The arrangements of the logo on board 16, in cream on navy: the horizontal one
 * across the screen (NURBA, the monogram, نوربا), then the monogram beside the two
 * names. Each is revealed by the same band of light that reveals the monogram.
 */
const horizontal = asset('work/nurba/logo-horizontal', 'NURBA, the monogram and نوربا in one line');
const stacked = asset('work/nurba/logo-stacked', 'The monogram beside NURBA set over نوربا');

export default function Lockups({ project }) {
  const rootRef = useRef(null);
  const { lockups: copy } = project.copy;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      root.querySelectorAll('.nb-lockups__logo').forEach((el) => {
        applyMask(el, lightMask('var(--src)'));
        gsap.fromTo(
          el,
          { '--nb-light': '0%' },
          {
            '--nb-light': '112%',
            duration: 1.6,
            ease: NB.light,
            scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  const logo = (media, cls) => (
    <span
      className={`nb-lockups__logo ${cls}`}
      role="img"
      aria-label={media.alt}
      style={{ '--src': `url(${media.src})`, aspectRatio: `${media.width} / ${media.height}` }}
    />
  );

  return (
    <section className="nb-lockups" ref={rootRef} aria-labelledby="nb-lockups-title">
      <header className="nb-lockups__head">
        <p className="nb-label">
          <span>{copy.label}</span>
          <span lang="ar" dir="rtl">
            {copy.labelAr}
          </span>
        </p>
        <h2 className="nb-lockups__text" id="nb-lockups-title">
          {copy.text}
        </h2>
      </header>
      {logo(horizontal, 'nb-lockups__logo--wide')}
      {logo(stacked, 'nb-lockups__logo--stacked')}
    </section>
  );
}
