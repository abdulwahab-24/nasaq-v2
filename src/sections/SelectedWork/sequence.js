/*
 * The Selected Work sequence: one scrubbed timeline across every featured
 * project, so the section plays as one continuous piece of motion.
 *
 *   [enter 1][hold 1][leave 1 + reveal 2 + enter 2][hold 2][leave 2 + reveal 3 …
 *
 * A project choreographs its own part through `home.sequence`
 * (projects/<slug>/<slug>.sequence.js), an object of steps that add tweens to the
 * timeline at the time they are given:
 *
 *   setup?(s)              once, before anything: build extra field nodes; returns
 *                          { …state, cleanup } (available to the steps as s.setup)
 *   reveal?(s, at)         its field arriving over the previous project
 *                          (default: rises from the bottom edge)
 *   enter(s, at)           its logo assembling, ~ENTER long
 *   hold?(s, at, duration) what it does while it holds the screen
 *   leave(s, at, next)     its logo going, ~LEAVE long. With `handoff: true` it also
 *                          opens the next scene itself (next.scene), so the next
 *                          project's reveal is skipped: the exit becomes the entrance.
 *
 *   s = { tl, scene, field, logo, part(name), box(name), u(px), setup }
 *   part(name)  a logo part element (components/projects/LogoParts.jsx)
 *   box(name)   its [x, y, w, h] on the logo canvas; u(px) turns canvas px into
 *               screen px (call it inside function-based values, so a refresh
 *               re-measures it)
 *
 * Tweens use fromTo for an element's first appearance (that sets its starting
 * state when the timeline is built) and to() after. No staggers: every element
 * gets its own explicit time, so re-rendering the timeline after a refresh
 * always resets everything.
 */
export const ENTER = 1;
export const HOLD = 1.3;
export const LEAVE = 1;

// Projects without their own choreography (or without logo parts).
export const fallbackSequence = {
  reveal({ tl, scene }, at) {
    tl.fromTo(
      scene,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power2.inOut' },
      at,
    );
  },
  enter({ tl, logo }, at) {
    tl.fromTo(
      logo,
      { autoAlpha: 0, y: 40, scale: 0.96 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' },
      at,
    );
  },
  leave({ tl, logo }, at) {
    tl.to(logo, { autoAlpha: 0, y: -40, duration: 0.5, ease: 'power2.in' }, at);
  },
};

// The scene's words: they arrive once the logo has assembled and go before it does.
// Opacity only (never visibility), so every project's link stays reachable by keyboard;
// focusing one brings its scene to rest (SelectedWork.jsx).
function wordsIn(tl, scene, at, withHead) {
  const els = scene.querySelectorAll(withHead ? '.seq__head, .seq__text' : '.seq__text');
  tl.fromTo(els, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, at);
}

function wordsOut(tl, scene, at) {
  tl.to(scene.querySelectorAll('.seq__head, .seq__text'), { opacity: 0, y: -10, duration: 0.2, ease: 'power1.in' }, at);
}

/*
 * Adds every scene to `tl`. Returns, per scene, when it takes over (`from`) and
 * the middle of its hold (`rest`), plus the timeline's total length.
 */
export function buildSequence(tl, scenes) {
  const times = [];
  let t = 0;
  scenes.forEach((scene, i) => {
    const { s, seq } = scene;
    let enterAt = 0.05;
    let from = 0;
    if (i > 0) {
      const prev = scenes[i - 1];
      from = t;
      wordsOut(tl, prev.s.scene, t);
      prev.seq.leave(prev.s, t, prev.seq.handoff ? s : null);
      if (!prev.seq.handoff) (seq.reveal ?? fallbackSequence.reveal)(s, t + LEAVE * 0.35);
      enterAt = t + LEAVE * 0.8;
    }
    seq.enter(s, enterAt);
    // the first scene's head is on screen from the start, before its logo arrives
    wordsIn(tl, s.scene, enterAt + ENTER * 0.7, i > 0);
    const holdAt = enterAt + ENTER;
    seq.hold?.(s, holdAt, HOLD);
    t = holdAt + HOLD;
    times.push({ from, rest: holdAt + HOLD / 2 });
  });
  tl.set({}, {}, t + 0.2); // a last breath before the section scrolls on
  return { times, duration: t + 0.2 };
}
