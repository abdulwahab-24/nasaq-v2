import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FINE_POINTER, gsap, prefersReducedMotion } from '../../motion/gsap';

/*
 * Project cursor — desktop fine pointers only. Over anything carrying
 * data-cursor="Label" it becomes a blue disc with that label, so a project
 * reads as "View" and the next project as "Next". Elsewhere it is hidden and
 * the system cursor is untouched.
 */
export default function Cursor() {
  const ref = useRef(null);
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(FINE_POINTER).matches,
  );
  const [label, setLabel] = useState('');
  const { pathname } = useLocation();

  // A new page starts with the plain cursor until the pointer moves again.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setLabel('');
  }

  useEffect(() => {
    if (!enabled) return undefined;
    const el = ref.current;
    const fast = prefersReducedMotion() ? 0.01 : 0.45;
    const x = gsap.quickTo(el, 'x', { duration: fast, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: fast, ease: 'power3' });

    const onMove = (e) => {
      x(e.clientX);
      y(e.clientY);
      const target = e.target.closest?.('[data-cursor]');
      setLabel(target ? target.dataset.cursor : '');
    };
    const onLeave = () => setLabel('');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} className={`cursor${label ? ' cursor--on' : ''}`} aria-hidden="true">
      <span className="cursor__disc">
        <span className="cursor__label">{label}</span>
      </span>
    </div>
  );
}
