import { useLayoutEffect, useRef } from 'react';
import Arrow from '../../components/ui/Arrow';
import ResponsiveImage from '../../components/ui/ResponsiveImage';
import { gsap, introDone, MOTION_OK } from '../../motion/gsap';
import { useTransition } from '../../transition/context';
import TransitionLink from '../../transition/TransitionLink';
import { pad } from '../../utils/format';
import { PatternBand } from './components/PatternBand';

/*
 * Rukaz — a page designed around the identity itself.
 *
 * The identity is built from one geometric element (the four-part symbol), four
 * colours taken from a landscape, a heavy squared typeface and outdoor goods.
 * The page uses exactly those: the logo is set as type, the palette is laid
 * down as strata, the pattern travels, the goods are a kit list.
 *
 * Everything shown comes from the project entry (rukaz.data.js). The logo,
 * pattern and type specimen are shapes lifted from the supplied pages and
 * painted in CSS, so they stay sharp at any size; photographs are shown as
 * they are — no masks, fades or blends — and never larger than their pixels.
 */


// A rectangular part of a mask image, as its own element.
// x, y, w, h are fractions of the whole artwork.
function Slice({ art, x = 0, y = 0, w = 1, h = 1, className = '', ...rest }) {
  const style = {
    '--slice-img': `url(${art.src})`,
    '--slice-size': `${100 / w}% ${100 / h}%`,
    '--slice-pos': `${w < 1 ? (x / (1 - w)) * 100 : 0}% ${h < 1 ? (y / (1 - h)) * 100 : 0}%`,
    aspectRatio: `${art.width * w} / ${art.height * h}`,
  };
  return <span className={`rk-slice ${className}`} style={style} {...rest} />;
}

// Where the parts sit inside the supplied artwork (measured from the files).
const LOGO = {
  symbol: { x: 0, y: 0, w: 0.346, h: 1 },
  arabic: { x: 0.346, y: 0, w: 0.654, h: 0.5 },
  latin: { x: 0.346, y: 0.5, w: 0.654, h: 0.5 },
};
const SPECIMEN = {
  display: { x: 0, y: 0, w: 0.44, h: 1 },
  alphabet: { x: 0.64, y: 0, w: 0.36, h: 1 },
};

function SectionLabel({ en, ar }) {
  return (
    <p className="rk-label label">
      <span>{en}</span>
      <span lang="ar" dir="rtl">
        {ar}
      </span>
    </p>
  );
}

/* ---------- hero: the logo on forest green, beside the mug on its rock ---------- */
function Hero({ project, index, total }) {
  const { registerHero, whenSettled, isTransitioning } = useTransition();
  const rootRef = useRef(null);
  const imgRef = useRef(null);
  const { logo, copy, cover } = project;

  useLayoutEffect(() => {
    const image = imgRef.current;
    registerHero(image?.decode ? image.decode().catch(() => {}) : Promise.resolve());
    const arriving = isTransitioning();

    const mm = gsap.matchMedia(rootRef);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(rootRef);
      const tl = gsap.timeline({ paused: true });
      // the logo is drawn in from its leading edge, then the words settle
      tl.fromTo(
        q('.rk-hero__logo'),
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' },
      )
        .set(q('.rk-hero__logo'), { clearProps: 'clipPath' })
        .from(q('.rk-hero__meta, .rk-hero__back, .rk-hero__line > *'), { opacity: 0, y: 14, duration: 0.9, stagger: 0.06 }, 0.5);
      // arriving through a page transition the photograph is already in place
      if (!arriving) tl.from(q('.rk-hero__photo img'), { scale: 1.1, duration: 2, ease: 'expo.out' }, 0);

      // leaving: the words lift a little; the photograph itself does not move
      gsap.to(q('.rk-hero__field > *'), {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });

      let alive = true;
      Promise.all([introDone, whenSettled()]).then(() => alive && tl.play());
      return () => {
        alive = false;
      };
    });
    return () => mm.revert();
  }, [registerHero, whenSettled, isTransitioning]);

  return (
    <header className="rk-hero" ref={rootRef}>
      <div className="rk-hero__field">
        <TransitionLink to="/" section="work" className="rk-hero__back text-link">
          <Arrow direction="left" />
          All work
        </TransitionLink>

        <h1 className="rk-hero__title">
          <span className="visually-hidden">
            {project.name} — <span lang="ar">{project.nameAr}</span>
          </span>
          <Slice art={logo} className="rk-hero__logo" aria-hidden="true" />
        </h1>

        <div className="rk-hero__foot">
          <p className="rk-hero__meta label">
            <span>
              {pad(index + 1)} / {pad(total)}
            </span>
            <span>{project.category}</span>
          </p>
          <div className="rk-hero__line">
            <p lang="ar" dir="rtl">
              {copy.lineAr}
            </p>
            <p>{copy.line}</p>
          </div>
        </div>
      </div>

      {/* the photograph, whole and untouched; the page transition lands on this frame */}
      <div className="rk-hero__photo" data-hero-target>
        <ResponsiveImage ref={imgRef} media={cover} sizes="(min-width: 900px) 58vw, 100vw" priority />
      </div>
    </header>
  );
}

/* ---------- introduction: what Rukaz is, in its own words ---------- */
function Intro({ project }) {
  const { copy, logo, identity } = project;
  return (
    <section className="rk-intro" aria-label={`About ${project.name}`}>
      <Slice art={logo} {...LOGO.symbol} className="rk-intro__symbol" aria-hidden="true" />
      <p className="rk-intro__ar" lang="ar" dir="rtl" data-reveal="up">
        {copy.introAr}
      </p>
      <p className="rk-intro__en" data-reveal="up">
        {copy.intro}
      </p>
      <dl className="rk-intro__facts">
        <div>
          <dt className="label">Discipline</dt>
          <dd>{project.category}</dd>
        </div>
        <div>
          <dt className="label">Typeface</dt>
          <dd>{identity.typefaces.join(', ')}</dd>
        </div>
        <div>
          <dt className="label">Colours</dt>
          <dd>{identity.colours.length}</dd>
        </div>
      </dl>
    </section>
  );
}

/* ---------- logo: three parts that lock into one ---------- */
function LogoAnatomy({ project }) {
  const rootRef = useRef(null);
  const { logo } = project;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      // separate → aligned. The symbol has four-fold symmetry, so a quarter turn lands true.
      gsap
        .timeline({ scrollTrigger: { trigger: q('.rk-logo__lockup'), start: 'top 88%', end: 'center 52%', scrub: 0.6 } })
        .from(q('.rk-logo__part--symbol'), { xPercent: -34, rotate: -90, ease: 'power2.out' }, 0)
        .from(q('.rk-logo__part--arabic'), { yPercent: -46, xPercent: 6, ease: 'power2.out' }, 0)
        .from(q('.rk-logo__part--latin'), { yPercent: 46, xPercent: 6, ease: 'power2.out' }, 0)
        .from(q('.rk-logo__keys li'), { opacity: 0, y: 10, stagger: 0.08, duration: 0.3 }, 0.7);
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="rk-logo" ref={rootRef}>
      <SectionLabel en="Logo" ar="الشعار" />
      <div className="rk-logo__lockup" role="img" aria-label={logo.alt} style={{ aspectRatio: `${logo.width} / ${logo.height}` }}>
        <Slice art={logo} {...LOGO.symbol} className="rk-logo__part rk-logo__part--symbol" />
        <Slice art={logo} {...LOGO.arabic} className="rk-logo__part rk-logo__part--arabic" />
        <Slice art={logo} {...LOGO.latin} className="rk-logo__part rk-logo__part--latin" />
      </div>
      <ol className="rk-logo__keys label">
        <li>
          <span>01</span> Symbol
        </li>
        <li>
          <span>02</span> Arabic wordmark
        </li>
        <li>
          <span>03</span> Latin wordmark
        </li>
      </ol>
    </section>
  );
}

/* ---------- pattern: the symbol, repeated; the tote lies across it ---------- */
function Pattern({ project }) {
  const { copy, sig, media } = project;
  return (
    <section className="rk-pattern">
      <PatternBand tile={sig.pattern} rows={4} className="rk-pattern__band" />
      <div className="rk-pattern__body">
        <figure className="rk-pattern__photo rk-cut" data-parallax="0.06" style={{ maxWidth: `${media.tote.width}px` }}>
          <ResponsiveImage media={media.tote} sizes="(min-width: 900px) 500px, 80vw" />
        </figure>
        <div className="rk-pattern__text">
          <SectionLabel en="Pattern" ar="النمط" />
          <p className="rk-pattern__ar" lang="ar" dir="rtl" data-reveal="up">
            {copy.patternAr}
          </p>
          <p className="rk-pattern__en" data-reveal="up">
            {copy.pattern}
          </p>
        </div>
      </div>
      {/* the same band, mirrored, so the two travel against each other */}
      <div className="rk-pattern__band rk-pattern__band--back">
        <PatternBand tile={sig.pattern} rows={2} />
      </div>
    </section>
  );
}

/* ---------- colour: four layers of a landscape ---------- */
function Strata({ project }) {
  const rootRef = useRef(null);
  const { copy, identity, media } = project;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      // each layer is laid down in turn
      gsap
        .timeline({ scrollTrigger: { trigger: q('.rk-strata__layers'), start: 'top 78%', once: true } })
        .from(q('.rk-strata__fill'), { scaleX: 0, duration: 1.1, ease: 'expo.inOut', stagger: 0.12 })
        .from(q('.rk-strata__text'), { opacity: 0, x: -16, duration: 0.6, stagger: 0.12 }, 0.5);
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="rk-strata" ref={rootRef}>
      <header className="rk-strata__head">
        <SectionLabel en="Colour" ar="الألوان" />
        <p className="rk-strata__lead" lang="ar" dir="rtl" data-reveal="up">
          {copy.coloursAr}
        </p>
        <p className="rk-strata__sub" data-reveal="up">
          {copy.colours}
        </p>
      </header>

      <div className="rk-strata__stage">
        <ul className="rk-strata__layers">
          {identity.colours.map((c) => (
            <li key={c.hex} className="rk-strata__layer" style={{ '--c': c.hex }} data-tone={c.name.toLowerCase()}>
              <span className="rk-strata__fill" aria-hidden="true" />
              <span className="rk-strata__text">
                <span className="rk-strata__name">{c.name}</span>
                <span className="rk-strata__ar" lang="ar" dir="rtl">
                  {c.nameAr}
                </span>
                <span className="rk-strata__hex">{c.hex}</span>
              </span>
            </li>
          ))}
        </ul>
        {/* the landscape the palette is read from */}
        <figure className="rk-strata__photo rk-cut" data-parallax="0.05" style={{ maxWidth: `${media.mountain.width}px` }}>
          <ResponsiveImage media={media.mountain} sizes="(min-width: 900px) 30vw, 70vw" />
        </figure>
      </div>
    </section>
  );
}

/* ---------- type: the specimen, set large ---------- */
function Type({ project }) {
  const { sig, identity } = project;
  const art = sig.typeSpecimen;
  return (
    <section className="rk-type">
      <div className="rk-type__head">
        <SectionLabel en="Typography" ar="الخطوط" />
        <p className="rk-type__name">{identity.typefaces[0]}</p>
      </div>
      <div className="rk-type__specimen" role="img" aria-label={art.alt}>
        <Slice art={art} {...SPECIMEN.display} className="rk-type__display" data-reveal="up" />
        <Slice art={art} {...SPECIMEN.alphabet} className="rk-type__alphabet" data-reveal="up" />
      </div>
    </section>
  );
}

/* ---------- kit: every application, as a packing list ---------- */
function Kit({ project }) {
  const { media } = project;
  return (
    <section className="rk-kit" aria-labelledby="rk-kit-title">
      <header className="rk-kit__head">
        <div>
          <SectionLabel en="Applications" ar="النماذج التطبيقية" />
          <h2 className="rk-kit__title" id="rk-kit-title" data-reveal="lines">
            <span className="line">
              <span>The kit.</span>
            </span>
          </h2>
          <p className="rk-kit__count label">({pad(media.apps.length)}) pieces</p>
        </div>
        <figure className="rk-kit__photo rk-cut" style={{ maxWidth: `${media.lighters.width}px` }}>
          <span data-reveal="clip">
            <ResponsiveImage media={media.lighters} sizes="(min-width: 900px) 34vw, 90vw" />
          </span>
        </figure>
      </header>

      <ol className="rk-kit__list">
        {media.apps.map((item, i) => (
          <li key={item.src} className="rk-kit__row" data-reveal="up">
            <span className="rk-kit__num">{pad(i + 1)}</span>
            <span className="rk-kit__name">{item.name}</span>
            <span className="rk-kit__thumb">
              <ResponsiveImage media={item} sizes={`${item.width}px`} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- close: one line, and the pattern running out ---------- */
function Closing({ project }) {
  const { copy, logo, sig } = project;
  return (
    <section className="rk-close">
      <Slice art={logo} {...LOGO.symbol} className="rk-close__symbol" aria-hidden="true" />
      <p className="rk-close__ar" lang="ar" dir="rtl" data-reveal="lines">
        <span className="line">
          <span>{copy.closingAr}</span>
        </span>
      </p>
      <p className="rk-close__en" data-reveal="up">
        {copy.closing}
      </p>
      <PatternBand tile={sig.pattern} rows={2} className="rk-close__band" />
    </section>
  );
}

export default function RukazPage({ project, index, total }) {
  return (
    <div className="rk">
      <Hero project={project} index={index} total={total} />
      <Intro project={project} />
      <LogoAnatomy project={project} />
      <Pattern project={project} />
      <Strata project={project} />
      <Type project={project} />
      <Kit project={project} />
      <Closing project={project} />
    </div>
  );
}
