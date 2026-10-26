/*
 * Every section of the page opens the same way, on the same grid: the index, the
 * section's name in English and Arabic in the left column; the title (and, where
 * there is one, a short text) from the fourth column. Only the colour changes.
 */
export default function Head({ copy, id, as: Title = 'h2', className = '' }) {
  return (
    <header className={`lz-head lz-grid ${className}`}>
      <p className="lz-index">
        {copy.n && <span className="lz-index__n">{copy.n}</span>}
        <span>{copy.label}</span>
        {copy.labelAr && (
          <span lang="ar" dir="rtl">
            {copy.labelAr}
          </span>
        )}
      </p>
      <Title className="lz-head__title" id={id}>
        {copy.title}
      </Title>
      {copy.text && <p className="lz-head__text">{copy.text}</p>}
    </header>
  );
}
