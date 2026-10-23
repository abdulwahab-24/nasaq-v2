import { gsap } from '../../motion/gsap';
import { OUT, SCATTER, SIZE } from './geometry';

/*
 * Studio timelines, one per scene (see the scene list in Studio.jsx).
 * Each takes `q`, a gsap selector scoped to the section, and is created inside
 * the section's gsap.matchMedia, which reverts all of them on unmount.
 */

/* ---------- I–III: construction → bridge → Studio (one timeline) ---------- */
export function opening(q, { pin, distance }) {
  const scene = q('.studio__scene')[0];
  const box = q('.studio__markbox')[0];
  // The symbol starts large in the middle of the screen (never beyond its 470 px
  // artwork) and ends small on the axis crossing, where the CSS places it.
  const bigScale = () => Math.min(scene.clientHeight * 0.46, scene.clientWidth * 0.62, SIZE) / box.offsetWidth;
  const toCentre = () => scene.clientHeight / 2 - (box.offsetTop + box.offsetHeight / 2);
  const piece = (el) => OUT[el.dataset.quadrant];

  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    scrollTrigger: {
      id: 'studio',
      trigger: scene,
      start: pin ? 'top top' : 'top 80%',
      end: pin ? `+=${distance}%` : 'bottom bottom',
      pin,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // from/fromTo tweens render their starting state at once, so everything that
  // belongs to scenes II and III is already out of sight while scene I plays.

  /* I — fragmented → aligned */
  tl.set(q('.sc'), { opacity: 1 }, 0)
    .addLabel('fragments', 0)
    .fromTo(
      q('.sc__circle'),
      {
        x: (i, el) => SCATTER[el.dataset.c].x,
        y: (i, el) => SCATTER[el.dataset.c].y,
        scale: (i, el) => SCATTER[el.dataset.c].scale,
        opacity: 0.55,
      },
      { x: 0, y: 0, scale: 1, opacity: 1, duration: 3.4, stagger: 0.22 },
      'fragments',
    )
    .fromTo(q('.sc__line--h'), { scaleX: 0 }, { scaleX: 1, duration: 1.6, stagger: 0.12, ease: 'power2.inOut' }, 1.6)
    .fromTo(q('.sc__line--v'), { scaleY: 0 }, { scaleY: 1, duration: 1.6, stagger: 0.12, ease: 'power2.inOut' }, 1.8)
    .addLabel('aligned', 4.1)
    .fromTo(q('.sc__square'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.08, ease: 'power2.inOut' }, 'aligned-=0.5')
    // the official symbol: four quarters closing along their diagonals
    .fromTo(
      q('.studio__markbox .mark__piece'),
      {
        xPercent: (i, el) => piece(el)[0] * 16,
        yPercent: (i, el) => piece(el)[1] * 16,
        rotate: (i, el) => piece(el)[0] * piece(el)[1] * -18,
        opacity: 0,
      },
      { xPercent: 0, yPercent: 0, rotate: 0, opacity: 1, duration: 1.1, stagger: 0.07, ease: 'power3.out' },
      'aligned',
    )
    .to(q('.sc__circle'), { opacity: 0.3, duration: 0.7, ease: 'power1.out' }, 'aligned+=0.7')
    .addLabel('symbol', 5.6);

  /* II — the symbol finds its place; its axes carry on across the screen */
  tl.fromTo(box, { scale: bigScale, y: toCentre }, { scale: 1, y: 0, duration: 1.8 }, 'symbol')
    .to(q('.sc'), { opacity: 0, duration: 0.9, ease: 'power1.in' }, 'symbol')
    .fromTo(q('.studio__axis--h'), { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'expo.inOut' }, 'symbol+=0.5')
    .fromTo(q('.studio__axis--v'), { scaleY: 0 }, { scaleY: 1, duration: 1.5, ease: 'expo.inOut' }, 'symbol+=0.65')
    .addLabel('axis', 7.4);

  /* III — two scripts, one baseline */
  tl.fromTo(
    q('.studio__portrait'),
    { opacity: 0, yPercent: 9 },
    { opacity: 1, yPercent: 0, duration: 1.9, ease: 'power2.out' },
    'axis-=0.9',
  )
    .fromTo(
      q('.studio__en'),
      { opacity: 0, xPercent: -22, yPercent: 34 },
      { opacity: 1, xPercent: 0, yPercent: 0, duration: 1.4, ease: 'power3.out' },
      'axis-=0.35',
    )
    .fromTo(
      q('.studio__ar'),
      { opacity: 0, xPercent: 22, yPercent: -40 },
      { opacity: 1, xPercent: 0, yPercent: 0, duration: 1.4, ease: 'power3.out' },
      'axis-=0.2',
    )
    .addLabel('studio', 8.9)
    // a held beat, so the composition is read before the page moves on
    .to({}, { duration: 0.9 });

  // Before the scene is pinned it is already on its way in: the scattered arcs
  // turn slowly towards their alignment, so the screen is never still.
  if (pin) {
    gsap.fromTo(
      q('.sc'),
      { rotate: -14 },
      { rotate: 0, ease: 'none', scrollTrigger: { trigger: scene, start: 'top bottom', end: 'top top', scrub: 0.6 } },
    );
  }

  return tl;
}

/* ---------- IV: the axis opens onto the identity in use ---------- */
export function system(q) {
  const root = q('.studio__system')[0];
  return gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root, start: 'top 82%', end: 'center 48%', scrub: 0.6 },
    })
    .fromTo(q('.studio__slit'), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.inOut' }, 0)
    .fromTo(
      q('.studio__billboard'),
      { clipPath: 'inset(49.6% 0% 49.6% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power2.inOut' },
      0.2,
    )
    .fromTo(q('.studio__billboard img'), { scale: 1.16 }, { scale: 1, duration: 0.8 }, 0.2)
    .fromTo(q('.studio__slit'), { opacity: 1 }, { opacity: 0, duration: 0.2 }, 0.5)
    // the badge arrives out of line and hangs true
    .fromTo(
      q('.studio__badge'),
      { yPercent: 24, rotate: 5, opacity: 0 },
      { yPercent: 0, rotate: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
      0.45,
    )
    .fromTo(q('.studio__pattern'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.5);
}

/* ---------- V: message, then the colours settle onto one line ---------- */
export function message(q) {
  return gsap
    .timeline({ scrollTrigger: { trigger: q('.studio__message')[0], start: 'top 74%', once: true } })
    .from(q('.studio__lead'), { x: -36, opacity: 0, duration: 1.2, ease: 'expo.out' }, 0)
    .from(q('.studio__body'), { x: 36, opacity: 0, duration: 1.2, ease: 'expo.out' }, 0.12)
    .from(
      q('.system__chip'),
      { y: (i) => [44, -30, 62, -18, 50, -40, 26][i % 7], opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05 },
      0.3,
    );
}

/* ---------- VI: the axis runs down to a closed symbol ---------- */
export function resolution(q) {
  const piece = (el) => OUT[el.dataset.quadrant];
  return gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: q('.studio__out')[0], start: 'top 88%', end: 'bottom 62%', scrub: 0.6 },
    })
    .fromTo(q('.studio__drop'), { scaleY: 0 }, { scaleY: 1, duration: 0.7 }, 0)
    .fromTo(
      q('.studio__out .mark__piece'),
      { xPercent: (i, el) => piece(el)[0] * 26, yPercent: (i, el) => piece(el)[1] * 26, opacity: 0.4 },
      { xPercent: 0, yPercent: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
      0.55,
    );
}
