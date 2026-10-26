/*
 * A project's official logo, assembled from its own parts so motion can move
 * them one by one (scripts/logo-motion/export-parts.mjs cuts them from the
 * supplied file; nothing is redrawn). Each part is laid at its own box on the
 * logo's canvas and painted through its shape (a CSS mask) in the identity's
 * colour, so at rest the parts are the supplied logo exactly.
 *
 *   parts  { dir, manifest, paint }  dir: where the part files live; manifest: the
 *          project's logo-parts.json; paint: { default, [part or part prefix]: colour }
 *   label  accessible name (the logo is one image to assistive technology)
 */
const pct = (v) => `${(v * 100).toFixed(4)}%`;

const colourOf = (paint, name) =>
  paint[name] ?? Object.entries(paint).find(([key]) => key !== 'default' && name.startsWith(key))?.[1] ?? paint.default;

export default function LogoParts({ parts: { dir, manifest, paint }, label, className = '' }) {
  const { width, height } = manifest;
  return (
    <span className={`lp ${className}`} role="img" aria-label={label} style={{ '--lp-ratio': width / height }}>
      {Object.entries(manifest.parts).map(([name, [x, y, w, h]]) => (
        <span
          key={name}
          className="lp__part"
          data-part={name}
          style={{
            left: pct(x / width),
            top: pct(y / height),
            width: pct(w / width),
            height: pct(h / height),
            backgroundColor: colourOf(paint, name),
            '--lp-src': `url(${dir}${name}.png)`,
          }}
        />
      ))}
    </span>
  );
}
