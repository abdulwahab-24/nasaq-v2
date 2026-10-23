import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { refreshScroll, scrollToY } from '../../motion/lenis';

// Back/forward and fresh loads start at the top; transitions place the page themselves.
export default function ScrollManager() {
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
