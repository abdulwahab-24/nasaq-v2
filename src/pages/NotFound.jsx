import { useRef } from 'react';
import Arrow from '../components/Arrow';
import NasaqMark from '../components/NasaqMark';
import useReveals from '../motion/useReveals';
import TransitionLink from '../transition/TransitionLink';
import useMeta from '../utils/useMeta';

/*
 * 404 — the one place the symbol is shown out of alignment.
 */
export default function NotFound() {
  const rootRef = useRef(null);
  useMeta({ title: 'Page not found', description: 'This page does not exist. Return to NASAQ.', noindex: true });
  useReveals(rootRef);

  return (
    <section className="notfound" ref={rootRef} aria-labelledby="nf-title">
      <div className="notfound__mark">
        <NasaqMark className="mark--broken" />
      </div>
      <p className="notfound__code label">Error 404</p>
      <h1 className="notfound__title" id="nf-title" data-reveal="lines">
        <span className="line">
          <span>Out of </span>
        </span>
        <span className="line">
          <span>alignment.</span>
        </span>
      </h1>
      <p className="notfound__ar" lang="ar" dir="rtl">
        هذه الصفحة غير موجودة.
      </p>
      <p className="notfound__body">The page you are looking for doesn’t exist or has moved.</p>
      <div className="notfound__actions">
        <TransitionLink to="/" className="text-link text-link--solid">
          Back to home
          <Arrow />
        </TransitionLink>
        <TransitionLink to="/" section="work" className="text-link">
          View our work
          <Arrow />
        </TransitionLink>
      </div>
    </section>
  );
}
