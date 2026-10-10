import { useEffect, useLayoutEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import Cursor from './components/Cursor';
import Footer from './components/Footer';
import Intro from './components/Intro';
import Navbar from './components/Navbar';
import { refreshScroll, scrollToY, startLenis, stopLenis } from './motion/lenis';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Project from './pages/Project';
import TransitionProvider from './transition/TransitionProvider';

// The single Lenis instance for the app. Follows the reduced-motion setting live.
function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => (query.matches ? stopLenis() : startLenis());
    sync();
    query.addEventListener('change', sync);
    return () => {
      query.removeEventListener('change', sync);
      stopLenis();
    };
  }, []);
  return null;
}

// Back/forward and fresh loads start at the top; transitions place the page themselves.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const type = useNavigationType();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);

  useLayoutEffect(() => {
    if (type === 'POP' && !hash) scrollToY(0, { instant: true });
    // the new page's triggers and pins exist now: measure them, and the new height
    refreshScroll();
  }, [pathname, hash, type]);

  return null;
}

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
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<Project />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Intro />
      <Cursor />
    </TransitionProvider>
  );
}
