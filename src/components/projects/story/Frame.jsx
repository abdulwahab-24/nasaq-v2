import ResponsiveImage from '../../ui/ResponsiveImage';

// One image in a story block; `reveal` picks its useReveals entrance.
export function Frame({ media, sizes, reveal = 'clip', className = '', parallax, style }) {
  return (
    <figure className={`pfig ${className}`} data-parallax={parallax} style={style}>
      <span className="pfig__frame" data-reveal={reveal}>
        <ResponsiveImage media={media} sizes={sizes} />
      </span>
    </figure>
  );
}

// Bilingual block label.
export function BlockLabel({ label, labelAr }) {
  if (!label) return null;
  return (
    <p className="plabel label">
      <span>{label}</span>
      {labelAr && (
        <span className="plabel__ar" lang="ar" dir="rtl">
          {labelAr}
        </span>
      )}
    </p>
  );
}
