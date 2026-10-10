// Drawn arrow so it renders identically everywhere (font fallbacks turn ↓ into emoji on some systems).
const ROTATION = { right: 0, down: 90, left: 180, external: -45 };

export default function Arrow({ direction = 'right' }) {
  return (
    <svg
      className="text-link__arrow"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ rotate: `${ROTATION[direction]}deg` }}
    >
      <path d="M1 7h11M7.5 2.5 12 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
