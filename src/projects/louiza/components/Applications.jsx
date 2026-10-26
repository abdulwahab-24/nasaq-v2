import { useLayoutEffect, useRef } from 'react';
import ResponsiveImage from '../../../components/ui/ResponsiveImage';
import { gsap, MOTION_OK, openLeaf, settle } from '../louiza.motion';
import Head from './Head';

/*
 * The identity in use, in two layouts and no others (project.applications):
 *   scene  the photograph laid straight onto the colour it was taken on, so the
 *          object stands on the page itself; it drifts up a little as it passes
 *   pair   one large leaf-cornered frame running off the right edge, one small frame
 *          overlapping its lower left; both open from a narrow leaf
 * Every caption sits in the same place: the left column, level with the top of its
 * picture. Each block melts in from the colour of the block before it.
 */
const PAGE = '#FFF0DA';

function Caption({ item }) {
  return (
    <figcaption className="lz-app__caption">
      <span className="lz-index">{item.label}</span>
      {item.note && <span className="lz-app__note">{item.note}</span>}
    </figcaption>
  );
}

function Scene({ item }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const root = ref.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        root.querySelector('.lz-app__photo'),
        { yPercent: 6 },
        {
          yPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
      settle(root.querySelectorAll('.lz-app__caption > *'), root);
    });
    return () => mm.revert();
  }, []);
  return (
    <figure className="lz-app lz-app--scene lz-grid" ref={ref}>
      <Caption item={item} />
      <div className="lz-app__photo">
        <ResponsiveImage media={item.media} sizes="(min-width: 1024px) 66vw, 100vw" />
      </div>
    </figure>
  );
}

function Pair({ item }) {
  const ref = useRef(null);
  const [large, small] = item.items;
  useLayoutEffect(() => {
    const root = ref.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      root.querySelectorAll('.lz-leaf').forEach((frame) => openLeaf(frame));
      gsap.to(root.querySelector('.lz-app__small'), {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
      settle(root.querySelectorAll('.lz-app__caption > *'), root);
    });
    return () => mm.revert();
  }, []);
  return (
    <figure className="lz-app lz-app--pair lz-grid" ref={ref}>
      <Caption item={item} />
      <div className="lz-app__large lz-leaf" style={{ aspectRatio: `${large.width} / ${large.height}` }}>
        <ResponsiveImage media={large} sizes="(min-width: 1024px) 70vw, 100vw" />
      </div>
      <div className="lz-app__small lz-leaf" style={{ aspectRatio: `${small.width} / ${small.height}` }}>
        <ResponsiveImage media={small} sizes="(min-width: 1024px) 30vw, 60vw" />
      </div>
    </figure>
  );
}

export default function Applications({ project }) {
  const items = project.applications;
  return (
    <section className="lz-apps" aria-labelledby="lz-apps-title">
      <Head copy={project.copy.applications} id="lz-apps-title" />
      {items.map((item, i) => {
        const field = item.kind === 'scene' ? item.field : PAGE;
        const before = i === 0 ? PAGE : items[i - 1].kind === 'scene' ? items[i - 1].field : PAGE;
        const Block = item.kind === 'scene' ? Scene : Pair;
        return (
          <div key={item.label} className="lz-apps__block" style={{ '--lz-from': before, '--lz-to': field }}>
            <Block item={item} />
          </div>
        );
      })}
    </section>
  );
}
