import Arrow from '../../components/ui/Arrow';
import NasaqMark from '../../components/ui/NasaqMark';
import { contact, hero } from '../../data/siteConfig';
import { scrollToSection } from '../../utils/scroll';

/*
 * Bilingual axis. Arabic and English both *begin* at the same vertical line —
 * Arabic reads right-to-left out of it, English left-to-right — and the NASAQ
 * symbol is the hinge on that line. Two languages, one alignment: نسق.
 */

function withAccent(text, accent) {
  const index = text.indexOf(accent);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <em className="hero__accent">{accent}</em>
      {text.slice(index + accent.length)}
    </>
  );
}

export default function Hero() {
  const viewWork = (event) => {
    event.preventDefault();
    scrollToSection('work');
  };

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__stage">
        <p className="hero__ar" lang="ar" dir="rtl">
          {hero.headlineArLines.map((line) => (
            <span className="line" key={line}>
              <span>{withAccent(line, hero.headlineArAccent)}</span>
            </span>
          ))}
        </p>

        <div className="hero__axis" aria-hidden="true">
          <span className="hero__rule" />
          <div className="hero__mark">
            <NasaqMark />
          </div>
        </div>

        <h1 className="hero__en" id="hero-title" aria-label={hero.headlineEn}>
          {hero.headlineEnLines.map((line) => (
            <span className="line" key={line} aria-hidden="true">
              <span>{line}</span>
            </span>
          ))}
        </h1>
      </div>

      <div className="hero__foot">
        <p className="hero__intro">{hero.intro}</p>
        <div className="hero__actions">
          <a className="text-link text-link--down" href="#work" onClick={viewWork}>
            {hero.primaryCta}
            <Arrow direction="down" />
          </a>
          <a
            className="text-link text-link--solid text-link--external"
            href={contact.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {hero.secondaryCta}
            <span className="visually-hidden"> on WhatsApp (opens in a new tab)</span>
            <Arrow direction="external" />
          </a>
        </div>
      </div>
    </section>
  );
}
