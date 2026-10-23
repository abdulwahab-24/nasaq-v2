import { useLayoutEffect, useRef } from 'react';
import NasaqMark from '../../components/ui/NasaqMark';
import ResponsiveImage from '../../components/ui/ResponsiveImage';
import { about, brandColours, sectionTitles, studioMedia } from '../../data/siteConfig';
import { COMPACT, FINE_POINTER, gsap, MOTION_OK, STAGED } from '../../motion/gsap';
import Construction from './Construction';
import { message, opening, resolution, system } from './studioMotion';

/*
 * Studio — one chapter, told by one piece of geometry.
 *
 *   I    Construction   four circles drift in from far apart, find their 2 × 2
 *                       alignment, and the official symbol resolves inside them.
 *   II   Bridge         the symbol settles onto the crossing of its own two
 *                       construction axes; the axes run on across the screen.
 *   III  Studio         "Studio" and "الاستوديو" land on that horizontal axis from
 *                       opposite sides of the symbol; the portrait rises behind.
 *   IV   System         the axis opens, like a slit, onto the identity in use.
 *   V    Message        the studio in its own words; its colours arrive out of
 *                       step and settle onto one line.
 *   VI   Resolution     the vertical axis runs down to a closed symbol, and on
 *                       into Contact.
 *
 * I–III are one pinned, scrubbed timeline (shorter on small screens); IV–VI
 * each have a single timeline (./studioMotion.js). Everything animates
 * transforms, opacity, clip-path or SVG strokes only. The CSS is the resolved
 * state, so without motion (or JS) every scene simply shows its final composition.
 */
export default function Studio() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia(root);

    mm.add({ staged: STAGED, compact: COMPACT, motion: MOTION_OK, pointer: FINE_POINTER }, (ctx) => {
      const { staged, motion, pointer } = ctx.conditions;
      if (!motion) return undefined;

      // Desktop holds the scene for the whole story; small portrait screens for a
      // shorter one; short landscape screens are not pinned at all.
      const portraitScreen = window.matchMedia('(orientation: portrait)').matches;
      const pin = staged || portraitScreen;
      opening(q, { pin, distance: staged ? 210 : 130 });
      system(q);
      message(q);
      resolution(q);

      // The portrait leans a little towards the pointer — capable desktops only.
      if (!staged || !pointer) return undefined;
      const scene = q('.studio__scene')[0];
      const figure = q('.studio__portrait img')[0];
      const x = gsap.quickTo(figure, 'x', { duration: 0.9, ease: 'power3' });
      const onMove = (e) => x((e.clientX / window.innerWidth - 0.5) * -18);
      scene.addEventListener('pointermove', onMove);
      return () => scene.removeEventListener('pointermove', onMove);
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="studio" id="studio" ref={rootRef} aria-labelledby="studio-title">
      {/* I–III */}
      <div className="studio__scene">
        <span className="studio__axis studio__axis--v" aria-hidden="true" />

        <div className="studio__portrait">
          <ResponsiveImage media={studioMedia.portrait} sizes="(min-width: 1024px) 50vw, 110vw" />
        </div>

        <span className="studio__axis studio__axis--h" aria-hidden="true" />

        {/* One heading, two scripts, meeting at the symbol */}
        <h2 className="studio__title" id="studio-title" tabIndex={-1}>
          <span className="studio__en">{sectionTitles.studio.en}</span>{' '}
          <span className="studio__ar" lang="ar" dir="rtl">
            {sectionTitles.studio.ar}
          </span>
        </h2>

        <div className="studio__markbox" aria-hidden="true">
          <Construction />
          <NasaqMark />
        </div>
      </div>

      {/* IV */}
      <div className="studio__system">
        <span className="studio__slit" aria-hidden="true" />
        <figure className="studio__billboard">
          <ResponsiveImage media={studioMedia.billboard} sizes="(min-width: 1024px) 74vw, 100vw" />
        </figure>
        <figure className="studio__badge">
          <ResponsiveImage media={studioMedia.badge} sizes="(min-width: 1024px) 24vw, 52vw" />
        </figure>
        <span className="studio__pattern" aria-hidden="true" />
      </div>

      {/* V */}
      <div className="studio__message">
        <p className="studio__lead">{about[0]}</p>
        <p className="studio__body">{about[1]}</p>
        <ul className="system" aria-label="The NASAQ colours">
          {brandColours.map((c) => (
            <li key={c.hex} className="system__chip" style={{ '--chip': c.hex }}>
              <span className="system__name">{c.name}</span>
              <span className="system__hex">{c.hex}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* VI */}
      <div className="studio__out" aria-hidden="true">
        <span className="studio__drop" />
        <NasaqMark className="studio__close" />
      </div>
    </section>
  );
}
