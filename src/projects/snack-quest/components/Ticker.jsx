/*
 * Snack Quest signature (arcade) — the slogan strip, marching in steps
 * (the steps animation is CSS: snack-quest.css). The strip is the supplied
 * slogan artwork (sig.ticker).
 *
 *   Ticker         the strip itself
 *   TickerBlock    story block `ticker`: the strip as the page's last word
 *   ChapterTicker  homepage slot (home.slots.floor): the strip as the chapter's floor
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

export function TickerBlock({ project }) {
  const strip = project.sig?.ticker;
  if (!strip) return null;
  return (
    <section className="pb pb--ticker">
      <Ticker strip={strip} label={strip.alt} />
    </section>
  );
}

export function ChapterTicker({ project }) {
  const strip = project.sig?.ticker;
  if (!strip) return null;
  return <Ticker strip={strip} label={strip.alt} className="chapter__ticker" />;
}
