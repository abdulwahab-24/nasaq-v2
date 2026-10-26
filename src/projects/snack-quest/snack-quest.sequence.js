/*
 * Snack Quest in the Selected Work sequence: the arcade.
 * Nothing moves smoothly. Its field arrives as a pixel dissolve, the plate is
 * wiped on in pixel steps, the letters are typed in one at a time with a
 * one-pixel drop each, and while it holds the whole logo does one hop, like a
 * picked-up coin. Leaving, it is erased the same way it was typed.
 * Every step is on the logo's own pixel unit (its letters sit on a ~15.7 px grid
 * in the 1095 px file).
 * Timeline API: sections/SelectedWork/sequence.js.
 */
const UNIT = 15.7;
const LETTERS = ['a', 'b'].flatMap((row) => [0, 1, 2, 3, 4].map((i) => `letter-${row}-${i}`));

// a fixed, scattered order for the field's pixels (same on every visit)
const order = (i) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;

export default {
  // the field is a canvas of square pixels, so it can arrive pixel by pixel
  setup({ field }) {
    const colour = getComputedStyle(field).backgroundColor;
    field.style.background = 'none';
    const canvas = document.createElement('canvas');
    canvas.className = 'seq__pixels';
    field.append(canvas);
    const ctx = canvas.getContext('2d');
    const state = { p: 0 };
    let grid = { cols: 0, rows: 0, size: 0 };

    const draw = () => {
      const { cols, rows, size } = grid;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = colour;
      for (let i = 0; i < cols * rows; i++) {
        if (order(i) >= state.p) continue;
        ctx.fillRect((i % cols) * size, Math.floor(i / cols) * size, Math.ceil(size), Math.ceil(size));
      }
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = field.offsetWidth;
      const h = field.offsetHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const cols = w > h ? 16 : 8;
      const size = canvas.width / cols;
      grid = { cols, rows: Math.ceil(canvas.height / size), size };
      draw();
    };
    resize();
    window.addEventListener('resize', resize);
    return {
      state,
      draw,
      cleanup: () => {
        window.removeEventListener('resize', resize);
        canvas.remove();
        field.style.background = '';
      },
    };
  },

  reveal({ tl, setup }, at) {
    tl.fromTo(
      setup.state,
      { p: 0 },
      { p: 1.001, duration: 0.8, ease: 'steps(14)', onUpdate: setup.draw },
      at,
    );
  },

  enter({ tl, part, u }, at) {
    tl.fromTo(
      part('plate'),
      { clipPath: 'inset(0% 100% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.35, ease: 'steps(9)' },
      at,
    );
    LETTERS.forEach((name, i) => {
      tl.fromTo(
        part(name),
        { autoAlpha: 0, y: () => -u(UNIT) },
        { autoAlpha: 1, y: 0, duration: 0.06, ease: 'steps(1)' },
        at + 0.36 + i * 0.055,
      );
    });
  },

  hold({ tl, logo, u }, at, duration) {
    tl.to(logo, { y: () => -u(UNIT * 2), duration: duration * 0.12, ease: 'steps(2)' }, at + duration * 0.35).to(
      logo,
      { y: 0, duration: duration * 0.12, ease: 'steps(2)' },
      at + duration * 0.47,
    );
  },

  leave({ tl, part }, at) {
    [...LETTERS].reverse().forEach((name, i) => {
      tl.to(part(name), { autoAlpha: 0, duration: 0.04, ease: 'steps(1)' }, at + i * 0.035);
    });
    tl.to(part('plate'), { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.3, ease: 'steps(9)' }, at + 0.35);
  },
};
