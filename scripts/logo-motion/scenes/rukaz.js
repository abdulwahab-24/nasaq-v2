/*
 * Rukaz — ركاز, steadiness and repetition.
 * The identity's own pattern is laid down in strata, band by band from the
 * ground up, and cleared again; the symbol's four pieces then lock together and
 * both wordmarks rise from one fixed baseline, letter by letter, like layers
 * settling. At the end they sink back below that line and the pieces part.
 * Stone on the deep teal of the identity's field.
 */
window.SCENE = {
  width: 1000,
  height: 1000,
  background: '#1F3D3B',
  tint: '#CFCBBA',
  fps: 60,
  duration: 6.2,
  poster: 4,
  logoWidth: 720,

  build({ stage, logo, parts, box, origin, extras, gsap }) {
    const STONE = '#CFCBBA';
    const BANDS = 6;
    const TILE = 600;
    const bandH = 1000 / BANDS;
    logo.style.zIndex = 2;

    // the pattern, in horizontal strata (the supplied pattern tile, painted in stone)
    const bands = [];
    for (let i = 0; i < BANDS; i++) {
      const b = document.createElement('div');
      Object.assign(b.style, {
        position: 'absolute',
        left: 0,
        width: '100%',
        top: `${i * bandH}px`,
        height: `${bandH + 0.5}px`,
        background: STONE,
        opacity: 0.42,
        WebkitMask: `url("${extras.pattern}") 0 ${-i * bandH}px / ${TILE}px ${TILE}px repeat`,
        mask: `url("${extras.pattern}") 0 ${-i * bandH}px / ${TILE}px ${TILE}px repeat`,
        zIndex: 1,
      });
      stage.append(b);
      bands.push(b);
    }
    const fromSide = (i) => (i % 2 ? 1 : -1);

    // a part that rises from (and sinks below) the baseline at the foot of its own box
    const rise = (el, b) => {
      const s = { t: 1 };
      const draw = () => {
        const ty = s.t * b[3] * 1.05;
        el.style.transform = `translateY(${ty}px)`;
        el.style.clipPath = `inset(${b[1] - 2}px 0 ${origin.h - (b[1] + b[3]) + ty - 1}px 0)`;
      };
      draw();
      return { s, draw };
    };

    const pieces = ['piece-tl', 'piece-tr', 'piece-bl', 'piece-br'].map((n) => parts[n]);
    const dir = { 'piece-tl': [-1, -1], 'piece-tr': [1, -1], 'piece-bl': [-1, 1], 'piece-br': [1, 1] };
    const pieceW = box['piece-tl'][2];
    const latin = [0, 1, 2, 3, 4].map((i) => rise(parts[`latin-${i}`], box[`latin-${i}`]));
    const ar = rise(parts.ar, box.ar);
    const risers = [ar, ...latin];

    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => risers.forEach((r) => r.draw()),
    });

    // I — the pattern laid down from the ground up, then cleared from the top
    bands.forEach((b, i) => {
      const order = BANDS - 1 - i; // bottom band first
      tl.fromTo(b, { xPercent: fromSide(i) * 101 }, { xPercent: 0, duration: 0.75, ease: 'power4.out' }, 0.15 + order * 0.09);
      tl.to(b, { xPercent: -fromSide(i) * 101, duration: 0.6, ease: 'power3.in' }, 1.35 + i * 0.07);
    });

    // II — the symbol's pieces lock together
    tl.fromTo(
      pieces,
      {
        x: (i, el) => dir[el.dataset.part][0] * pieceW * 0.9,
        y: (i, el) => dir[el.dataset.part][1] * pieceW * 0.9,
        opacity: 0,
      },
      { x: 0, y: 0, opacity: 1, duration: 0.9, ease: 'power4.out', stagger: 0.05 },
      2.0,
    )
      // III — the wordmarks rise from their baseline
      .fromTo(ar.s, { t: 1 }, { t: 0, duration: 0.85, ease: 'power4.out' }, 2.35);
    latin.forEach((l, i) => tl.fromTo(l.s, { t: 1 }, { t: 0, duration: 0.75, ease: 'power4.out' }, 2.55 + i * 0.06));

    // IV — sink and part
    tl.to(ar.s, { t: 1, duration: 0.55, ease: 'power3.in' }, 4.75);
    latin.forEach((l, i) => tl.to(l.s, { t: 1, duration: 0.5, ease: 'power3.in' }, 4.8 + (4 - i) * 0.04));
    tl.to(
      pieces,
      {
        x: (i, el) => dir[el.dataset.part][0] * pieceW * 0.9,
        y: (i, el) => dir[el.dataset.part][1] * pieceW * 0.9,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.in',
        stagger: 0.04,
      },
      5.15,
    ).set({}, {}, 6.2);
    return tl;
  },
};
