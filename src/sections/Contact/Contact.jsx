import { useRef } from 'react';
import Arrow from '../../components/ui/Arrow';
import { contact, contactCopy } from '../../data/siteConfig';
import useReveals from '../../hooks/useReveals';

/*
 * Contact — WhatsApp is the primary action and opens directly;
 * Instagram is the secondary social action. No form.
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
export default function Contact() {
  const rootRef = useRef(null);
  useReveals(rootRef);

  return (
    <section className="contact" id="contact" ref={rootRef} aria-labelledby="contact-title">
      <p className="contact__kicker label">Contact</p>
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

      <a
        className="contact__wa"
        href={contact.whatsapp.url}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="Chat"
      >
        <span className="contact__wa-fill" aria-hidden="true" />
        <span className="contact__wa-label">
          {contactCopy.cta}
          <span className="visually-hidden"> on WhatsApp (opens in a new tab)</span>
        </span>
        <span className="contact__wa-meta">
          <span className="label">WhatsApp</span>
          <span className="contact__wa-num">{contact.whatsapp.label}</span>
        </span>
        <span className="contact__wa-arrow" aria-hidden="true">
          <Arrow direction="external" />
        </span>
      </a>

      <a
        className="contact__ig"
        href={contact.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="label">Instagram</span>
        <span className="contact__ig-handle">
          {contact.instagram.handle}
          <span className="visually-hidden"> (opens in a new tab)</span>
        </span>
        <Arrow direction="external" />
      </a>
    </section>
  );
}
