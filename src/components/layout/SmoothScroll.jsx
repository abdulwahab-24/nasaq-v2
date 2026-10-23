import { useEffect } from 'react';
import { startLenis, stopLenis } from '../../motion/lenis';

// The single Lenis instance for the app. Follows the reduced-motion setting live.
export default function SmoothScroll() {
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
