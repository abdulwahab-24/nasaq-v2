import { allProjects, projectPath } from '../../projects';
import { brandAssets, contact, footer, navigation, services, site } from '../../data/siteConfig';
import TransitionLink from '../../transition/TransitionLink';
import Arrow from '../ui/Arrow';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__col footer__col--lead">
          <p className="footer__line">{footer.line}</p>
          <a
            className="footer__wa"
            href={contact.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {footer.whatsappCta}
            <span className="visually-hidden"> (opens in a new tab)</span>
            <Arrow direction="external" />
          </a>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2 className="footer__head label">Studio</h2>
          <ul>
            {navigation.map((item) => (
              <li key={item.to}>
                <TransitionLink to="/" section={item.to}>
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__head label">Work</h2>
          <ul>
            {allProjects.map((p) => (
              <li key={p.slug}>
                <TransitionLink to={projectPath(p)}>{p.name}</TransitionLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__head label">Services</h2>
          <ul>
            {services.map((s) => (
              <li key={s.en}>{s.en}</li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__head label">Contact</h2>
          <ul>
            <li>
              <a href={contact.whatsapp.url} target="_blank" rel="noopener noreferrer">
                WhatsApp {contact.whatsapp.label}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={contact.instagram.url} target="_blank" rel="noopener noreferrer">
                Instagram {contact.instagram.handle}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
            <li>{site.location}</li>
          </ul>
        </div>
      </div>

      <div className="footer__sign">
        <img
          className="footer__lockup"
          src={brandAssets.lockup.src}
          alt={`${site.name} — ${site.nameAr}`}
          width={brandAssets.lockup.width}
          height={brandAssets.lockup.height}
          loading="lazy"
        />
      </div>

      <div className="footer__base">
        <p>{footer.copyright(year)}</p>
        <p lang="ar" dir="rtl">
          {site.nameAr} · {site.locationAr}
        </p>
      </div>
    </footer>
  );
}
