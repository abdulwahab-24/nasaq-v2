import { useLayoutEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Arrow from '../components/Arrow';
import ResponsiveImage, { Backdrop } from '../components/ResponsiveImage';
import { allProjects, getNextProject, getProject, projectPath } from '../data/projects';
import { DESKTOP, gsap, introDone, MOTION_OK } from '../motion/gsap';
import useReveals from '../motion/useReveals';
import { useTransition } from '../transition/context';
import TransitionLink from '../transition/TransitionLink';
import { inkOn } from '../utils/colour';
import { largestSrc } from '../utils/media';
import useMeta from '../utils/useMeta';
import NotFound from './NotFound';

const pad = (n) => String(n).padStart(2, '0');

/* ---------- colour fields (project colours, inside project frames only) ---------- */

function toneColour(tone, project) {
  if (!tone || tone === 'page') return null;
  if (tone === 'surface') return project.theme.surface;
  if (tone === 'accent') return project.theme.accent;
  if (tone === 'ink') return project.theme.ink;
  return tone;
}

const fieldStyle = (tone, project) => {
  const bg = toneColour(tone, project);
  return bg ? { '--field': bg, '--field-ink': inkOn(bg) } : undefined;
};

// Never display an image wider than its pixels.
const nativeMax = (media) => ({ maxWidth: `${media.width}px` });

function Frame({ media, sizes, reveal = 'clip', className = '', parallax, style }) {
  return (
    <figure className={`pfig ${className}`} data-parallax={parallax} style={style}>
      <span className="pfig__frame" data-reveal={reveal}>
        <ResponsiveImage media={media} sizes={sizes} />
      </span>
    </figure>
  );
}

function BlockLabel({ label, labelAr, index }) {
  if (!label) return null;
  return (
    <p className="plabel label">
      {index != null && <span className="plabel__num">{pad(index)}</span>}
      <span>{label}</span>
      {labelAr && (
        <span className="plabel__ar" lang="ar" dir="rtl">
          {labelAr}
        </span>
      )}
    </p>
  );
}

/* ---------- story blocks ---------- */

function Bleed({ block }) {
  const { media } = block;
  // Smaller sources sit at native size on a blurred extension of themselves.
  const extend = media.blur && media.width < 1700;
  return (
    <section className={`pb pb--bleed${extend ? ' pb--extend' : ''}`}>
      {extend && <Backdrop media={media} />}
      <Frame media={media} sizes="100vw" style={extend ? nativeMax(media) : undefined} />
    </section>
  );
}

function Stage({ block, project }) {
  const { media, size = 'm', place = 'center' } = block;
  return (
    <section className={`pb pb--stage pb--${size} pb--${place}`} style={fieldStyle(block.tone, project)}>
      <BlockLabel label={block.label} labelAr={block.labelAr} />
      <Frame media={media} sizes="(min-width: 1024px) 60vw, 100vw" style={nativeMax(media)} />
    </section>
  );
}

function Detail({ block, index }) {
  return (
    <section className="pb pb--detail">
      <div className="pdetail__main">
        <Frame media={block.media} sizes="(min-width: 1024px) 50vw, 100vw" style={nativeMax(block.media)} />
      </div>
      <div className="pdetail__side">
        <BlockLabel label={block.label} labelAr={block.labelAr} index={index} />
        {block.context && (
          <>
            <Frame media={block.context} sizes="(min-width: 1024px) 30vw, 70vw" parallax="0.08" />
            {block.contextLabel && <p className="label pdetail__caption">{block.contextLabel}</p>}
          </>
        )}
      </div>
    </section>
  );
}

function Layered({ block, project }) {
  const [base, a, b] = block.items;
  return (
    <section className="pb pb--layered" style={fieldStyle(block.tone, project)}>
      <div className="players">
        <Frame media={base} className="players__base" sizes="(min-width: 1024px) 52vw, 100vw" />
        {a && <Frame media={a} className="players__a" sizes="(min-width: 1024px) 34vw, 70vw" parallax="0.14" />}
        {b && <Frame media={b} className="players__b" sizes="(min-width: 1024px) 24vw, 50vw" parallax="-0.08" />}
      </div>
    </section>
  );
}

function Pair({ block }) {
  return (
    <section className={`pb pb--pair pb--${block.ratio ?? 'equal'}${block.offset ? ' pb--offset' : ''}`}>
      {block.items.map((m, i) => (
        <Frame
          key={m.src}
          media={m}
          sizes="(min-width: 768px) 50vw, 100vw"
          parallax={block.offset && i === 1 ? '0.08' : undefined}
        />
      ))}
    </section>
  );
}

function Sequence({ block }) {
  const rootRef = useRef(null);

  // Desktop: the run moves sideways while the section is pinned (one per page).
  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(DESKTOP, () => {
      const track = root.querySelector('.pseq__track');
      const distance = () => Math.max(0, track.scrollWidth - root.clientWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="pb pb--sequence" ref={rootRef} aria-label={block.label}>
      <div className="pseq__head">
        <BlockLabel label={block.label} labelAr={block.labelAr} />
        <p className="label pseq__count">{pad(block.items.length)} images</p>
      </div>
      <div className="pseq__track" tabIndex={0} data-allow-overflow>
        {block.items.map((m) => (
          <figure key={m.src} className="pseq__item" style={{ '--ratio': `${m.width} / ${m.height}` }}>
            <ResponsiveImage media={m} sizes="(min-width: 1024px) 60vw, 85vw" />
          </figure>
        ))}
      </div>
    </section>
  );
}

function TypeBlock({ block, project }) {
  return (
    <section className="pb pb--type" style={fieldStyle(block.tone, project)}>
      <p className="ptype__family" aria-hidden="true">
        {block.family}
      </p>
      <div className="ptype__meta">
        <BlockLabel label="Typography" labelAr="الخطوط" />
        <p className="ptype__name">{block.family}</p>
      </div>
      <Frame
        media={block.media}
        className="ptype__specimen"
        sizes="(min-width: 1024px) 70vw, 100vw"
        style={nativeMax(block.media)}
      />
    </section>
  );
}

function LogoBlock({ block, project }) {
  const light = block.variant === 'light';
  const logo = light ? project.logoDark : project.logo;
  if (!logo) return null;
  return (
    <section
      className={`pb pb--logo pb--logo-${light ? 'light' : 'dark'}`}
      style={light ? undefined : { '--field': project.theme.surface }}
    >
      <img src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} loading="lazy" data-reveal="up" />
    </section>
  );
}

function Palette({ project }) {
  const { colours = [], typefaces = [] } = project.identity ?? {};
  if (!colours.length) return null;
  return (
    <section className="pb pb--palette" aria-label={`${project.name} colour palette`}>
      <div className="pspec">
        <BlockLabel label="Colour" labelAr="الألوان" />
        {typefaces.length > 0 && (
          <div className="pspec__type">
            <p className="label">Typography</p>
            <ul>
              {typefaces.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ul className="swatches" style={{ '--count': colours.length }}>
        {colours.map((c, i) => (
          <li key={c.hex} className="swatch" style={{ '--chip': c.hex, '--i': i }} data-reveal="up">
            <span className="swatch__chip" />
            <span className="swatch__text">
              {c.name && <span className="swatch__name">{c.name}</span>}
              <span className="swatch__hex">{c.hex}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Words({ block }) {
  return (
    <section className="pb pb--words" aria-label={block.label}>
      <BlockLabel label={block.label} labelAr={block.labelAr} />
      <ul className="pwords" lang="ar" dir="rtl" data-reveal="lines">
        {block.words.map((w) => (
          <li key={w} className="line">
            <span>{w}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const BLOCKS = {
  bleed: Bleed,
  stage: Stage,
  detail: Detail,
  layered: Layered,
  pair: Pair,
  sequence: Sequence,
  type: TypeBlock,
  logo: LogoBlock,
  palette: Palette,
  words: Words,
};

/* ---------- hero ---------- */

function ProjectHero({ project, index }) {
  const { registerHero, whenSettled, isTransitioning } = useTransition();
  const rootRef = useRef(null);
  const imgRef = useRef(null);
  const { layout, media } = project.hero;
  const facts = [project.category, project.year, project.location].filter(Boolean);

  useLayoutEffect(() => {
    const image = imgRef.current;
    registerHero(image?.decode ? image.decode().catch(() => {}) : Promise.resolve());
    const arriving = isTransitioning();

    const mm = gsap.matchMedia(rootRef);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(rootRef);
      const tl = gsap.timeline({ paused: true });
      tl.from(q('.line > span'), { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: 0.08 }).from(
        q('.phero__meta, .phero__back'),
        { opacity: 0, y: 12, duration: 0.8 },
        0.25,
      );
      if (layout === 'plate') {
        tl.from(q('.phero__giant'), { xPercent: 8, opacity: 0, duration: 1.6, ease: 'expo.out' }, 0);
      }
      // Without a page transition the work opens from a crop instead.
      if (!arriving && layout !== 'bleed') {
        tl.fromTo(
          q('.phero__frame'),
          { clipPath: 'inset(18% 18% 18% 18%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' },
          0,
        );
      }

      const scrub = { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(q('.phero__frame img'), { yPercent: layout === 'bleed' ? 12 : 5, ease: 'none', scrollTrigger: scrub });
      if (layout === 'plate') {
        gsap.to(q('.phero__giant'), { xPercent: -12, ease: 'none', scrollTrigger: { ...scrub } });
      }

      let alive = true;
      Promise.all([introDone, whenSettled()]).then(() => alive && tl.play());
      return () => {
        alive = false;
      };
    });
    return () => mm.revert();
  }, [project.slug, layout, registerHero, whenSettled, isTransitioning]);

  const style = {
    '--surface': project.theme.surface,
    '--hero-ink': project.theme.ink,
    '--hero-accent': project.theme.accent,
    '--plate-ratio': `${media.width} / ${media.height}`,
    '--plate-w': media.width,
    '--plate-h': media.height,
  };

  return (
    <header className={`phero phero--${layout}`} ref={rootRef} style={style}>
      {layout === 'plate' && (
        <p className="phero__giant" aria-hidden="true">
          {project.name}
        </p>
      )}

      <div className="phero__media">
        <span className="phero__frame" data-hero-target>
          <ResponsiveImage
            ref={imgRef}
            media={media}
            sizes={layout === 'bleed' ? '100vw' : '(min-width: 1024px) 50vw, 100vw'}
            priority
          />
        </span>
      </div>
      {layout === 'bleed' && <div className="phero__scrim" aria-hidden="true" />}

      <TransitionLink to="/" section="work" className="phero__back text-link">
        <Arrow direction="left" />
        All work
      </TransitionLink>

      <div className="phero__titles">
        <p className="phero__meta label">
          <span>
            {pad(index + 1)} / {pad(allProjects.length)}
          </span>
          {facts.map((f) => (
            <span key={f}>{f}</span>
          ))}
        </p>
        <h1 className="phero__name">
          <span className="line">
            <span>{project.name}</span>
          </span>
        </h1>
        {project.nameAr && (
          <p className="phero__ar" lang="ar" dir="rtl">
            <span className="line">
              <span>{project.nameAr}</span>
            </span>
          </p>
        )}
      </div>
    </header>
  );
}

function ProjectIntro({ project }) {
  const { identity = {} } = project;
  const rows = [
    ['Discipline', project.category],
    ['Year', project.year],
    ['Location', project.location],
    ['Services', project.services?.length ? project.services.join(', ') : null],
    ['Typography', identity.typefaces?.length ? identity.typefaces.join(', ') : null],
  ].filter(([, v]) => v);

  return (
    <section className="pintro" aria-label="Project details">
      {project.tagline && (
        <p className="pintro__tagline" data-reveal="lines">
          <span className="line">
            <span>“{project.tagline}”</span>
          </span>
        </p>
      )}
      {(project.description || project.overview) && (
        <div className="pintro__copy" data-reveal="up">
          {project.description && <p className="pintro__lead">{project.description}</p>}
          {project.overview && <p>{project.overview}</p>}
        </div>
      )}
      <dl className="pintro__facts" data-reveal="up">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="label">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function NextProject({ project }) {
  const media = project.home?.cover ?? project.cover;
  const style = {
    '--next-field': project.theme.surface,
    '--next-ink': inkOn(project.theme.surface),
    '--next-accent': project.theme.accent,
  };
  return (
    <section className="pnext" aria-label="Next project" style={style}>
      <TransitionLink
        to={projectPath(project)}
        media
        color={project.theme.surface}
        className="pnext__link"
        data-cursor="Next"
      >
        <span className="pnext__label label">Next project</span>
        <span className="pnext__name">{project.name}</span>
        {project.nameAr && (
          <span className="pnext__ar" lang="ar" dir="rtl">
            {project.nameAr}
          </span>
        )}
        <span className="pnext__frame" data-transition-media>
          <ResponsiveImage media={media} sizes="(min-width: 1024px) 34vw, 70vw" alt="" />
        </span>
        <span className="pnext__arrow" aria-hidden="true">
          <Arrow />
        </span>
      </TransitionLink>
    </section>
  );
}

function ProjectPage({ project }) {
  const rootRef = useRef(null);
  const index = allProjects.indexOf(project);
  const next = getNextProject(project.slug);

  useMeta({
    title: project.name,
    description: `${project.name}${project.nameAr ? ` (${project.nameAr})` : ''} — ${project.category} by NASAQ, a Saudi brand identity studio.`,
    image: largestSrc(project.cover),
  });
  useReveals(rootRef, [project.slug]);

  // Detail blocks are numbered in reading order.
  const detailIndex = project.story.reduce((acc, b, i) => {
    if (b.type === 'detail') acc[i] = Object.keys(acc).length + 1;
    return acc;
  }, {});

  return (
    <article
      className={`project project--${project.theme.mode}`}
      ref={rootRef}
      style={{ '--accent-p': project.theme.accent, '--surface': project.theme.surface }}
    >
      <ProjectHero project={project} index={index} />
      <ProjectIntro project={project} />
      <div className="pstory">
        {project.story.map((block, i) => {
          const Block = BLOCKS[block.type];
          if (!Block) return null;
          return <Block key={`${block.type}-${i}`} block={block} project={project} index={detailIndex[i]} />;
        })}
      </div>
      {next && next !== project && <NextProject project={next} />}
    </article>
  );
}

export default function Project() {
  const { slug } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFound />;
  // keyed so every project mounts fresh (motion, reveals, scroll triggers)
  return <ProjectPage key={project.slug} project={project} />;
}
