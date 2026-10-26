import { useLayoutEffect, useRef } from 'react';
import ResponsiveImage from '../../../components/ui/ResponsiveImage';
import { MOTION_OK } from '../../../motion/gsap';
import { contourPolygon, coverScale, outerContour } from '../contour';
import { DT, gsap } from '../datoura.motion';
import Art from './Art';

/*
 * The identity applied, in three moments built three ways:
 *   Card     the card front drawn at the scale of the screen from its own vectors,
 *            its contours drawn in from the inside out, with the printed card over it
 *   Stadium  the advertising board, opened through the symbol's contour
 *   Screen   the website on a phone, laid into the violet gradient it was shot on
 */

export function Card({ project }) {
  const rootRef = useRef(null);
  const { card } = project.copy;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(rootRef);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(rootRef);
      // the artboard lists its contours outermost first, from the thinnest line to the heaviest
      const contours = q('[data-role="contour"]').reverse();
      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%', end: 'center 45%', scrub: 0.6 },
      });
      // the printed card drifts up over the drawing
      gsap.fromTo(
        q('.dt-card__print'),
        { yPercent: 18 },
        { yPercent: -12, ease: 'none', scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
      tl.fromTo(contours, { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 1, ease: DT.draw, stagger: 0.12 }, 0).fromTo(
        q('.dt-card__art [data-role="letter"]'),
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.4, ease: DT.ease, stagger: 0.04 },
        0.35,
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="dt-card" ref={rootRef} aria-labelledby="dt-card-title">
      <Art name="card" className="dt-card__art" preserveAspectRatio="xMidYMid slice" label={card.artLabel} />
      <h2 className="dt-label dt-card__label" id="dt-card-title">
        {card.label}
      </h2>
      <figure className="dt-card__print">
        <ResponsiveImage media={project.media.cardPrint} sizes="(min-width: 768px) 36vw, 78vw" />
      </figure>
    </section>
  );
}

export function Stadium({ project }) {
  const rootRef = useRef(null);
  const { stadium } = project.copy;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(rootRef);
    mm.add(MOTION_OK, () => {
      const root = rootRef.current;
      const frame = root.querySelector('.dt-stadium__frame');
      const { points } = outerContour();
      const state = { k: 0.12 };
      const draw = () => {
        const W = frame.clientWidth;
        const H = frame.clientHeight;
        const s = Math.min(W, H) * 0.34;
        const k = state.k * coverScale(W / 2, H / 2, s, s, W, H);
        frame.style.clipPath = state.k >= 1 ? '' : contourPolygon(points, W / 2, H / 2, s, s, k);
      };
      draw();
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: 'top 60%', end: 'center center', scrub: 0.6, invalidateOnRefresh: true } })
        .to(state, { k: 1, duration: 1, ease: 'power2.in', onUpdate: draw }, 0)
        .fromTo(frame.querySelector('img'), { scale: 1.18 }, { scale: 1, duration: 1, ease: 'none' }, 0);
      return () => (frame.style.clipPath = '');
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="dt-stadium" ref={rootRef} aria-labelledby="dt-stadium-title">
      <div className="dt-stadium__sticky">
        <div className="dt-stadium__frame">
          <ResponsiveImage media={project.media.stadium} sizes="100vw" />
        </div>
        <h2 className="dt-label dt-stadium__label" id="dt-stadium-title">
          {stadium.label}
        </h2>
      </div>
    </section>
  );
}

export function Screen({ project }) {
  const rootRef = useRef(null);
  const { screen } = project.copy;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(rootRef);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(rootRef);
      const root = rootRef.current;
      // the phone rises through its gradient; the line arrives as it does
      gsap.fromTo(
        q('.dt-screen__phone'),
        { yPercent: 14 },
        { yPercent: -8, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
      gsap.fromTo(
        q('.dt-screen__copy > *'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, ease: DT.ease, stagger: 0.1, scrollTrigger: { trigger: root, start: 'top 60%', once: true } },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="dt-screen" ref={rootRef} aria-labelledby="dt-screen-title">
      <div className="dt-screen__copy">
        <h2 className="dt-label" id="dt-screen-title">
          {screen.label}
        </h2>
        <p className="dt-lede">
          {screen.text}
        </p>
      </div>
      <figure className="dt-screen__phone">
        <ResponsiveImage media={project.media.phone} sizes="(min-width: 768px) 60vw, 120vw" />
      </figure>
    </section>
  );
}
