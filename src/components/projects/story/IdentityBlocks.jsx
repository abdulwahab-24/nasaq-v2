import ProjectLogo from '../ProjectLogo';
import { fieldStyle, nativeMax } from './fields';
import { BlockLabel, Frame } from './Frame';

/* Story blocks that present the identity system itself: type, logo, palette, words. */

export function TypeBlock({ block, project }) {
  return (
    <section className="pb pb--type" style={fieldStyle(block.tone, project)}>
      <p className="ptype__family" aria-hidden="true">
        {block.family}
      </p>
      <div className="ptype__meta">
        <BlockLabel label="Typography" labelAr="الخطوط" />
        <p className="ptype__name">{block.family}</p>
      </div>
      <Frame
        media={block.media}
        className="ptype__specimen"
        sizes="(min-width: 1024px) 70vw, 100vw"
        style={nativeMax(block.media)}
      />
    </section>
  );
}

export function LogoBlock({ block, project }) {
  const light = block.variant === 'light';
  const logo = light ? project.logoDark : project.logo;
  if (!logo) return null;
  const tall = logo.height > logo.width;
  return (
    <section
      className={`pb pb--logo pb--logo-${light ? 'light' : 'dark'}${tall ? ' pb--logo-tall' : ''}`}
      style={light ? undefined : { '--field': block.tone ?? project.theme.surface }}
    >
      <ProjectLogo logo={logo} ink={project.theme.ink} data-reveal="up" style={{ maxWidth: `${logo.width}px` }} />
    </section>
  );
}

export function Palette({ project }) {
  const { colours = [], typefaces = [] } = project.identity ?? {};
  if (!colours.length) return null;
  return (
    <section className="pb pb--palette" aria-label={`${project.name} colour palette`}>
      <div className="pspec">
        <BlockLabel label="Colour" labelAr="الألوان" />
        {typefaces.length > 0 && (
          <div className="pspec__type">
            <p className="label">Typography</p>
            <ul>
              {typefaces.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ul className="swatches" style={{ '--count': colours.length }}>
        {colours.map((c, i) => (
          <li key={c.hex} className="swatch" style={{ '--chip': c.hex, '--i': i }} data-reveal="up">
            <span className="swatch__chip" />
            <span className="swatch__text">
              {c.name && <span className="swatch__name">{c.name}</span>}
              <span className="swatch__hex">{c.hex}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Words({ block, project }) {
  // With the project's flag element, each word is set on a flag — as in its guidelines.
  const flag = project.sig?.flag;
  return (
    <section className="pb pb--words" aria-label={block.label}>
      <BlockLabel label={block.label} labelAr={block.labelAr} />
      <ul
        className={`pwords${flag ? ' pwords--flags' : ''}`}
        lang="ar"
        dir="rtl"
        data-reveal="lines"
        style={flag ? { '--flag': `url(${flag.src})`, '--flag-ratio': `${flag.width} / ${flag.height}` } : undefined}
      >
        {block.words.map((w) => (
          <li key={w} className="line">
            <span>{w}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
