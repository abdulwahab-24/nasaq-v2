/*
 * Rumh — رمح, "precision hits the target".
 * The spearhead is thrown along its own axis (its point is the top-left corner of
 * the mark) and lands exactly on its place; the wordmark is cut open along the
 * line of flight. At impact two hairlines run on from the point, the converging
 * lines of the identity's concept page. Then the throw carries on out of frame and
 * the wordmark is swept away along the same diagonal.
 */
window.SCENE = {
  width: 1680,
  height: 720,
  background: '#111F35',
  fps: 60,
  duration: 4.8,
  poster: 2.6,
  logoWidth: 980,

  build({ stage, parts, box, origin, gsap }) {
    const RED = '#FF3C55';
    const { mark, word } = parts;
    const m = box.mark;
    mark.style.zIndex = 3;
    word.style.zIndex = 2;

    // flight direction: up-left, along the spear's diagonal
    const d = [-Math.SQRT1_2, -Math.SQRT1_2];
    const n = [Math.SQRT1_2, -Math.SQRT1_2];
    const FLIGHT = 1150;
    const BIG = 6000;

    const line = (cls) => {
      const el = document.createElement('div');
      Object.assign(el.style, {
        position: 'absolute',
        height: '3px',
        marginTop: '-1.5px',
        background: RED,
        transformOrigin: '0 50%',
        zIndex: 1,
      });
      el.className = cls;
      stage.append(el);
      return el;
    };
    const trail = line('trail');
    // the two edges that meet at the point, continued beyond it
    const edges = [
      [-m[2], -m[3] * 0.31],
      [-m[2] * 0.31, -m[3]],
    ].map(([x, y]) => {
      const el = line('edge');
      el.style.transform = `rotate(${Math.atan2(y, x)}rad) scaleX(0)`;
      return el;
    });

    const s = { p: 0, trail: 0, edge: 0, edgeFade: 1, sweep: 0 };
    const tip0 = [origin.x + m[0], origin.y + m[1]]; // the point, at rest (stage px)
    const centre0 = [tip0[0] + m[2] / 2, tip0[1] + m[3] / 2];

    // half-plane clip on the wordmark, in its own px: the side of the line through
    // `at` (stage px) that lies along `side` (+1 ahead of the flight, -1 behind it)
    const halfPlane = (at, side) => {
      const L = [at[0] - origin.x, at[1] - origin.y];
      const pts = [
        [L[0] + n[0] * BIG, L[1] + n[1] * BIG],
        [L[0] - n[0] * BIG, L[1] - n[1] * BIG],
        [L[0] - n[0] * BIG + side * d[0] * BIG, L[1] - n[1] * BIG + side * d[1] * BIG],
        [L[0] + n[0] * BIG + side * d[0] * BIG, L[1] + n[1] * BIG + side * d[1] * BIG],
      ];
      return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
    };

    const render = () => {
      // p: 0 = out of frame (bottom right) → 1 = on target → 2 = gone (top left)
      const dist = s.p <= 1 ? -(1 - s.p) * FLIGHT : (s.p - 1) * FLIGHT * 1.25;
      const off = [d[0] * dist, d[1] * dist];
      mark.style.transform = `translate(${off[0]}px, ${off[1]}px)`;
      const tip = [tip0[0] + off[0], tip0[1] + off[1]];

      // wordmark: open behind the point while it flies in; swept away after
      if (s.sweep > 0) {
        // the sweep line travels from beyond the wordmark's lower right to beyond its upper left
        const reach = (origin.w + origin.h) * 0.42;
        const k = -reach + s.sweep * reach * 2;
        const at = [origin.x + origin.w / 2 + d[0] * k, origin.y + origin.h / 2 + d[1] * k];
        word.style.clipPath = halfPlane(at, 1);
      } else {
        word.style.clipPath = s.p >= 1 ? 'none' : halfPlane(tip, -1);
      }

      // the line of flight, from the spear back along its path
      const c = [centre0[0] + off[0], centre0[1] + off[1]];
      Object.assign(trail.style, {
        left: `${c[0]}px`,
        top: `${c[1]}px`,
        width: `${FLIGHT}px`,
        transform: `rotate(45deg) scaleX(${Math.min(s.p, 1) * s.trail})`,
        opacity: s.p > 1 ? 0 : 1,
      });

      edges.forEach((el, i) => {
        const [x, y] = i ? [-m[2] * 0.31, -m[3]] : [-m[2], -m[3] * 0.31];
        Object.assign(el.style, {
          left: `${tip0[0]}px`,
          top: `${tip0[1]}px`,
          width: '320px',
          opacity: s.edgeFade,
          transform: `rotate(${Math.atan2(y, x)}rad) scaleX(${s.edge})`,
        });
      });
    };

    const tl = gsap.timeline({ paused: true, onUpdate: render });
    tl.set(s, { trail: 1 }, 0)
      // the throw
      .fromTo(s, { p: 0 }, { p: 1, duration: 0.85, ease: 'expo.out' }, 0.2)
      // impact: the trail retracts into the spear, the point's edges run on and fade
      .to(s, { trail: 0, duration: 0.45, ease: 'power2.inOut' }, 0.62)
      .fromTo(s, { edge: 0 }, { edge: 1, duration: 0.5, ease: 'expo.out' }, 0.66)
      .fromTo(s, { edgeFade: 1 }, { edgeFade: 0, duration: 0.6, ease: 'power1.in' }, 0.95)
      // the throw carries on, and the wordmark is swept after it
      .to(s, { p: 2, duration: 0.42, ease: 'power3.in' }, 3.5)
      .fromTo(s, { sweep: 0.0001 }, { sweep: 1, duration: 0.7, ease: 'power2.inOut', immediateRender: false }, 3.62)
      .set({}, {}, 4.8);
    render();
    return tl;
  },
};
