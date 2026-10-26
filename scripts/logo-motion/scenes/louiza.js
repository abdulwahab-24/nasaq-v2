/*
 * Louiza — لويزا, a bloom.
 * The tall leaf grows up out of its base, the small leaf unfolds from the stem,
 * then the Arabic wordmark is written in from right to left, the way it reads.
 * At the end the leaves withdraw into the stem and the wordmark runs on out of
 * view in the same direction. White on Rosy Taupe, as the logo sits on the bag.
 */
window.SCENE = {
  width: 1000,
  height: 1000,
  background: '#BC8F8F',
  fps: 60,
  duration: 6,
  poster: 3.6,
  logoWidth: 300,

  build({ parts, box, gsap }) {
    const { leafBig, leafSmall, word } = parts;
    const big = box.leafBig;
    const small = box.leafSmall;
    // where each leaf meets the stem (part px)
    leafBig.style.transformOrigin = `${big[0] + big[2] * 0.5}px ${big[1] + big[3]}px`;
    leafSmall.style.transformOrigin = `${small[0]}px ${small[1] + small[3]}px`;
    const leafFoot = big[1] + big[3];
    const FEATHER = big[3] * 0.22;

    // grow: 0 = hidden in the stem → 1 = whole; wither: the same, from the top down
    const s = { grow: 0, wither: 0, write: 0, erase: 0 };
    const render = () => {
      const top = (leafFoot + FEATHER) * (1 - s.grow + s.wither);
      // a soft growing edge rather than a crop line
      const g = `linear-gradient(to bottom, transparent ${top - FEATHER}px, #000 ${top}px)`;
      leafBig.style.webkitMaskImage = g;
      leafBig.style.maskImage = g;
      // the wordmark: revealed from the right edge leftwards, then hidden the same way
      word.style.clipPath = `inset(0 ${s.erase * 100}% 0 ${(1 - s.write) * 100}%)`;
    };

    const tl = gsap.timeline({ paused: true, onUpdate: render });
    tl.fromTo(s, { grow: 0 }, { grow: 1, duration: 1.5, ease: 'power3.inOut' }, 0.25)
      .fromTo(leafBig, { rotate: -10, scale: 0.55 }, { rotate: 0, scale: 1, duration: 1.9, ease: 'expo.out' }, 0.25)
      .fromTo(
        leafSmall,
        { rotate: -68, scale: 0.45 },
        { rotate: 0, scale: 1, duration: 1.4, ease: 'expo.out' },
        1.05,
      )
      .fromTo(leafSmall, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, 1.05)
      .fromTo(s, { write: 0 }, { write: 1, duration: 1.3, ease: 'power2.inOut' }, 1.75)
      // close
      .to(s, { erase: 1, duration: 0.9, ease: 'power2.inOut' }, 4.55)
      .to(leafSmall, { rotate: -68, scale: 0.45, duration: 0.75, ease: 'power2.in' }, 4.7)
      .to(leafSmall, { opacity: 0, duration: 0.2, ease: 'none' }, 5.3)
      .to(s, { wither: 1, duration: 0.9, ease: 'power2.inOut' }, 4.85)
      .to(leafBig, { rotate: -8, scale: 0.6, duration: 0.9, ease: 'power2.in' }, 4.85)
      .set({}, {}, 6);
    render();
    return tl;
  },
};
