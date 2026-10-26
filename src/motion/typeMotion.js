import { SplitText } from 'gsap/SplitText';
import { gsap } from './gsap';

gsap.registerPlugin(SplitText);

/*
 * One motion language for display typography (Statement, Services).
 *
 *   display type   rises out of a mask, line by line: TYPE.rise, TYPE.ease
 *   small type     fades up a short way (labels, numbers): TYPE.small
 *   rules          draw from the left, a little slower and eased both ways
 *
 * Lines rise from below their own mask, so nothing scales, bounces or overlaps,
 * and no layout changes: masks are wrappers around text that is already in place.
 * Arabic is never split; a whole Arabic line rises inside its mask, so shaping
 * and right-to-left alignment are untouched.
 */
export const TYPE = {
  ease: 'power3.out',
  rise: 0.95, // a display line rising out of its mask
  line: 0.09, // between lines of one block
  block: 0.28, // between blocks
  small: 0.7, // small type fading up
  rule: 1.1, // a hairline drawing across
  from: 130, // yPercent below the mask the line starts at (clear of its descender room)
};

/*
 * Splits a block into masked lines at its current width. Call it when the
 * block is about to play (fonts loaded, layout settled) and revert it when the
 * block has landed, so the text reflows freely again afterwards.
 */
export const splitLines = (el) =>
  SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'tline', aria: 'auto' });

// display lines rising out of their masks
export const riseLines = (tl, lines, at, vars = {}) =>
  tl.fromTo(
    lines,
    { yPercent: TYPE.from },
    { yPercent: 0, duration: TYPE.rise, ease: TYPE.ease, stagger: TYPE.line, ...vars },
    at,
  );

// small type fading up
export const fadeUp = (tl, els, at, vars = {}) =>
  tl.fromTo(
    els,
    { autoAlpha: 0, y: 12 },
    { autoAlpha: 1, y: 0, duration: TYPE.small, ease: TYPE.ease, stagger: 0.08, ...vars },
    at,
  );
