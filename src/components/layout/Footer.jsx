import { footer } from '../../data/siteConfig';

/*
 * The legal line, and nothing else: the homepage ends on Contact, a project page
 * on its next project. Navigation and contact live in the navbar and in Contact.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>{footer.copyright(year)}</p>
      <p>{footer.rights}</p>
    </footer>
  );
}
