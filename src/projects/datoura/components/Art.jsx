import { useLayoutEffect, useRef } from 'react';
import art from '../art.json';
import { boxOf } from '../datoura.motion';

/*
 * One drawing from DATOURA's artboards, as inline SVG. The shapes are the
 * supplied vectors (art.json, lifted from DATOURA.ai by scripts/datoura-extract.mjs),
 * in the artboard's own coordinates; each keeps its role (data-role) so the
 * page's motion can address it, and can be repainted.
 *
 *   name     the piece: concept, lockup, outline, arabic, waves, card, tagline
 *   only     optional role filter
 *   paint    optional (item) → { fill?, stroke? }
 *   viewBox  optional [x, y, w, h], instead of the piece's own extent
 *   fit      true (or a padding): frame exactly the shapes drawn, measured once mounted
 *   label    accessible name; without it the drawing is decorative
 */
export default function Art({ name, only, paint, viewBox, fit, label, className, children, ref, ...rest }) {
  const own = useRef(null);
  const piece = art[name];
  const items = only ? piece.items.filter((it) => only(it.role)) : piece.items;

  useLayoutEffect(() => {
    if (fit) own.current.setAttribute('viewBox', boxOf(own.current.querySelectorAll('path'), fit === true ? 1 : fit).join(' '));
  }, [fit]);

  const setRef = (node) => {
    own.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <svg
      ref={setRef}
      viewBox={(viewBox ?? piece.viewBox).join(' ')}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      {items.map((it, i) => {
        const p = paint?.(it) ?? {};
        return (
          <path
            key={i}
            d={it.d}
            data-role={it.role}
            data-col={it.col}
            fill={p.fill ?? it.fill ?? 'none'}
            stroke={p.stroke ?? it.stroke}
            strokeWidth={it.width}
            fillRule={it.rule}
          />
        );
      })}
      {children}
    </svg>
  );
}

