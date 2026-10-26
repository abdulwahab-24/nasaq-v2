# Development Resources

External references for NASAQ development. They are **references, not dependencies**:
nothing here is installed or integrated, and nothing should be without a clear purpose.

The site's own rules come first: brand and copy in [CLAUDE.md](CLAUDE.md), architecture and
conventions in [DEVELOPMENT.md](DEVELOPMENT.md).

## Resources

| Resource | What it is | Use it for |
| --- | --- | --- |
| [public-apis](https://github.com/public-apis/public-apis) | A curated directory of free public APIs | Finding a data source when a feature actually needs one |
| [React Bits](https://reactbits.dev) | Animated React components: text effects, interactions, backgrounds | Ideas for typographic and interaction motion |
| [Aceternity UI](https://ui.aceternity.com) | Animated React components, built with Tailwind CSS and Framer Motion | Layout and interaction ideas |
| [Animata](https://animata.design) | Animation and interaction snippets for React, built with Tailwind CSS | Micro-interaction ideas |

## How to use them here

The stack is React, Vite, GSAP + ScrollTrigger, Lenis and plain CSS (see DEVELOPMENT.md).
Component libraries are often built on Tailwind or Framer Motion; NASAQ uses neither.

- **Study, then rebuild.** Take the idea and rebuild it with the project's own tools: GSAP
  through `src/motion/gsap.js` (matchMedia, `MOTION_OK`, cleanup on unmount), styles in the
  component's own stylesheet, and values from `src/styles/tokens.css`. Don't paste
  Tailwind-class or Framer Motion code.
- **No new dependencies for one effect.** Adding Tailwind, Framer Motion, a component library
  or an API client needs a clear, agreed reason.
- **Brand first.** Motion must reinforce NASAQ's idea (scattered → aligned,
  separate → connected, cropped → revealed) and stay restrained. Avoid decorative,
  futuristic, gaming or SaaS-style effects: glows, beams, particles, 3D cards, gradient
  borders. Colours come only from the official palette, and official fonts only.
- **Keep the site's guarantees.** Every motion respects `prefers-reduced-motion`. First-paint
  state is set before paint (see the intro notes in DEVELOPMENT.md). No layout shift, no
  extra JS on the critical path, and keyboard and screen-reader access stay intact.
- **APIs from public-apis.** Only for a real feature need. Check the licence, auth, rate
  limits, uptime and privacy first. Never put keys in client code: the site is a static Vite
  build, so anything bundled is public. Never show third-party data as NASAQ or client fact.
- **Check licences** of any snippet you adapt, and credit it where required.

## Before adopting anything

1. What problem does it solve that the existing code cannot?
2. Can it be built with GSAP and plain CSS inside the current architecture?
3. Does it fit the brand, and does it respect reduced motion?
4. What does it cost in bundle size and runtime?
5. Do `npm run lint` and `npm run build` pass, and has it been checked in a real browser
   at mobile and desktop widths?
