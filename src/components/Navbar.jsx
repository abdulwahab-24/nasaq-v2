import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { contact, navigation, services, site } from '../data/site';
import { useTransition } from '../transition/context';
import TransitionLink from '../transition/TransitionLink';
import Arrow from './Arrow';

function useScrollState() {
  const [state, setState] = useState({ solid: false, hidden: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < 4) return;
      setState({ solid: y > 8, hidden: delta > 0 && y > window.innerHeight * 0.5 });
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}

const pad = (n) => String(n).padStart(2, '0');

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
      window.removeEventListener('keydown', onKey);
      const active = document.activeElement;
      if (!active || active === document.body || panel?.contains(active)) toggle?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  const goHome = (event) => {
    event.preventDefault();
    close();
    if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
    else go('/');
  };

  const classes = ['nav', solid && 'nav--solid', hidden && !open && 'nav--hidden', open && 'nav--open']
    .filter(Boolean)
    .join(' ');

  return (
    <header className={classes}>
      <div className="nav__bar">
        <a className="nav__brand" href="/" onClick={goHome} aria-label="NASAQ — home">
          <img src="/brand/nasaq-lockup-white.png" alt="" width="892" height="317" />
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
          Start a project
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

      <div id="site-menu" ref={panelRef} className="menu" hidden={!open}>
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
