import { useLayoutEffect, useRef } from 'react';
import LogoParts from '../../../components/projects/LogoParts';
import Arrow from '../../../components/ui/Arrow';
import { useTransition } from '../../../transition/context';
import TransitionLink from '../../../transition/TransitionLink';
import {
  applyMask,
  COLOURS,
  gsap,
  introDone,
  lightMask,
  LOGO,
  MONO_CENTRE,
  MOTION_OK,
  NB,
  NB_ORIGIN,
  traceMask,
} from '../nurba.motion';

/*
 * Opening: from the stone to the signature. On navy the monogram alone, large, in
 * the middle of the screen: the glint flares on its upper-left facet, the two lines
 * of the octagon are traced round from it, and a band of light reveals NB.
 * Scrolling, the screen holds while the monogram steps aside to its place in the
 * stacked logo and the five letters of NURBA are set beside it, one by one, over
 * نوربا written in from the right: the logo as the identity arranges it.
 * The outer frame's box is where the page transition lands ([data-hero-target]).
 */
const MONO = ['ring-0', 'ring-1', 'nb'];
const LETTERS = ['latin-0', 'latin-1', 'latin-2', 'latin-3', 'latin-4'];
const [rx, ry, rw, rh] = LOGO.parts['ring-0'];
const box = (x, y, w, h) => ({
  left: `${(x / LOGO.width) * 100}%`,
  top: `${(y / LOGO.height) * 100}%`,
  width: `${(w / LOGO.width) * 100}%`,
  height: `${(h / LOGO.height) * 100}%`,
});
const parts = { dir: '/work/nurba/parts/', manifest: LOGO, paint: { default: COLOURS.cream } };

export default function Opening({ project }) {
  const { registerHero, whenSettled } = useTransition();
  const rootRef = useRef(null);
  const { copy } = project;

  useLayoutEffect(() => {
    registerHero(Promise.resolve());
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      const lp = q('.lp')[0];
      const part = (name) => lp.querySelector(`[data-part="${name}"]`);
      const mono = [...MONO.map(part), q('.nb-open__target')[0], q('.nb-open__glint')[0]];
      const masked = [part('ring-0'), part('ring-1'), part('nb')];
      applyMask(part('ring-0'), traceMask('var(--lp-src)'));
      applyMask(part('ring-1'), traceMask('var(--lp-src)'));
      applyMask(part('nb'), lightMask('var(--lp-src)'));

      // the monogram alone, centred and enlarged: about 44% of the screen's height, at most 27rem
      const k = () => lp.offsetHeight / LOGO.height; // screen px per canvas px
      const big = () => Math.min(innerHeight * 0.44, innerWidth * 0.62, 432) / (rh * k());
      const toCentre = () => lp.offsetWidth / 2 - MONO_CENTRE[0] * k();
      const origin = (el) => {
        const name = el.dataset.part;
        if (name === 'nb') return NB_ORIGIN;
        if (el.classList.contains('nb-open__glint'))
          return `${((MONO_CENTRE[0] - 6) / 92) * 100}% ${((MONO_CENTRE[1] - 6) / 92) * 100}%`;
        return '50% 50%';
      };
      mono.forEach((el) => gsap.set(el, { transformOrigin: origin(el) }));
      gsap.set(mono, { x: toCentre, scale: big });
      gsap.set(LETTERS.map(part), { opacity: 0, y: () => -26 * k() });
      gsap.set(part('ar'), { clipPath: 'inset(-10% -2% -10% 102%)' });
      gsap.set(masked.slice(0, 2), { '--nb-trace': '0deg' });
      gsap.set(part('nb'), { '--nb-light': '0%' });
      gsap.set(q('.nb-glint'), { opacity: 0, scale: 0 });
      gsap.set(q('.nb-open__meta > *, .nb-open__foot > *'), { opacity: 0, y: 12 });

      const glint = q('.nb-glint')[0];
      const arrive = gsap.timeline({ paused: true });
      arrive
        .to(glint, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 0)
        .to(part('ring-0'), { '--nb-trace': '360deg', duration: 1.7, ease: NB.trace }, 0.15)
        .to(part('ring-1'), { '--nb-trace': '360deg', duration: 1.7, ease: NB.trace }, 0.4)
        .to(glint, { opacity: 0, scale: 0.4, duration: 0.6, ease: 'power2.in' }, 1.5)
        .to(part('nb'), { '--nb-light': '112%', duration: 1.4, ease: NB.light }, 0.95)
        .to(q('.nb-open__meta > *'), { opacity: 1, y: 0, duration: 0.9, ease: NB.set, stagger: 0.08 }, 1.6);

      // the hold: the monogram steps aside, the letters are set, the Arabic is written
      const hold = gsap.timeline({
        defaults: { ease: NB.set },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      hold.to(mono, { x: 0, scale: 1, duration: 0.45, ease: 'power3.inOut' }, 0);
      LETTERS.forEach((name, i) => hold.to(part(name), { opacity: 1, y: 0, duration: 0.2 }, 0.32 + i * 0.06));
      hold
        .to(part('ar'), { clipPath: 'inset(-10% -2% -10% -2%)', duration: 0.3, ease: NB.trace }, 0.6)
        .to(q('.nb-open__foot > *'), { opacity: 1, y: 0, duration: 0.2, stagger: 0.04 }, 0.78)
        .to({}, { duration: 0.12 });

      let alive = true;
      Promise.all([introDone, whenSettled()]).then(() => alive && arrive.play());
      return () => {
        alive = false;
        masked.forEach((el) => {
          el.style.webkitMaskImage = '';
          el.style.maskImage = '';
        });
      };
    });
    return () => mm.revert();
  }, [registerHero, whenSettled]);

  return (
    <header className="nb-open" ref={rootRef}>
      <div className="nb-open__meta">
        <TransitionLink to="/" section="work" className="text-link nb-open__back">
          <Arrow direction="left" />
          All work
        </TransitionLink>
        <p className="nb-label">
          <span>{copy.opening.label}</span>
          <span lang="ar" dir="rtl">
            {copy.opening.labelAr}
          </span>
        </p>
      </div>

      <h1 className="nb-open__logo">
        <span className="visually-hidden">
          {project.name} — <span lang="ar">{project.nameAr}</span>
        </span>
        <LogoParts parts={parts} label={`${project.name} — ${project.nameAr}`} />
        <span className="nb-open__target" style={box(rx, ry, rw, rh)} data-hero-target aria-hidden="true" />
        <span className="nb-open__glint" style={box(6, 6, 92, 92)} aria-hidden="true">
          <span className="nb-glint" />
        </span>
      </h1>

      <div className="nb-open__foot">
        <p className="nb-open__line">{copy.lines.envelope}</p>
        <p className="nb-label">Jewellery · {project.category}</p>
      </div>
    </header>
  );
}
