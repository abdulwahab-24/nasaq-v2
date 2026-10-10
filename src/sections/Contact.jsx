import { useRef } from 'react';
import Arrow from '../components/Arrow';
import { contact, contactCopy } from '../data/site';
import useReveals from '../motion/useReveals';

/*
 * Contact — WhatsApp is the primary action and opens directly;
 * Instagram is the secondary social action. No form.
 */
export default function Contact() {
  const rootRef = useRef(null);
  useReveals(rootRef);

  return (
    <section className="contact" id="contact" ref={rootRef} aria-labelledby="contact-title">
      <p className="contact__kicker label">Contact</p>
      <h2 className="contact__title" id="contact-title" tabIndex={-1} data-reveal="lines">
        <span className="line">
          <span>Let’s build </span>
        </span>
        <span className="line">
          <span>
            what’s <em>next.</em>
          </span>
        </span>
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
