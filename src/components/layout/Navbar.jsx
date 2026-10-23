import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { brandAssets, contact, contactCopy, navigation, services, site } from '../../data/siteConfig';
import useScrollState from '../../hooks/useScrollState';
import { lockScroll, scrollToY } from '../../motion/lenis';
import { useTransition } from '../../transition/context';
import TransitionLink from '../../transition/TransitionLink';
import { pad } from '../../utils/format';
import Arrow from '../ui/Arrow';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { solid, hidden } = useScrollState();
  const { go } = useTransition();
  const { pathname } = useLocation();
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  // Close the menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return undefined;
    const toggle = toggleRef.current;
    const panel = panelRef.current;
    document.body.classList.add('is-locked');
    lockScroll(true);
    panel?.querySelector('a')?.focus();

    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
      // Keep Tab inside the open menu (toggle + panel)
      if (event.key === 'Tab' && panel) {
        const items = [toggle, ...panel.querySelectorAll('a')];
        const i = items.indexOf(document.activeElement);
        if (event.shiftKey && i <= 0) {
          event.preventDefault();
          items.at(-1).focus();
        } else if (!event.shiftKey && i === items.length - 1) {
          event.preventDefault();
          items[0].focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.classList.remove('is-locked');
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
      const active = document.activeElement;
      if (!active || active === document.body || panel?.contains(active)) toggle?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  const goHome = (event) => {
    event.preventDefault();
    close();
    if (pathname === '/') scrollToY(0);
    else go('/');
  };

  const classes = ['nav', solid && 'nav--solid', hidden && !open && 'nav--hidden', open && 'nav--open']
    .filter(Boolean)
    .join(' ');

  return (
    <header className={classes}>
      <div className="nav__bar">
        <a className="nav__brand" href="/" onClick={goHome} aria-label="NASAQ — home">
          <img src={brandAssets.lockup.src} alt="" width={brandAssets.lockup.width} height={brandAssets.lockup.height} />
        </a>

        <nav className="nav__links" aria-label="Primary">
          <ul>
            {navigation.map((item, i) => (
              <li key={item.to}>
                <TransitionLink className="nav__link" to="/" section={item.to}>
                  <span className="nav__num" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <a
          className="nav__cta"
          href={contact.whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {contactCopy.cta}
          <span className="visually-hidden"> on WhatsApp (opens in a new tab)</span>
          <Arrow direction="external" />
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__toggle-label">{open ? 'Close' : 'Menu'}</span>
          <span className="nav__toggle-icon" aria-hidden="true" />
        </button>
      </div>

      <div id="site-menu" ref={panelRef} className="menu" hidden={!open} data-lenis-prevent>
        <nav aria-label="Mobile">
          <ul className="menu__list">
            {navigation.map((item, i) => (
              <li key={item.to} style={{ '--i': i }}>
                <TransitionLink className="menu__link" to="/" section={item.to} onClick={close}>
                  <span className="menu__num" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu__foot">
          <a
            className="menu__wa"
            href={contact.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="label">WhatsApp</span>
            <span>
              {contact.whatsapp.label}
              <span className="visually-hidden"> (opens in a new tab)</span>
            </span>
          </a>
          <a
            className="menu__ig"
            href={contact.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="label">Instagram</span>
            <span>
              {contact.instagram.handle}
              <span className="visually-hidden"> (opens in a new tab)</span>
            </span>
          </a>
          <p className="menu__services label">{services.map((s) => s.en).join(' · ')}</p>
          <p className="menu__place" lang="ar" dir="rtl">
            {site.nameAr} — {site.locationAr}
          </p>
        </div>
      </div>
    </header>
  );
}
