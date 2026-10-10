import { useRef } from 'react';
import LoopVideo from '../components/LoopVideo';
import { CornerMarks } from '../components/NasaqMark';
import useOpeningMotion from '../motion/useOpeningMotion';
import Hero from './Hero';

const pad = (n) => String(n).padStart(2, '0');

const REEL = [
  { src: '/video/reel.webm', type: 'video/webm' },
  { src: '/video/reel.mp4', type: 'video/mp4' },
];

/*
 * Hero + the opening of the work. On desktop the two share one pinned stage:
 * the symbol's pieces separate and the space between them opens into a reel
 * of real NASAQ projects; the pieces come to rest as the frame's corners.
 * Without that mode (mobile, reduced motion, no JS) they simply stack.
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
            <LoopVideo
              className="frame__video"
              sources={REEL}
              poster="/video/reel-poster.webp"
              label="Reel of NASAQ identity work: Rumh, Louiza, Rukaz and Snack Quest"
            />
          </div>
          <CornerMarks className="frame__marks" />
        </figure>

        <div className="frame__caption">
          <h2 className="frame__title" id="work-title" tabIndex={-1}>
            <span className="line">
              <span>Selected Work</span>
            </span>
          </h2>
          <p className="frame__ar" lang="ar" dir="rtl">
            <span className="line">
              <span>أعمال مختارة</span>
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
