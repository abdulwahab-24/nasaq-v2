import { useTransition } from './context';

const modified = (e) => e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;

/*
 * Internal link that runs a page transition. It is a real <a href>, so it can
 * be opened in a new tab, copied, and followed without JS.
 *
 *   media    — true: the transition grows from the [data-transition-media]
 *              element inside this link
 *   section  — homepage section id to land on
 *   color    — field colour the transition crosses (the destination project's own)
 */
export default function TransitionLink({ to, section, media = false, color, onClick, children, ...rest }) {
  const { go } = useTransition();
  const href = section ? `${to}#${section}` : to;

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || modified(event)) return;
    event.preventDefault();
    const from = media ? event.currentTarget.querySelector('[data-transition-media]') : null;
    go(to, { from, section, color });
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
