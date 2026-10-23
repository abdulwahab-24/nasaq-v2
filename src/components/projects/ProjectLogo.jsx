/*
 * A project's own logo file, shown untouched. Logos supplied as a mask (a flat
 * shape lifted from artwork) are painted in the project's ink colour; everything
 * else is the original image with its transparency.
 */
export default function ProjectLogo({ logo, ink, className = '', decorative = false, ...rest }) {
  if (logo.mask) {
    return (
      <span
        className={`plogo plogo--mask ${className}`}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : logo.alt}
        aria-hidden={decorative || undefined}
        style={{ '--logo': `url(${logo.src})`, '--logo-ink': ink, aspectRatio: `${logo.width} / ${logo.height}` }}
        {...rest}
      />
    );
  }
  return (
    <img
      className={`plogo ${className}`}
      src={logo.src}
      alt={decorative ? '' : logo.alt}
      width={logo.width}
      height={logo.height}
      loading="lazy"
      decoding="async"
      {...rest}
    />
  );
}
