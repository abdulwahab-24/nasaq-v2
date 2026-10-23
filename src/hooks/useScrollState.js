import { useEffect, useState } from 'react';

/*
 * Navigation bar state from the page scroll: `solid` once the page has left the
 * top, `hidden` while scrolling down past half a screen. Updates at most once a frame.
 */
export default function useScrollState() {
  const [state, setState] = useState({ solid: false, hidden: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < 4) return;
      setState({ solid: y > 8, hidden: delta > 0 && y > window.innerHeight * 0.5 });
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}
