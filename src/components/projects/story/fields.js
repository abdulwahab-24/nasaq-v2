import { inkOn } from '../../../utils/colour';

/* Colour fields and sizing shared by the story blocks.
   Project colours appear only inside project frames. */

function toneColour(tone, project) {
  if (!tone || tone === 'page') return null;
  if (tone === 'surface') return project.theme.surface;
  if (tone === 'accent') return project.theme.accent;
  if (tone === 'ink') return project.theme.ink;
  return tone;
}

export const fieldStyle = (tone, project) => {
  const bg = toneColour(tone, project);
  return bg ? { '--field': bg, '--field-ink': inkOn(bg) } : undefined;
};

// Never display an image wider than its pixels.
export const nativeMax = (media) => ({ maxWidth: `${media.width}px` });

// Rendered width of a stage image for each stage size (see .pb--s/m/l in project-story.css).
export const STAGE_SIZES = {
  s: '(min-width: 480px) 448px, 100vw',
  m: '(min-width: 900px) 832px, 100vw',
  l: '(min-width: 1300px) 1216px, 100vw',
};
