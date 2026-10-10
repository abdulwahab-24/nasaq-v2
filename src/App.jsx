import { useLayoutEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import Cursor from './components/Cursor';
import Footer from './components/Footer';
import Intro from './components/Intro';
import Navbar from './components/Navbar';
import { ScrollTrigger } from './motion/gsap';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Project from './pages/Project';
import TransitionProvider from './transition/TransitionProvider';

// Back/forward and fresh loads start at the top; transitions place the page themselves.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const type = useNavigationType();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);

  useLayoutEffect(() => {
    if (type === 'POP' && !hash) window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname, hash, type]);

  return null;
}

export default function App() {
  return (
    <TransitionProvider>
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
