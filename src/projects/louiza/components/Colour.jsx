import { useLayoutEffect, useRef } from 'react';
import { gsap, LZ, MOTION_OK } from '../louiza.motion';
import Head from './Head';

/*
 * The colour page, as the presentation draws it: six columns side by side, each
 * named at its foot, and across them one blurred band in which they run into each
 * other (the soft field every page sits on). Holding the screen, the columns rise in
 * order, then the band is drawn across them from the right.
 */
export default function Colour({ project }) {
  const rootRef = useRef(null);
  const { colour: copy } = project.copy;
  const { colours } = project.identity;
  const band = colours.map((c) => c.hex).join(', ');

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      gsap
        .timeline({
          defaults: { ease: LZ.grow },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: 1,
          },
        })
        .from(q('.lz-head > *'), { opacity: 0, y: 20, duration: 0.2, stagger: 0.04 }, 0)
        .from(q('.lz-colour__col'), { yPercent: 100, duration: 0.4, stagger: 0.05 }, 0.05)
        .from(q('.lz-colour__name > *'), { opacity: 0, y: 12, duration: 0.2, stagger: 0.02 }, 0.3)
        .from(
          q('.lz-colour__band'),
          {
            scaleX: 0,
            transformOrigin: '100% 50%',
            duration: 0.4,
            ease: LZ.melt,
          },
          0.5,
        )
        .to({}, { duration: 0.15 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="lz-colour" ref={rootRef} aria-labelledby="lz-colour-title">
      <Head copy={copy} id="lz-colour-title" />
      <div className="lz-colour__page">
        <ul className="lz-colour__cols">
          {colours.map((c) => (
            <li key={c.hex} className="lz-colour__col" style={{ background: c.hex, color: c.ink }}>
              <p className="lz-colour__name">
                <span>{c.name}</span>
                <span className="lz-colour__hex">{c.hex}</span>
              </p>
            </li>
          ))}
        </ul>
        <div
          className="lz-colour__band"
          aria-hidden="true"
          style={{
            '--band-h': `linear-gradient(90deg, ${band})`,
            '--band-v': `linear-gradient(180deg, ${band})`,
          }}
        />
      </div>
    </section>
  );
}
