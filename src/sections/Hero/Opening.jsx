import { useRef } from 'react';
import LoopVideo from '../../components/ui/LoopVideo';
import { CornerMarks } from '../../components/ui/NasaqMark';
import { reel, sectionTitles } from '../../data/siteConfig';
import { pad } from '../../utils/format';
import Hero from './Hero';
import useOpeningMotion from './useOpeningMotion';

/*
 * Hero + the opening of the work. On desktop the two share one pinned stage:
 * the symbol's pieces separate and the space between them opens into a reel
 * of real NASAQ projects; the pieces come to rest as the frame's corners.
 * Without that mode (mobile, reduced motion, no JS) they simply stack.
 * Motion: ./useOpeningMotion.js
 */
export default function Opening({ count }) {
  const rootRef = useRef(null);
  useOpeningMotion(rootRef);

  return (
    <div className="opening" ref={rootRef}>
      <Hero />

      <div className="opening__work" id="work">
        <figure className="frame">
          <div className="frame__media">
            <LoopVideo className="frame__video" sources={reel.sources} poster={reel.poster} label={reel.label} />
          </div>
          <CornerMarks className="frame__marks" />
        </figure>

        <div className="frame__caption">
          <h2 className="frame__title" id="work-title" tabIndex={-1}>
            <span className="line">
              <span>{sectionTitles.work.en}</span>
            </span>
          </h2>
          <p className="frame__ar" lang="ar" dir="rtl">
            <span className="line">
              <span>{sectionTitles.work.ar}</span>
            </span>
          </p>
          <p className="frame__count label">
            <span className="line">
              <span>({pad(count)}) Projects</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
