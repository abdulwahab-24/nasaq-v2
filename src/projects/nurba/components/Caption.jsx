/*
 * Every application on the page carries the same caption: a small navy plate, its
 * upper-left corner cut like the frame of the monogram, in the lower left of its scene.
 */
export default function Caption({ copy, as: Tag = 'figcaption' }) {
  return (
    <Tag className="nb-cap">
      <span className="nb-cap__label">{copy.label}</span>
      {copy.text && <span className="nb-cap__text">{copy.text}</span>}
    </Tag>
  );
}
