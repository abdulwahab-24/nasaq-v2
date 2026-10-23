import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'lenis/dist/lenis.css';

/*
 * Stylesheets, in cascade order. Each section's stylesheet lives beside its
 * component; they are listed here (not imported by the components) so the
 * cascade order is explicit and does not depend on the module graph.
 * Shared values come from styles/tokens.css.
 */
import './styles/tokens.css';
import './styles/global.css';
import './styles/typography.css';
import './components/ui/text-link.css';
import './components/layout/navbar.css';
import './sections/Hero/hero.css';
import './sections/Hero/opening.css';
import './sections/SelectedWork/selected-work.css';
import './sections/SelectedWork/work-index.css';
import './sections/Statement/statement.css';
import './sections/Anatomy/anatomy.css';
import './sections/Services/services.css';
import './sections/Studio/studio.css';
import './sections/Contact/contact.css';
import './components/layout/footer.css';
import './components/projects/project-hero.css';
import './components/projects/project-story.css';
import './components/projects/project-next.css';
import './components/projects/project-variants.css';
import './components/projects/project-logo.css';
import './components/layout/intro.css';
import './transition/page-transition.css';
import './components/layout/cursor.css';
import './pages/not-found.css';
// Project stylesheets (src/projects/<slug>) load last: they bend the shared
// layouts around one project's identity. Add a new project's stylesheet here.
import './projects/rumh/rumh.css';
import './projects/louiza/louiza.css';
import './projects/rukaz/rukaz.css';
import './projects/snack-quest/snack-quest.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
