import { useEffect, useState } from 'react';

/*
 * Which homepage section the reader is in, for the navigation.
 *
 * `ranges` maps a navigation id to the elements it spans: [first, last] selectors,
 * so one entry can cover several sections (Work = the chapters and the index).
 * A section is current while it crosses a line 40% down the viewport; between
 * sections that have no entry (Statement, Anatomy) nothing is current.
 * Reads a handful of rectangles at most once a frame; no scroll triggers, so it
 * cannot disturb the pinned opening's measurements.
 */
export default function useActiveSection(ranges, enabled) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = null;
      for (const [id, [first, last = first]] of Object.entries(ranges)) {
        const a = document.querySelector(first);
        const b = document.querySelector(last);
        if (!a || !b) continue;
        if (a.getBoundingClientRect().top <= line && b.getBoundingClientRect().bottom > line) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [ranges, enabled]);

  return enabled ? active : null;
}
