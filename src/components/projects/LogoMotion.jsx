import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../motion/gsap';

/*
 * A project's logo motion film (`motionLogo` in its data, see utils/media.js).
 *
 * It is the identity being built, so it always starts from its empty field: it
 * plays from the beginning each time it comes properly into view and stops (and
 * rewinds) once it has left. Only near-visible films load; under reduced motion
 * the poster — the assembled logo — is shown and nothing plays.
 *
 *   seamless  the film sits directly on the project's own colour field: its edges
 *             are feathered so the frame disappears into the page. Otherwise it is
 *             a plate of its own colour.
 */
export default function LogoMotion({ film, seamless = false, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || prefersReducedMotion()) return undefined;

    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && video.preload !== 'auto') video.preload = 'auto';
      },
      { rootMargin: '600px 0px' },
    );
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.45) {
          if (video.paused) video.play().catch(() => {});
        } else if (entry.intersectionRatio === 0) {
          video.pause();
          if (video.currentTime) video.currentTime = 0;
        }
      },
      { threshold: [0, 0.45] },
    );
    near.observe(video);
    seen.observe(video);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, []);

  return (
    <figure
      className={`lmotion${seamless ? ' lmotion--seamless' : ''} ${className}`}
      style={{ '--lm-field': film.field, '--lm-ratio': `${film.width} / ${film.height}` }}
    >
      <video
        ref={ref}
        className="lmotion__video"
        poster={film.poster}
        width={film.width}
        height={film.height}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-label={film.alt}
      >
        {film.sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
    </figure>
  );
}
