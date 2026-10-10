import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'lenis/dist/lenis.css';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/nav.css';
import './styles/hero.css';
import './styles/opening.css';
import './styles/work.css';
import './styles/index.css';
import './styles/statement.css';
import './styles/anatomy.css';
import './styles/services.css';
import './styles/studio.css';
import './styles/contact.css';
import './styles/footer.css';
import './styles/project.css';
import './styles/signature.css';
import './styles/overlays.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
