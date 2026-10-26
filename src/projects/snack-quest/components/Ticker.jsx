/*
 * Snack Quest signature (arcade): the slogan strip, marching in steps (the steps
 * animation is CSS: snack-quest.css). The strip is the supplied slogan artwork
 * (sig.ticker); the page ends on it (Finale.jsx).
 */
export function Ticker({ strip, label, className = '' }) {
  return (
    <div
      className={`ticker ${className}`}
      role="img"
      aria-label={label}
      style={{ '--ticker-img': `url(${strip.src})`, '--ticker-ratio': strip.width / strip.height }}
    >
      <span className="ticker__run" />
    </div>
  );
}
