import { Route, Routes } from 'react-router-dom';
import Cursor from './components/layout/Cursor';
import Footer from './components/layout/Footer';
import Intro from './components/layout/Intro';
import Navbar from './components/layout/Navbar';
import ScrollManager from './components/layout/ScrollManager';
import SmoothScroll from './components/layout/SmoothScroll';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProjectRoute from './pages/ProjectPage';
import TransitionProvider from './transition/TransitionProvider';

/*
 * Routes. Project pages are not listed one by one: /work/:slug resolves the
 * slug against the project registry (src/projects) and falls back to the 404.
 */
export default function App() {
  return (
    <TransitionProvider>
      <SmoothScroll />
      <ScrollManager />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work/:slug" element={<ProjectRoute />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <Intro />
      <Cursor />
    </TransitionProvider>
  );
}
