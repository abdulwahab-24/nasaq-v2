import { gsap, introDone, MOTION_OK, ScrollTrigger } from '../../motion/gsap';
import logoParts from './logo-parts.json';

/*
 * Louiza's motion and logo geometry, shared by its page sections (components/).
 *
 * The identity is soft: a leaf mark, a light Arabic face chosen for its smoothness
 * and flow, colours that blur into each other on every page of the presentation.
 * So the page has one calm motion vocabulary and nothing else:
 *   grow     a leaf grows from its foot, a frame opens from a narrow leaf
 *   write    Arabic is revealed from the right, the way it is written
 *   settle   text rises a little and settles, once, never scrubbed back and forth
 * Every ease comes to rest without overshoot. Three scenes hold the screen (the
 * opening, the colour page, the pattern); everything between them is quiet.
 */
export const LZ = {
  grow: 'power2.out',
  sway: 'sine.inOut',
  melt: 'power1.inOut',
};

// where each part sits on the logo's canvas, as CSS percentages of a given frame
const { width: W, height: H, parts } = logoParts;
export const LOGO_RATIO = `${W} / ${H}`;
export const partBox = (name, frame = [0, 0, W, H]) => {
  const [x, y, w, h] = parts[name];
  const [fx, fy, fw, fh] = frame;
  return {
    left: `${((x - fx) / fw) * 100}%`,
    top: `${((y - fy) / fh) * 100}%`,
    width: `${(w / fw) * 100}%`,
    height: `${(h / fh) * 100}%`,
    '--src': `url(/work/louiza/parts/${name}.png)`,
  };
};
// the two leaves alone (the mark without the wordmark), and its centre on the logo canvas
const [bx, by] = parts.leafBig;
const [sx, sy, sw, sh] = parts.leafSmall;
export const MARK_FRAME = [bx, by, sx + sw - bx, sy + sh - by];
export const MARK_CENTRE = [(bx + MARK_FRAME[2] / 2) / W, (by + MARK_FRAME[3] / 2) / H];
export const MARK_BOX = {
  left: `${(bx / W) * 100}%`,
  top: `${(by / H) * 100}%`,
  width: `${(MARK_FRAME[2] / W) * 100}%`,
  height: `${(MARK_FRAME[3] / H) * 100}%`,
};
// pivots: the tall leaf grows from its foot, the small one from where it meets the stem
export const PIVOT = { leafBig: '62% 100%', leafSmall: '2% 92%' };

// settle: the page's one text entrance (once, when the block comes up the screen)
export function settle(targets, trigger) {
  return gsap.from(targets, {
    y: 24,
    opacity: 0,
    duration: 1.1,
    ease: LZ.grow,
    stagger: 0.08,
    scrollTrigger: { trigger, start: 'top 82%', once: true },
  });
}

// grow (frames): a frame opens from a narrow leaf in its centre to its own leaf corners
export function openLeaf(frame, { start = 'top 88%', end = 'top 38%' } = {}) {
  const radius = () => parseFloat(getComputedStyle(frame).borderTopLeftRadius) || 0;
  return gsap.fromTo(
    frame,
    {
      clipPath: () => `inset(16% 26% 16% 26% round ${Math.max(radius(), frame.offsetHeight * 0.3)}px 0px)`,
    },
    {
      clipPath: () => `inset(0% 0% 0% 0% round ${radius()}px 0px)`,
      ease: LZ.grow,
      scrollTrigger: {
        trigger: frame,
        start,
        end,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    },
  );
}

export { gsap, introDone, MOTION_OK, ScrollTrigger };
