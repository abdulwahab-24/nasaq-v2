import { LogoBlock, Palette, TypeBlock, Words } from './IdentityBlocks';
import { Bleed, Detail, Layered, MotionBlock, Pair, Sequence, Stage, Video } from './MediaBlocks';

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
  motion: MotionBlock,
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
  return (
    <div className="pstory">
      {project.story.map((block, i) => {
        const Block = project.blocks?.[block.type] ?? BLOCKS[block.type];
        if (!Block) return null;
        return <Block key={`${block.type}-${i}`} block={block} project={project} />;
      })}
    </div>
  );
}
