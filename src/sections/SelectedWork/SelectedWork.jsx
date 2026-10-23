import { useLayoutEffect, useRef } from 'react';
import useReveals from '../../hooks/useReveals';
import { gsap, MOTION_OK, ScrollTrigger } from '../../motion/gsap';
import { polygon, RECT, shapeIn } from '../../utils/shape';
import Chapter from './Chapter';

/*
 * Selected Work — each featured project gets a chapter (./Chapter.jsx), and the
 * section itself turns into each project's own colour as it arrives, so the
 * work never reads as a grid.
 *
 * A project's `signature` then bends its composition around its own artwork:
 * the Rumh mark is the aperture its cover opens through, Louiza's leaf pattern
 * grows beside the bag, the Rukaz pattern travels behind the mug, Snack Quest
 * moves in pixel steps above its slogan ticker.
 */
export default function SelectedWork({ projects }) {
  const rootRef = useRef(null);
  useReveals(rootRef);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);

      // Colour takeover: the section turns into each project's own colour.
      const chapters = q('.chapter');
      root.classList.add('work--takeover');
      gsap.set(root, { backgroundColor: chapters[0]?.dataset.surface });
      chapters.forEach((ch) => {
        ScrollTrigger.create({
          trigger: ch,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            ch.classList.toggle('is-active', self.isActive);
            if (self.isActive) {
              const ease = ch.dataset.motion === 'steps' ? 'steps(5)' : 'power2.inOut';
              gsap.to(root, { backgroundColor: ch.dataset.surface, duration: 0.9, ease, overwrite: true });
            }
          },
        });
      });

      // cinema: the cover opens to the full frame — from a centred crop, or,
      // when the project has a mark shape, through the mark itself
      q('.chapter--cinema').forEach((ch) => {
        const frame = ch.querySelector('.cinema__cover .chapter__frame');
        const shape = ch.dataset.shape && JSON.parse(ch.dataset.shape);
        const from = shape ? () => shapeIn(frame, shape, 0.7) : 'inset(0% 22% 0% 22%)';
        const to = shape ? polygon(RECT) : 'inset(0% 0% 0% 0%)';
        gsap
          .timeline({
            scrollTrigger: { trigger: frame, start: 'top 95%', end: 'center 55%', scrub: 0.5, invalidateOnRefresh: true },
          })
          .fromTo(frame, { clipPath: from }, { clipPath: to, ease: shape ? 'power2.in' : 'none' })
          .fromTo(frame.querySelector('img'), { scale: 1.3 }, { scale: 1, ease: 'none' }, 0);
      });

      // type: the project's name slides across behind its own cover
      q('.chapter--type').forEach((ch) => {
        const st = { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: true };
        gsap.fromTo(ch.querySelector('.type__giant'), { xPercent: 8 }, { xPercent: -14, ease: 'none', scrollTrigger: st });
        const ar = ch.querySelector('.type__giant-ar');
        if (ar) gsap.fromTo(ar, { xPercent: -10 }, { xPercent: 12, ease: 'none', scrollTrigger: { ...st } });
        gsap.fromTo(
          ch.querySelector('.type__cover img'),
          { yPercent: -5, scale: 1.1 },
          { yPercent: 5, scale: 1.1, ease: 'none', scrollTrigger: { ...st } },
        );
      });

      // spread + mosaic covers: cropped → revealed, once
      // (a project that moves in steps opens in steps)
      q('.spread__cover .chapter__frame, .mosaic__cover .chapter__frame').forEach((frame) => {
        const stepped = frame.closest('[data-motion="steps"]');
        gsap
          .timeline({ scrollTrigger: { trigger: frame, start: 'top 85%', once: true } })
          .fromTo(
            frame,
            { clipPath: 'inset(16% 12% 16% 12%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: stepped ? 0.9 : 1.5, ease: stepped ? 'steps(8)' : 'expo.inOut' },
          )
          .fromTo(
            frame.querySelector('img'),
            { scale: 1.3 },
            { scale: 1, duration: stepped ? 0.9 : 1.7, ease: stepped ? 'steps(8)' : 'expo.inOut' },
            0,
          )
          .set(frame, { clearProps: 'clipPath' });
      });
    });
    return () => {
      mm.revert();
      root.classList.remove('work--takeover');
      root.querySelectorAll('.chapter.is-active').forEach((ch) => ch.classList.remove('is-active'));
      root.style.backgroundColor = '';
    };
  }, []);

  return (
    <section className="work" ref={rootRef} aria-label="Selected work">
      {projects.map((project, i) => (
        <Chapter key={project.slug} project={project} index={i} total={projects.length} />
      ))}
    </section>
  );
}
