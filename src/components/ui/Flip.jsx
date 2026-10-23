import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../motion/gsap';
import ResponsiveImage from './ResponsiveImage';

/*
 * A small gallery that turns its own pages: each image wipes up over the
 * previous one. Runs only while visible; reduced motion shows the first image.
 */
export default function Flip({ items, interval = 1600, sizes, className = '' }) {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || items.length < 2) return undefined;
    let timer = 0;
    const io = new IntersectionObserver(([entry]) => {
      clearInterval(timer);
      if (entry.isIntersecting) timer = setInterval(() => setIndex((i) => (i + 1) % items.length), interval);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, [items.length, interval]);

  return (
    <div className={`flip ${className}`} ref={ref}>
      {items.map((m, i) => (
        <div
          key={m.src}
          className={`flip__page${i === index ? ' is-current' : ''}${i === (index - 1 + items.length) % items.length ? ' is-prev' : ''}`}
          aria-hidden={i === index ? undefined : true}
        >
          <ResponsiveImage media={m} sizes={sizes} alt={i === index ? m.alt : ''} />
        </div>
      ))}
    </div>
  );
}
