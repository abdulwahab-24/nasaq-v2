import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { brandAssets, contact, contactCopy, navigation, services } from '../../data/siteConfig';
import { getProject } from '../../projects';
import useActiveSection from '../../hooks/useActiveSection';
import useScrollState from '../../hooks/useScrollState';
import { lockScroll, scrollToY } from '../../motion/lenis';
import { useTransition } from '../../transition/context';
import TransitionLink from '../../transition/TransitionLink';
import Arrow from '../ui/Arrow';

// What each navigation entry spans on the homepage (Work = the chapters and the index).
const SECTION_RANGES = {
  work: ['.work', '.index'],
  services: ['#services'],
  studio: ['#studio'],
  contact: ['#contact'],
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { solid, hidden } = useScrollState();
  const { go } = useTransition();
  const { pathname } = useLocation();
  const toggleRef = useRef(null);
  const panelRef = useRef(null);
  const linksRef = useRef(null);
  const current = useActiveSection(SECTION_RANGES, pathname === '/');

  // The marker travels under the current section's link: the navigation aligns with the page.
  useLayoutEffect(() => {
    const links = linksRef.current;
    if (!links) return undefined;
    const place = () => {
      const link = current && links.querySelector(`[data-section="${current}"]`);
      links.classList.toggle('has-current', Boolean(link));
      if (!link) return;
      links.style.setProperty('--marker-x', `${link.offsetLeft}px`);
      links.style.setProperty('--marker-w', String(link.offsetWidth)); // a scale of the 1px marker
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [current]);

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

  // A section link in the open menu: close first, and scroll once the page is
  // unlocked again (unlocking resets the smooth scroll, which would cancel it).
  const goToSection = (section) => (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    close();
    requestAnimationFrame(() => requestAnimationFrame(() => go('/', { section })));
  };

  const goHome = (event) => {
    event.preventDefault();
    close();
    if (pathname === '/') scrollToY(0);
    else go('/');
  };

  // over a light project page, the bar's own (transparent) state is set in black
  const onLight = getProject(pathname.match(/^\/work\/([^/]+)/)?.[1])?.theme.mode === 'light';

  const classes = ['nav', solid && 'nav--solid', onLight && !solid && !open && 'nav--ink', hidden && !open && 'nav--hidden', open && 'nav--open']
    .filter(Boolean)
    .join(' ');

  return (
    <header className={classes}>
      {/* how far through the page the reader is (CSS scroll timeline, where supported) */}
      <span className="nav__progress" aria-hidden="true" />
      <div className="nav__bar">
        <a className="nav__brand" href="/" onClick={goHome} aria-label="NASAQ — home">
          <img src={brandAssets.lockup.src} alt="" width={brandAssets.lockup.width} height={brandAssets.lockup.height} />
        </a>

        <nav className="nav__links" aria-label="Primary" ref={linksRef}>
          <ul>
            {navigation.map((item) => (
              <li key={item.to}>
                <TransitionLink
                  className="nav__link"
                  to="/"
                  section={item.to}
                  data-section={item.to}
                  aria-current={current === item.to ? 'true' : undefined}
                >
                  {/* the label rolls up and its twin rolls in from below when pointed at */}
                  <span className="nav__roll">
                    <span>{item.label}</span>
                    <span aria-hidden="true">{item.label}</span>
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
          <span className="nav__marker" aria-hidden="true" />
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
                <TransitionLink
                  className="menu__link"
                  to="/"
                  section={item.to}
                  onClick={goToSection(item.to)}
                  aria-current={current === item.to ? 'true' : undefined}
                >
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
        </div>
      </div>
    </header>
  );
}
