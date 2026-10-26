import { useLayoutEffect, useRef } from 'react';
import ResponsiveImage from '../../../components/ui/ResponsiveImage';
import { gsap, MOTION_OK, NB, octagon } from '../nurba.motion';
import Caption from './Caption';

/*
 * The identity in use: the boards' own photographs, few and large, in an order
 * that runs from light to dark into the close.
 *   Engraving  the bangles, full-bleed, revealed by the band of light
 *   Vitrine    the cases, the gift box and the necklace case on the photographs'
 *              own pale blue, passing sideways as in a display case (a column on
 *              phones); the gift box, shot on grey, is framed in the octagon
 *   Bags       the transparent bag mockup standing on cream
 *   Card       opened through the octagon, from the size of the monogram to the screen
 *   Envelopes  full-bleed, “Luxury in Every Detail”
 *   Campaign   the metro poster, full-bleed
 * Every scene carries the same caption (Caption.jsx).
 */
const VITRINE = '#B2C6D9'; // the field of the cases and necklace photographs

// a frame revealed by a soft band of light crossing it, as the scene comes up
function useLight(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const frame = root.querySelector('.nb-scene__frame');
      frame.classList.add('nb-lit');
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: 'top 85%', end: 'top 15%', scrub: 0.8 } })
        .fromTo(frame, { '--nb-light': '0%' }, { '--nb-light': '130%', ease: NB.light }, 0)
        .fromTo(frame.querySelector('img'), { scale: 1.08 }, { scale: 1, ease: 'none' }, 0);
      return () => frame.classList.remove('nb-lit');
    });
    return () => mm.revert();
  }, [rootRef]);
}

function Scene({ media, copy, className = '', sizes = '100vw' }) {
  const ref = useRef(null);
  useLight(ref);
  return (
    <figure className={`nb-scene ${className}`} ref={ref}>
      <div className="nb-scene__frame">
        <ResponsiveImage media={media} sizes={sizes} />
      </div>
      <Caption copy={copy} />
    </figure>
  );
}

export function Engraving({ project }) {
  const ref = useRef(null);
  useLight(ref);
  return (
    <figure className="nb-scene nb-scene--engraving" ref={ref}>
      <div className="nb-scene__frame">
        <ResponsiveImage media={project.media.cover} sizes="100vw" />
      </div>
      <Caption copy={project.copy.applications.cover} />
    </figure>
  );
}

export function Vitrine({ project }) {
  const rootRef = useRef(null);
  const { cases, gift, necklace } = project.media;
  const copy = project.copy.applications;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add({ ok: MOTION_OK, wide: '(min-width: 900px)' }, ({ conditions }) => {
      if (!conditions.ok) return;
      const q = gsap.utils.selector(root);
      const track = q('.nb-vitrine__track')[0];
      const slide =
        conditions.wide &&
        gsap.to(track, {
          x: () => -(track.scrollWidth - root.offsetWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => `+=${track.scrollWidth - root.offsetWidth}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      // pieces already in view before the track moves are set as the section arrives
      q('.nb-vitrine__item').forEach((item, i) => {
        const inView = slide && item.offsetLeft < root.offsetWidth * 0.9;
        gsap.from(item.querySelector('.nb-vitrine__img'), {
          y: -18,
          opacity: 0,
          duration: 1.2,
          ease: NB.set,
          delay: inView ? i * 0.15 : 0,
          scrollTrigger:
            slide && !inView
              ? { trigger: item, containerAnimation: slide, start: 'left 90%', once: true }
              : { trigger: slide ? root : item, start: slide ? 'top 60%' : 'top 80%', once: true },
        });
      });
    });
    return () => mm.revert();
  }, []);

  const item = (media, c, framed) => (
    <figure className={`nb-vitrine__item${framed ? ' nb-vitrine__item--framed' : ''}`}>
      <div className="nb-vitrine__img" style={{ aspectRatio: `${media.width} / ${media.height}` }}>
        <ResponsiveImage media={media} sizes="(min-width: 900px) 52vw, 100vw" />
      </div>
      <Caption copy={c} />
    </figure>
  );

  return (
    <section className="nb-vitrine" ref={rootRef} style={{ '--vitrine': VITRINE }} aria-label="Packaging">
      <div className="nb-vitrine__track">
        {item(cases, copy.cases)}
        {item(gift, copy.gift, true)}
        {item(necklace, copy.necklace)}
      </div>
    </section>
  );
}

export function Bags({ project }) {
  const rootRef = useRef(null);
  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        root.querySelector('.nb-bags__img'),
        { yPercent: 14, scale: 0.94 },
        {
          yPercent: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'center center', scrub: 0.8 },
        },
      );
    });
    return () => mm.revert();
  }, []);
  const { bags } = project.media;
  return (
    <figure className="nb-scene nb-bags" ref={rootRef}>
      <div className="nb-bags__img" style={{ aspectRatio: `${bags.width} / ${bags.height}` }}>
        <ResponsiveImage media={bags} sizes="(min-width: 900px) 84vw, 120vw" />
      </div>
      <Caption copy={project.copy.applications.bags} />
    </figure>
  );
}

// the card, seen first through an octagon the size of the monogram, which opens to the screen
export function Card({ project }) {
  const rootRef = useRef(null);
  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const frame = root.querySelector('.nb-scene__frame');
      const shape = (k) => () => {
        const { offsetWidth: w, offsetHeight: h } = frame;
        const r = k === 'small' ? Math.min(w, h) * 0.2 : Math.hypot(w, h) * 0.75;
        const pts = octagon(w / 2, h / 2, r).map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`);
        return `polygon(${pts.join(', ')})`;
      };
      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: 'top 75%', end: 'top top', scrub: 0.8, invalidateOnRefresh: true },
        })
        .fromTo(frame, { clipPath: shape('small') }, { clipPath: shape('wide'), ease: 'power2.in' }, 0)
        .fromTo(frame.querySelector('img'), { scale: 1.25 }, { scale: 1, ease: 'none' }, 0);
    });
    return () => mm.revert();
  }, []);
  return (
    <figure className="nb-scene nb-scene--card" ref={rootRef}>
      <div className="nb-scene__frame">
        <ResponsiveImage media={project.media.card} sizes="100vw" />
      </div>
      <Caption copy={project.copy.applications.card} />
    </figure>
  );
}

export function Envelopes({ project }) {
  return (
    <Scene media={project.media.envelopes} copy={project.copy.applications.envelopes} className="nb-scene--envelopes" />
  );
}

export function Campaign({ project }) {
  const copy = { ...project.copy.applications.subway, text: `“${project.copy.lines.poster}”` };
  return <Scene media={project.media.subway} copy={copy} className="nb-scene--campaign" />;
}
