import { useLayoutEffect, useRef } from 'react';
import { gsap, LZ, MOTION_OK } from '../louiza.motion';
import Bloom from './Bloom';
import Head from './Head';
import Logo from './Logo';

/*
 * The pattern, as the presentation's pattern page sets it: the mark repeated in rows
 * on Rosy Taupe, a shade darker than its field, with the logo standing in a clearing
 * at the centre. Holding the screen, the pattern grows outward from the logo, leaf by
 * leaf, until it reaches the edges. Then two plates of the identity's other
 * pairings, grown the same way, side by side.
 *
 * The field is laid out to the screen: whole cells across, as many rows as fill it,
 * and the clearing kept in proportion with the logo.
 */
export default function Pattern({ project }) {
  const rootRef = useRef(null);
  const fieldRef = useRef(null);
  const { pattern: copy } = project.copy;
  const mark = project.sig.leaf;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const field = fieldRef.current;

    const layout = () => {
      const stage = field.parentElement;
      const { width, height } = stage.getBoundingClientRect();
      const cols = width < 768 ? 6 : 12;
      const size = width / cols;
      const rows = Math.ceil(height / size);
      // the clearing: the middle two columns (four on wide screens), three rows
      const clearW = cols === 6 ? 2 : 4;
      const [c0, r0] = [(cols - clearW) / 2, Math.floor((rows - 3) / 2)];
      stage.style.setProperty('--cols', cols);
      stage.style.setProperty('--cell', `${size}px`);
      stage.style.setProperty('--r0', r0);
      field.replaceChildren(
        ...Array.from({ length: cols * rows }, (_, i) => {
          const [c, r] = [i % cols, Math.floor(i / cols)];
          const leaf = document.createElement('span');
          leaf.className = 'lz-field__leaf';
          if (c >= c0 && c < c0 + clearW && r >= r0 && r < r0 + 3) leaf.classList.add('is-clear');
          return leaf;
        }),
      );
      return { cols, rows };
    };
    let grid = layout();

    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const stage = root.querySelector('.lz-pattern__stage');
      const build = () =>
        gsap
          .timeline({
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: '+=100%',
              pin: true,
              scrub: 1,
            },
          })
          .from(field.querySelectorAll('.lz-field__leaf:not(.is-clear)'), {
            scale: 0,
            opacity: 0,
            rotate: -20,
            ease: LZ.grow,
            duration: 0.5,
            stagger: {
              amount: 0.6,
              grid: [grid.rows, grid.cols],
              from: 'center',
            },
          })
          .to({}, { duration: 0.2 });
      let tl = build();
      // a different screen width can change the number of cells: lay out and grow again
      let lastCols = grid.cols;
      const onResize = () => {
        const cols = field.parentElement.getBoundingClientRect().width < 768 ? 6 : 12;
        if (cols === lastCols) return;
        lastCols = cols;
        tl.scrollTrigger.kill();
        tl.kill();
        grid = layout();
        tl = build();
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="lz-pattern" ref={rootRef} aria-labelledby="lz-pattern-title">
      <Head copy={copy} id="lz-pattern-title" />
      <div className="lz-pattern__stage">
        <div className="lz-field" ref={fieldRef} aria-hidden="true" style={{ '--mark': `url(${mark.src})` }} />
        <div className="lz-pattern__logo">
          <Logo />
        </div>
      </div>
      <div className="lz-pattern__plates" role="img" aria-label={`${project.name} leaf pattern in two colourways`}>
        <Bloom mark={mark} field="#73A2AC" ink="#FFF0DA" />
        <Bloom mark={mark} field="#FFF0DA" ink="#BC8F8F" />
      </div>
    </section>
  );
}
