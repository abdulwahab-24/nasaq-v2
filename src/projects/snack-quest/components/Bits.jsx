/*
 * Small pieces of the identity used across the page:
 *   Level    a section's label, numbered like the levels of a game, in Pixelify
 *   Flames   the identity's pixel flames as a strip, flickering in steps (CSS)
 */
export function Level({ n, title }) {
  return (
    <p className="sq-level">
      <span className="sq-level__n">Level {String(n).padStart(2, '0')}</span>
      <span>{title}</span>
    </p>
  );
}

export function Flames({ flip = false }) {
  return <div className={`sq-flames${flip ? ' sq-flames--flip' : ''}`} aria-hidden="true" />;
}
