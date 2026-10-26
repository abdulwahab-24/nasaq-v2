/*
 * DATOURA in the Selected Work sequence: Data + Aura, the graduated waves.
 * The symbol is three concentric contours of one rounded shield (contour.js,
 * traced from the supplied artwork). Arriving, echoes of its outer contour ripple
 * out from the centre; the rings settle with them from the inside out, and the
 * wordmark is lit letter by letter as the wave front passes. While it holds, one
 * slow wave travels out through the rings. Leaving, the letters are drawn back into
 * the symbol, the inner rings fold in, and the symbol opens: the next identity
 * appears inside its outer contour, which widens until it fills the screen
 * (DATOURA hands off: it opens the next scene itself).
 * Timeline API: sections/SelectedWork/sequence.js.
 */
import { gsap } from '../../motion/gsap';
import { contourPolygon, coverScale, outerContour, SHUT } from './contour';
import manifest from './logo-parts.json';

const NS = 'http://www.w3.org/2000/svg';
const RINGS = ['ring-2', 'ring-1', 'ring-0']; // inside out
const LETTERS = ['letter-0', 'letter-1', 'letter-2', 'letter-3', 'letter-4', 'letter-5', 'letter-6'];
const ECHOES = 3; // waves on arrival; one more travels during the hold
const WAVE = ['#844BE0', '#A17EFF']; // the identity's two violets

// One copy of the contour as a line, filling the box of the outer ring.
const contour = (edge, colour, width) => {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', edge.viewBox);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('class', 'dat-aura__line');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', edge.d);
  path.setAttribute('transform', 'scale(1 -1)');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', colour);
  path.setAttribute('stroke-width', width);
  path.setAttribute('vector-effect', 'non-scaling-stroke');
  svg.append(path);
  return svg;
};

const openIn = gsap.parseEase('power2.out');
const widen = gsap.parseEase('power2.in');

export default {
  handoff: true,

  // the waves: line copies of the outer contour, laid over the outer ring's box, under the logo
  setup({ logo }) {
    const edge = outerContour();
    const [x, y, w, h] = manifest.parts['ring-0'];
    const pct = (v, of) => `${((v / of) * 100).toFixed(4)}%`;
    const host = document.createElement('span');
    host.className = 'dat-aura';
    host.setAttribute('aria-hidden', 'true');
    Object.assign(host.style, {
      left: pct(x, manifest.width),
      top: pct(y, manifest.height),
      width: pct(w, manifest.width),
      height: pct(h, manifest.height),
    });
    const echoes = Array.from({ length: ECHOES + 1 }, (_, i) => contour(edge, WAVE[i % 2], 1.5));
    const opening = contour(edge, WAVE[1], 2);
    host.append(...echoes, opening);
    logo.append(host); // after the parts (React keeps its own nodes first); drawn under them by z-index
    return {
      host,
      echoes,
      opening,
      points: edge.points,
      next: null,
      cleanup() {
        host.remove();
        if (this.next) this.next.scene.style.clipPath = '';
      },
    };
  },

  enter({ tl, part, u, setup }, at) {
    setup.echoes.slice(0, ECHOES).forEach((echo, i) => {
      const t = at + i * 0.12;
      tl.fromTo(echo, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 0.8, duration: 0.3, ease: 'power2.out' }, t).to(
        echo,
        { scale: 2.4 + i * 0.5, opacity: 0, duration: 0.5, ease: 'power1.out' },
        t + 0.3,
      );
    });
    RINGS.forEach((name, i) => {
      tl.fromTo(
        part(name),
        { scale: 0.55, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.42, ease: 'power3.out' },
        at + 0.1 + i * 0.12,
      );
    });
    // the wave front reaches each letter in turn, further letters later
    LETTERS.forEach((name, i) => {
      tl.fromTo(
        part(name),
        { autoAlpha: 0, x: () => -u(28) },
        { autoAlpha: 1, x: 0, duration: 0.32, ease: 'power2.out' },
        at + 0.38 + i * 0.055,
      );
    });
  },

  hold({ tl, part, setup }, at, duration) {
    const echo = setup.echoes[ECHOES];
    tl.fromTo(echo, { scale: 1, opacity: 0 }, { scale: 1, opacity: 0.6, duration: 0.15, ease: 'none' }, at + 0.1)
      .to(echo, { scale: 2.8, opacity: 0, duration: duration - 0.3, ease: 'sine.out' }, at + 0.25)
      // the rings answer the wave, inside first
      .to(part('ring-2'), { scale: 1.06, duration: duration * 0.3, ease: 'sine.inOut' }, at + 0.1)
      .to(part('ring-2'), { scale: 1, duration: duration * 0.3, ease: 'sine.inOut' }, at + 0.1 + duration * 0.3)
      .to(part('ring-1'), { scale: 1.035, duration: duration * 0.3, ease: 'sine.inOut' }, at + 0.25)
      .to(part('ring-1'), { scale: 1, duration: duration * 0.3, ease: 'sine.inOut' }, at + 0.25 + duration * 0.3);
  },

  leave({ tl, part, u, setup }, at, next) {
    // the wordmark is drawn back into the symbol, last letter first
    [...LETTERS].reverse().forEach((name, i) => {
      tl.to(part(name), { autoAlpha: 0, x: () => -u(60 + i * 12), duration: 0.3, ease: 'power2.in' }, at + i * 0.035);
    });
    tl.to(part('ring-2'), { scale: 0.5, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, at + 0.08).to(
      part('ring-1'),
      { scale: 0.6, autoAlpha: 0, duration: 0.3, ease: 'power2.in' },
      at + 0.16,
    );
    if (!next) {
      tl.to(part('ring-0'), { scale: 1.6, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, at + 0.25);
      return;
    }

    // the opening: the next scene, clipped to the outer contour, growing from the symbol's centre
    setup.next = next;
    next.scene.style.clipPath = SHUT;
    const { host, opening, points } = setup;
    const A = 0.3; // share of the tween spent opening up to the outer ring itself
    const state = { p: 0 };
    const draw = () => {
      const p = state.p;
      if (p <= 0) {
        next.scene.style.clipPath = SHUT;
        gsap.set(opening, { opacity: 0, scale: 1 });
        return;
      }
      const ring = host.getBoundingClientRect();
      const stage = next.scene.getBoundingClientRect();
      const cx = ring.left + ring.width / 2 - stage.left;
      const cy = ring.top + ring.height / 2 - stage.top;
      // wide enough that the contour's narrowest reach clears the farthest corner
      const max = coverScale(cx, cy, ring.width, ring.height, stage.width, stage.height);
      const k = p <= A ? openIn(p / A) : 1 + (max - 1) * widen((p - A) / (1 - A));
      next.scene.style.clipPath = contourPolygon(points, cx, cy, ring.width, ring.height, k);
      // the contour line rides just outside the opening once it has reached the ring
      const shown = gsap.utils.clamp(0, 1, (k - 0.85) / 0.2) * (1 - gsap.utils.clamp(0, 1, (p - 0.82) / 0.18));
      gsap.set(opening, { opacity: shown, scale: k * 1.02 });
    };
    tl.fromTo(state, { p: 0 }, { p: 1, duration: 0.82, ease: 'none', onUpdate: draw }, at + 0.18).to(
      part('ring-0'),
      { autoAlpha: 0, duration: 0.15, ease: 'none' },
      at + 0.38,
    );
  },
};
