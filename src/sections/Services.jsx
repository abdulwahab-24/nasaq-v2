import { useRef } from 'react';
import { services } from '../data/site';
import useReveals from '../motion/useReveals';

/*
 * Services as a typographic index on Primary Blue — no icons, no cards.
 * Each discipline is set at display size with its Arabic counterpart aligned
 * to the opposite edge; the NASAQ slash pattern sets the rhythm between them.
 */
export default function Services() {
  const rootRef = useRef(null);
  useReveals(rootRef);

  return (
    <section className="services" id="services" ref={rootRef} aria-labelledby="services-title">
      <header className="services__head">
        <h2 className="services__title label" id="services-title" tabIndex={-1}>
          Services
        </h2>
        <p className="services__title-ar label" lang="ar" dir="rtl">
          الخدمات
        </p>
      </header>

      <ol className="services__list">
        {services.map((s, i) => (
          <li className="service" key={s.en} data-reveal="lines">
            <span className="service__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="line service__en">
              <span>{s.en}</span>
            </span>
            <span className="line service__ar" lang="ar" dir="rtl">
              <span>{s.ar}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="services__pattern" aria-hidden="true" />
    </section>
  );
}
