import { useLayoutEffect, useRef } from 'react';
import ResponsiveImage from '../../../components/ui/ResponsiveImage';
import { polygon, RECT, shapeIn } from '../../../utils/shape';
import { gsap, MARK, MOTION_OK, RM } from '../rumh.motion';

/*
 * The identity in use: five scenes, each taking the whole width of the screen, one
 * after another with no gaps, so the colour moves from scene to scene:
 *   ArtDirection  dark    the spearhead on stone, opened through the mark
 *   Wayfinding    grey    the gate sign, revealed by one cut along the mark's top edge
 *   Sign          pale    the acrylic plaque, opened through the mark
 *   Objects       white | red   key rings on white beside badges on the red pattern
 *   Digital       red → navy    the phone on the guidelines' gradient, into the close
 * Every scene carries the same caption, a small navy plate in its lower left corner.
 */
function Caption({ copy }) {
  return (
    <figcaption className="rm-cap">
      <span className="rm-cap__label">{copy.label}</span>
      {copy.text && <span className="rm-cap__text">{copy.text}</span>}
    </figcaption>
  );
}

// the frame opens from a small mark at its centre to the whole screen
function useAperture(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const frame = root.querySelector('.rm-scene__frame');
      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: 'top 80%', end: 'top 5%', scrub: RM.scrub, invalidateOnRefresh: true },
        })
        .fromTo(frame, { clipPath: () => shapeIn(frame, MARK, 0.42) }, { clipPath: polygon(RECT), ease: 'power2.in' })
        .fromTo(frame.querySelector('img'), { scale: 1.25 }, { scale: 1, ease: 'none' }, 0);
    });
    return () => mm.revert();
  }, [rootRef]);
}

export function ArtDirection({ project }) {
  const rootRef = useRef(null);
  useAperture(rootRef);
  return (
    <figure className="rm-scene rm-scene--art" ref={rootRef}>
      <div className="rm-scene__frame">
        <ResponsiveImage media={project.media.spear} sizes="100vw" />
      </div>
      <Caption copy={project.copy.applications.art} />
    </figure>
  );
}

export function Wayfinding({ project }) {
  const rootRef = useRef(null);
  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      // one straight cut, slanted like the mark's top edge, crossing the frame
      gsap.fromTo(
        root.querySelector('.rm-scene__frame'),
        { clipPath: 'polygon(0% 0%, 0% 0%, 0% 31%, 0% 100%)' },
        {
          clipPath: 'polygon(0% 0%, 131% 0%, 131% 31%, 100% 100%)',
          ease: RM.cut,
          duration: 1.2,
          scrollTrigger: { trigger: root, start: 'top 65%', once: true },
        },
      );
    });
    return () => mm.revert();
  }, []);
  return (
    <figure className="rm-scene rm-scene--way" ref={rootRef}>
      <div className="rm-scene__frame">
        <ResponsiveImage media={project.media.signage} sizes="100vw" />
      </div>
      <Caption copy={project.copy.applications.signage} />
    </figure>
  );
}

export function Sign({ project }) {
  const rootRef = useRef(null);
  useAperture(rootRef);
  return (
    <figure className="rm-scene rm-scene--sign" ref={rootRef}>
      <div className="rm-scene__frame">
        <ResponsiveImage media={project.media.sign} sizes="100vw" />
      </div>
      <Caption copy={project.copy.applications.sign} />
    </figure>
  );
}

export function Objects({ project }) {
  const rootRef = useRef(null);
  const { keyring, badges } = project.media;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: 'top 85%', end: 'top 15%', scrub: RM.scrub } })
        .from(q('.rm-objects__red'), { yPercent: 100, ease: RM.throw }, 0)
        .from(q('.rm-objects__white img'), { yPercent: 16, opacity: 0, ease: RM.throw }, 0.1);
    });
    return () => mm.revert();
  }, []);

  return (
    <figure className="rm-scene rm-objects" ref={rootRef}>
      <div className="rm-objects__white">
        <ResponsiveImage media={keyring} sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
      <div className="rm-objects__red">
        <ResponsiveImage media={badges} sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
      <Caption copy={project.copy.applications.objects} />
    </figure>
  );
}

export function Digital({ project }) {
  const rootRef = useRef(null);
  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        root.querySelector('img'),
        { scale: 1.18, yPercent: 6 },
        {
          scale: 1,
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'top top', scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);
  return (
    <figure className="rm-scene rm-scene--digital" ref={rootRef}>
      <div className="rm-scene__frame">
        <ResponsiveImage media={project.media.digital} sizes="100vw" />
      </div>
      <Caption copy={project.copy.applications.digital} />
    </figure>
  );
}
