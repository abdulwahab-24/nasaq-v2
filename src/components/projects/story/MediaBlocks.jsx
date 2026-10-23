import { useLayoutEffect, useRef } from 'react';
import { DESKTOP, gsap } from '../../../motion/gsap';
import { pad } from '../../../utils/format';
import LoopVideo from '../../ui/LoopVideo';
import ResponsiveImage, { Backdrop } from '../../ui/ResponsiveImage';
import { fieldStyle, nativeMax, STAGE_SIZES } from './fields';
import { BlockLabel, Frame } from './Frame';

/* Story blocks built around photographs and film: bleed, video, stage, detail, layered, pair, sequence. */

// Project film, viewport-wide. Plays muted while visible; the poster stands in under reduced motion.
export function Video({ block }) {
  const { sources, poster, label } = block;
  return (
    <section className="pb pb--bleed pb--video">
      <figure className="pfig">
        <span className="pfig__frame" data-reveal="clip">
          <LoopVideo sources={sources} poster={poster} label={label} />
        </span>
      </figure>
    </section>
  );
}

export function Bleed({ block }) {
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

export function Stage({ block, project }) {
  const { media, size = 'm', place = 'center', seamless } = block;
  return (
    <section
      className={`pb pb--stage pb--${size} pb--${place}${seamless ? ' pb--seamless' : ''}`}
      style={fieldStyle(block.tone, project)}
    >
      <BlockLabel label={block.label} labelAr={block.labelAr} />
      {/* seamless: the field is the photograph's own backdrop, so there is no frame to open */}
      <Frame
        media={media}
        sizes={STAGE_SIZES[size]}
        style={nativeMax(media)}
        reveal={seamless ? 'up' : 'clip'}
      />
    </section>
  );
}

export function Detail({ block, index }) {
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

export function Layered({ block, project }) {
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

export function Pair({ block }) {
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

export function Sequence({ block }) {
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
      <div className="pseq__track" tabIndex={0} role="group" aria-label={`${block.label} — scrollable images`} data-allow-overflow>
        {block.items.map((m) => (
          <figure key={m.src} className="pseq__item" style={{ '--ratio': `${m.width} / ${m.height}` }}>
            <ResponsiveImage media={m} sizes="(min-width: 1024px) 90vw, 140vw" />
          </figure>
        ))}
      </div>
    </section>
  );
}
