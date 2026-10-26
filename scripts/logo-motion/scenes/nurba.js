/*
 * NURBA — نوربا, a jeweller's signature.
 * The same four moves as the site (src/projects/nurba/nurba.motion.js): a glint
 * flares at the corner of the stone; the two lines of the octagon are traced round
 * from that corner; a band of light crosses the NB and leaves it lit; the five
 * letters are set into place from above and the Arabic is written in from the
 * right. One glint at rest. Then everything is taken back in reverse — the letters
 * lifted, the Arabic drawn back, the light withdrawn, the lines un-traced — to the
 * empty navy field. Cream on the identity's navy.
 */
window.SCENE = {
  width: 1600,
  height: 900,
  background: '#1F354D',
  tint: '#F2ECE4',
  fps: 60,
  duration: 5.8,
  poster: 3.4,
  logoWidth: 1100,

  build({ logo, parts, box, extras, gsap }) {
    const GOLD = '#E6B964';
    const ring = box['ring-0'];
    const cx = ring[0] + ring[2] / 2;
    const cy = ring[1] + ring[3] / 2;
    const u = ring[2] / 708; // one unit of the monogram's own drawing

    // the part's own mask, intersected with a second one the scene animates
    const masked = (el, second) => {
      const own = el.style.getPropertyValue('--src');
      const m = `${own} center / 100% 100% no-repeat, ${second}`;
      el.style.webkitMask = m;
      el.style.mask = m;
      el.style.webkitMaskComposite = 'source-in';
      el.style.maskComposite = 'intersect';
    };

    // trace: a conic sweep from the top-left corner (-45deg) round the stone
    const traces = ['ring-0', 'ring-1'].map((name) => {
      const s = { a: 0 };
      const draw = () =>
        masked(
          parts[name],
          `conic-gradient(from -45deg at ${cx}px ${cy}px, #000 ${s.a}deg, transparent ${s.a + 0.01}deg)`,
        );
      return { s, draw };
    });

    // light: a soft band at 105deg crossing the NB
    const light = { p: 0 };
    const drawLight = () =>
      masked(
        parts.nb,
        `linear-gradient(105deg, #000 calc(${light.p}% - 18%), transparent ${light.p}%) 0 0 / 100% 100% no-repeat`,
      );

    // the Arabic, written in from the right of its own box
    const ar = { t: 1 };
    const arBox = box.ar;
    const drawAr = () => {
      const left = arBox[0] + arBox[2] * ar.t;
      parts.ar.style.clipPath = `inset(0 0 0 ${left}px)`;
    };

    // the glint: the pattern's four-point star, in gold, at the corner the trace starts from
    const glint = document.createElement('div');
    const g = 92 * u;
    Object.assign(glint.style, {
      position: 'absolute',
      left: `${ring[0] + 52 * u - g / 2}px`,
      top: `${ring[1] + 52 * u - g / 2}px`,
      width: `${g}px`,
      height: `${g}px`,
      background: GOLD,
      WebkitMask: `url("${extras.glint}") center / contain no-repeat`,
      mask: `url("${extras.glint}") center / contain no-repeat`,
      zIndex: 2,
    });
    logo.append(glint);
    gsap.set(glint, { scale: 0, rotation: -45, transformOrigin: '50% 50%' });

    const letters = [0, 1, 2, 3, 4].map((i) => parts[`latin-${i}`]);
    gsap.set(letters, { y: -26 * u, opacity: 0 });

    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        traces.forEach((t) => t.draw());
        drawLight();
        drawAr();
      },
    });

    const flare = (at, peak = 1) =>
      tl
        .to(glint, { scale: peak, rotation: 0, duration: 0.45, ease: 'expo.out' }, at)
        .to(glint, { scale: 0, rotation: 45, duration: 0.55, ease: 'sine.inOut' }, at + 0.45)
        .set(glint, { rotation: -45 }, at + 1.0);

    // I — the glint, then the two lines traced from its corner
    flare(0.15);
    tl.to(traces[0].s, { a: 360, duration: 1.3, ease: 'power2.inOut' }, 0.35).to(
      traces[1].s,
      { a: 360, duration: 1.2, ease: 'power2.inOut' },
      0.5,
    );

    // II — light across the NB
    tl.to(light, { p: 118, duration: 0.95, ease: 'sine.inOut' }, 1.25);

    // III — set: the letters from above, the Arabic from the right
    tl.to(letters, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.07 }, 1.85).to(
      ar,
      { t: 0, duration: 1.0, ease: 'power2.inOut' },
      2.15,
    );

    // IV — at rest, one glint
    flare(3.05, 0.8);

    // V — taken back in reverse
    tl.to(ar, { t: 1, duration: 0.6, ease: 'power2.in' }, 4.05)
      .to(
        letters,
        { y: -26 * u, opacity: 0, duration: 0.5, ease: 'power3.in', stagger: { each: 0.05, from: 'end' } },
        4.1,
      )
      .to(light, { p: 0, duration: 0.6, ease: 'sine.inOut' }, 4.4)
      .to(traces[1].s, { a: 0, duration: 0.75, ease: 'power2.inOut' }, 4.6)
      .to(traces[0].s, { a: 0, duration: 0.8, ease: 'power2.inOut' }, 4.7)
      .set({}, {}, 5.8);
    return tl;
  },
};
