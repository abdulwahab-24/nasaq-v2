import { useLayoutEffect, useRef } from 'react';
import Arrow from '../../components/ui/Arrow';
import LogoParts from '../../components/projects/LogoParts';
import { projectPath } from '../../projects';
import { gsap, MOTION_OK, ScrollTrigger } from '../../motion/gsap';
import { scrollToY } from '../../motion/lenis';
import TransitionLink from '../../transition/TransitionLink';
import { inkOn } from '../../utils/colour';
import { buildSequence, fallbackSequence } from './sequence';

/*
 * Selected Work: the featured projects told through their logos, one after
 * another, as one continuous sequence. Each scene is the project's own field,
 * its official logo (assembled from its parts, components/projects/LogoParts.jsx)
 * and a few words (its tagline and Arabic name, if it has them; name, facts, link);
 * nothing else.
 *
 * With motion, the section holds the screen (CSS sticky) while one scrubbed
 * timeline (./sequence.js) plays every project's own choreography: its logo
 * enters and assembles, holds, and leaves, and its exit hands the screen to the
 * next project. The visitor's scroll drives it, forwards and back; Lenis keeps
 * that scroll smooth and ScrollTrigger in step with it.
 * Without motion (or JS) the scenes are simply laid one after another, each
 * logo assembled.
 *
 * Adding a project: give it `home.logo` (its parts) and `home.sequence` (its
 * choreography); without them it shows its logo file with the fallback motion.
 */
function Scene({ project, index, onFocus }) {
  const { home = {}, theme } = project;
  const id = `seq-${project.slug}`;
  const facts = [project.category, project.year].filter(Boolean);
  const field = home.field ?? theme.surface;
  const ink = home.ink ?? theme.ink;

  return (
    <article
      className={`seq__scene${inkOn(field) !== '#FFFFFF' ? ' is-light' : ''}`}
      aria-labelledby={id}
      data-slug={project.slug}
      style={{ '--seq-field': field, '--seq-ink': ink, zIndex: index + 1 }}
    >
      <span className="seq__field" aria-hidden="true" />

      <p className="seq__head label">
        <span>{project.tagline}</span>
        {project.nameAr && (
          <span lang="ar" dir="rtl">
            {project.nameAr}
          </span>
        )}
      </p>

      <TransitionLink
        to={projectPath(project)}
        color={field}
        className="seq__logo"
        data-cursor="View project"
        aria-labelledby={id}
        tabIndex={-1}
      >
        {home.logo ? (
          <LogoParts parts={home.logo} label={project.name} />
        ) : (
          <img className="seq__img" src={project.logo?.src} alt={project.name} />
        )}
      </TransitionLink>

      <div className="seq__text">
        <h3 className="seq__name" id={id}>
          {project.name}
        </h3>
        {facts.length > 0 && <p className="seq__meta">{facts.join(' · ')}</p>}
        <TransitionLink to={projectPath(project)} className="text-link seq__link" aria-describedby={id} onFocus={onFocus}>
          View project
          <Arrow />
        </TransitionLink>
      </div>
    </article>
  );
}

export default function SelectedWork({ projects }) {
  const rootRef = useRef(null);
  const focusRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);

    mm.add(MOTION_OK, () => {
      root.classList.add('seq--staged');
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });

      const scenes = [...root.querySelectorAll('.seq__scene')].map((el, i) => {
        const project = projects[i];
        const manifest = project.home?.logo?.manifest;
        const logo = el.querySelector('.lp, .seq__img');
        const s = {
          tl,
          scene: el,
          field: el.querySelector('.seq__field'),
          logo,
          part: (name) => logo.querySelector(`[data-part="${name}"]`),
          box: (name) => manifest.parts[name],
          u: (px) => (manifest ? (px * logo.offsetWidth) / manifest.width : px),
        };
        const seq = manifest && project.home?.sequence ? project.home.sequence : fallbackSequence;
        s.setup = seq.setup?.(s) ?? {};
        return { el, s, seq };
      });

      const { times, duration } = buildSequence(tl, scenes);
      root.style.setProperty('--seq-length', duration.toFixed(3));

      // the scene on screen takes the pointer; the others let it through
      let current = -1;
      const setCurrent = (time) => {
        let i = 0;
        while (i + 1 < times.length && time >= times[i + 1].from) i++;
        if (i === current) return;
        scenes.forEach((sc, k) => sc.el.classList.toggle('is-current', k === i));
        current = i;
      };

      const st = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        animation: tl,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => setCurrent(self.progress * duration),
      });
      setCurrent(0);

      // keyboard: a project's link taking focus brings its scene to rest on screen
      focusRef.current = (i) => {
        const y = st.start + (times[i].rest / duration) * (st.end - st.start);
        if (Math.abs(window.scrollY - y) > 2) scrollToY(y);
      };

      return () => {
        focusRef.current = null;
        scenes.forEach((sc) => {
          sc.s.setup.cleanup?.();
          sc.el.classList.remove('is-current');
        });
        root.classList.remove('seq--staged');
        root.style.removeProperty('--seq-length');
      };
    });
    return () => mm.revert();
  }, [projects]);

  return (
    <section className="work seq" ref={rootRef} aria-label="Selected work">
      <div className="seq__stage">
        {projects.map((project, i) => (
          <Scene
            key={project.slug}
            project={project}
            index={i}
            onFocus={() => focusRef.current?.(i)}
          />
        ))}
      </div>
    </section>
  );
}
