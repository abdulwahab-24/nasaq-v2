import { Fragment } from 'react';
import Arrow from '../../components/ui/Arrow';
import NasaqMark from '../../components/ui/NasaqMark';
import { hero } from '../../data/siteConfig';
import { scrollToSection } from '../../utils/scroll';

/*
 * One axis, two languages. The English headline is set as large as the screen
 * allows; beneath it a horizontal axis runs across to the NASAQ symbol, and the
 * Arabic headline hangs from the symbol's side of the axis. English above and
 * to the left, Arabic below and to the right, the symbol the hinge between them:
 * two languages, one alignment (نسق).
 * The opening intro (components/layout/Intro.jsx) lands its symbol on this one.
 * A quiet column grid sits behind it all, the structure the words align to.
 */

const COLUMNS = 12;

// Each word is its own mask, so the lines wrap naturally at any width. The space sits
// between the masks: inside one, as trailing white space of an inline-block, it can collapse.
function Words({ text, accent }) {
  return text.split(' ').map((word, i, all) => (
    <Fragment key={`${i}-${word}`}>
      <span className="word">
        <span>{accent && word.replace(/[.,]/g, '') === accent ? <em className="hero__accent">{word}</em> : word}</span>
      </span>
      {i < all.length - 1 && ' '}
    </Fragment>
  ));
}

export default function Hero() {
  const viewWork = (event) => {
    event.preventDefault();
    scrollToSection('work');
  };

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__grid" aria-hidden="true">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="hero__stage">
        <h1 className="hero__en" id="hero-title" aria-label={hero.headlineEn}>
          <span aria-hidden="true">
            <Words text={hero.headlineEn} />
          </span>
        </h1>

        <div className="hero__axis" aria-hidden="true">
          <span className="hero__rule" />
          <div className="hero__mark" data-intro-target>
            <NasaqMark />
          </div>
        </div>

        <p className="hero__ar" lang="ar" dir="rtl">
          <Words text={hero.headlineAr} accent={hero.headlineArAccent} />
        </p>
      </div>

      <div className="hero__foot">
        <p className="hero__intro">{hero.intro}</p>
        {/* the one cue into the work; "Start a project" lives in the navigation */}
        <div className="hero__actions">
          <a className="text-link text-link--down" href="#work" onClick={viewWork}>
            {hero.primaryCta}
            <Arrow direction="down" />
          </a>
        </div>
      </div>
    </section>
  );
}
