/*
 * Snack Quest — the arcade.
 * Nothing moves smoothly: the plate materialises pixel by pixel, the letters are
 * typed in one at a time with a one-pixel jump each, the whole logo does one hop
 * like a picked-up coin, and it dissolves out pixel by pixel. Every step is on
 * the logo's own pixel unit. On the identity's purple.
 */
window.SCENE = {
  width: 1280,
  height: 720,
  background: '#4D3468',
  fps: 60,
  duration: 4.6,
  poster: 2.8,
  logoWidth: 760,

  build({ stage, logo, parts, origin, gsap }) {
    const PURPLE = '#4D3468';
    // the logo's pixel unit: its letters are drawn on a ~15.7 px grid in the 1095 px file
    const unit = (760 / 1095) * 15.7;
    // SNACK, then QUEST, left to right
    const letters = ['a', 'b'].flatMap((row) => [0, 1, 2, 3, 4].map((i) => parts[`letter-${row}-${i}`]));
    parts.plate.style.zIndex = 1;
    letters.forEach((l) => (l.style.zIndex = 2));

    // pixel cover over the logo, cells switched on and off in a fixed random order
    // cells of two logo pixels, on whole device pixels so the cover has no seams
    const cell = Math.round(unit * 2);
    const pad = cell;
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil((origin.w + pad * 2) / cell) * cell;
    canvas.height = Math.ceil((origin.h + pad * 2) / cell) * cell;
    Object.assign(canvas.style, {
      position: 'absolute',
      left: `${Math.round(origin.x - pad)}px`,
      top: `${Math.round(origin.y - pad)}px`,
      zIndex: 3,
    });
    stage.append(canvas);
    const ctx = canvas.getContext('2d');
    const cols = canvas.width / cell;
    const rows = canvas.height / cell;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const order = Array.from({ length: cols * rows }, () => rnd());

    const s = { cover: 1 };
    const STEPS = 10;
    const draw = () => {
      const c = Math.round(s.cover * STEPS) / STEPS; // the cover advances in steps
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = PURPLE;
      order.forEach((r, i) => {
        if (r < c) ctx.fillRect((i % cols) * cell, Math.floor(i / cols) * cell, cell, cell);
      });
    };

    const tl = gsap.timeline({ paused: true, onUpdate: draw });
    tl.set(letters, { opacity: 0, y: 0 }, 0)
      .set(logo, { y: 0 }, 0)
      .fromTo(s, { cover: 1 }, { cover: 0, duration: 0.5, ease: 'none' }, 0.15);

    // typed: each letter appears one pixel high, then drops onto its line
    letters.forEach((l, i) => {
      const at = (i < 5 ? 0.72 : 1.18) + (i % 5) * 0.085;
      tl.set(l, { opacity: 1, y: -unit }, at).set(l, { y: 0 }, at + 0.05);
    });

    // one hop
    tl.set(logo, { y: -unit * 2 }, 1.85)
      .set(logo, { y: -unit * 3 }, 1.92)
      .set(logo, { y: -unit }, 2.0)
      .set(logo, { y: 0 }, 2.06)
      // out
      .fromTo(s, { cover: 0 }, { cover: 1, duration: 0.45, ease: 'none', immediateRender: false }, 3.7)
      .set({}, {}, 4.6);
    draw();
    return tl;
  },
};
