import { LogoBlock, Palette, TypeBlock, Words } from './IdentityBlocks';
import { Bleed, Detail, Layered, Pair, Sequence, Stage, Video } from './MediaBlocks';

/*
 * A project page composed from its `story` blocks (projects/<slug>/<slug>.data.js).
 * The shared block types are registered here; a project adds blocks only it
 * uses through its own `blocks` (components in projects/<slug>/components/).
 * To add a shared block type: write the component, register it here, document
 * it in projects/index.js. Unknown types are skipped.
 */
const BLOCKS = {
  bleed: Bleed,
  video: Video,
  stage: Stage,
  detail: Detail,
  layered: Layered,
  pair: Pair,
  sequence: Sequence,
  type: TypeBlock,
  logo: LogoBlock,
  palette: Palette,
  words: Words,
};

export default function ProjectStory({ project }) {
  // Detail blocks are numbered in reading order.
  const detailIndex = project.story.reduce((acc, b, i) => {
    if (b.type === 'detail') acc[i] = Object.keys(acc).length + 1;
    return acc;
  }, {});

  return (
    <div className="pstory">
      {project.story.map((block, i) => {
        const Block = project.blocks?.[block.type] ?? BLOCKS[block.type];
        if (!Block) return null;
        return <Block key={`${block.type}-${i}`} block={block} project={project} index={detailIndex[i]} />;
      })}
    </div>
  );
}
