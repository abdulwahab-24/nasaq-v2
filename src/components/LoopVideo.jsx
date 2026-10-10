import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../motion/gsap';

/*
 * Muted, inline, looping video that only plays while visible and never under
 * reduced motion (the poster is shown instead). Sources are fetched lazily.
 */
export default function LoopVideo({ sources, poster, className, label }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || prefersReducedMotion()) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload !== 'auto') {
            video.preload = 'auto';
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      disablePictureInPicture
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}
