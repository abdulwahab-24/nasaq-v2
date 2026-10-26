import { useLayoutEffect, useRef } from 'react';
import Arrow from '../../components/ui/Arrow';
import { brandAssets, contact, contactCopy } from '../../data/siteConfig';
import useReveals from '../../hooks/useReveals';
import { FINE_POINTER, gsap, MOTION_OK } from '../../motion/gsap';

/*
 * Contact — the last chapter of the site, on a field of NASAQ blue. The field
 * opens from a framed crop to the full screen as it arrives (cropped → revealed).
 * On it: the headline, one line of invitation, and two rows that are the
 * actions themselves: WhatsApp (primary, opens directly) set at display size
 * across the whole width, Instagram beneath it. No form, no card. The official
 * NASAQ lockup rises at its foot, and only the legal line (Footer) follows.
 * On fine pointers each row's arrow leans toward the pointer.
 */

function withAccent(line, accent) {
  const index = line.indexOf(accent);
  if (index === -1) return line;
  return (
    <>
      {line.slice(0, index)}
      <em>{accent}</em>
      {line.slice(index + accent.length)}
    </>
  );
}

// The arrow is drawn toward the pointer by a fraction of the distance, within a small radius.
function magnetic(row) {
  const arrow = row.querySelector('.contact__arrow svg');
  const x = gsap.quickTo(arrow, 'x', { duration: 0.6, ease: 'power3' });
  const y = gsap.quickTo(arrow, 'y', { duration: 0.6, ease: 'power3' });
  const reach = row.classList.contains('contact__row--primary') ? 22 : 12;
  const clamp = gsap.utils.clamp(-reach, reach);
  const onMove = (e) => {
    const r = arrow.getBoundingClientRect();
    x(clamp((e.clientX - (r.left + r.width / 2)) * 0.18));
    y(clamp((e.clientY - (r.top + r.height / 2)) * 0.35));
  };
  const onLeave = () => {
    x(0);
    y(0);
  };
  row.addEventListener('pointermove', onMove);
  row.addEventListener('pointerleave', onLeave);
  return () => {
    row.removeEventListener('pointermove', onMove);
    row.removeEventListener('pointerleave', onLeave);
  };
}

export default function Contact() {
  const rootRef = useRef(null);
  useReveals(rootRef);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(rootRef);
    mm.add(MOTION_OK, () => {
      const root = rootRef.current;
      gsap.fromTo(
        root.querySelector('.contact__panel'),
        { clipPath: 'inset(8% 6% 0% 6%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power2.out',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'top 20%', scrub: 0.6 },
        },
      );
      gsap.from(root.querySelector('.contact__lockup'), {
        yPercent: 105,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.querySelector('.contact__brand'), start: 'top 95%', once: true },
      });
    });
    mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
      const stops = [...rootRef.current.querySelectorAll('.contact__row')].map(magnetic);
      return () => stops.forEach((stop) => stop());
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="contact" id="contact" ref={rootRef} aria-labelledby="contact-title">
      <div className="contact__panel">
        <div className="contact__inner">
          <h2 className="contact__title" id="contact-title" tabIndex={-1} data-reveal="lines">
            {contactCopy.headlineLines.map((line, i, lines) => (
              <span className="line" key={line}>
                <span>
                  {withAccent(line, contactCopy.headlineAccent)}
                  {i < lines.length - 1 && ' '}
                </span>
              </span>
            ))}
          </h2>

          <div className="contact__body" data-reveal="up">
            {contactCopy.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="contact__actions">
            <a
              className="contact__row contact__row--primary"
              href={contact.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="WhatsApp"
              data-cursor-tone="navy"
            >
              <span className="contact__fill" aria-hidden="true" />
              <span className="contact__cta">
                {contactCopy.cta}
                <span className="visually-hidden"> on WhatsApp (opens in a new tab)</span>
              </span>
              <span className="contact__via">
                <span className="label">WhatsApp</span>
                <span>{contact.whatsapp.label}</span>
              </span>
              <span className="contact__arrow" aria-hidden="true">
                <Arrow direction="external" />
              </span>
            </a>

            <a className="contact__row" href={contact.instagram.url} target="_blank" rel="noopener noreferrer">
              <span className="contact__fill" aria-hidden="true" />
              <span className="contact__via">
                <span className="label">Instagram</span>
                <span className="contact__handle">
                  {contact.instagram.handle}
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </span>
              </span>
              <span className="contact__arrow" aria-hidden="true">
                <Arrow direction="external" />
              </span>
            </a>
          </div>

          <div className="contact__brand">
            <img
              className="contact__lockup"
              src={brandAssets.lockup.src}
              width={brandAssets.lockup.width}
              height={brandAssets.lockup.height}
              alt="NASAQ"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
