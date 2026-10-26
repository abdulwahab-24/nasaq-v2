import { LOGO_RATIO, MARK_BOX, MARK_FRAME, partBox } from '../louiza.motion';

/*
 * The Louiza logo (vertical, as supplied), rebuilt from its parts so each can move:
 * the two leaves (grouped as the mark) and the wordmark. Painted in the current
 * colour; each leaf also carries the identity's rose-to-blue (the mark page), shown
 * as --lz-grad goes from 0 to 1.
 */
export default function Logo({ className = '' }) {
  return (
    <span className={`lz-logo ${className}`} style={{ aspectRatio: LOGO_RATIO }} aria-hidden="true">
      <span className="lz-logo__mark" style={MARK_BOX}>
        <span className="lz-logo__leaf lz-logo__leaf--big" style={partBox('leafBig', MARK_FRAME)} />
        <span className="lz-logo__leaf lz-logo__leaf--small" style={partBox('leafSmall', MARK_FRAME)} />
      </span>
      <span className="lz-logo__word" style={partBox('word')} />
    </span>
  );
}
