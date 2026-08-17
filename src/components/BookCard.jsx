import "./BookCard.css";

/**
 * Pure presentational component — receives everything via props.
 * Handles the case where cover_i is missing from the API response by
 * falling back to a drawn placeholder instead of a broken <img>.
 */
function BookCard({ book }) {
  const { title, author, firstPublishYear, coverUrl } = book;

  return (
    <article className="book-card">
      <span className="book-card__tab" aria-hidden="true" />

      <div className="book-card__cover">
        {coverUrl ? (
          <img src={coverUrl} alt={`Cover of ${title}`} loading="lazy" />
        ) : (
          <div className="book-card__cover-placeholder" role="img" aria-label={`No cover available for ${title}`}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path
                d="M10 8c0-2.2 1.8-4 4-4h20a2 2 0 0 1 2 2v34a2 2 0 0 1-2 2H14c-2.2 0-4 1.8-4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 8v34"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="book-card__body">
        <h3 className="book-card__title">{title}</h3>
        <p className="book-card__author">{author}</p>
        {firstPublishYear && (
          <span className="book-card__year catalog-label">{firstPublishYear}</span>
        )}
      </div>
    </article>
  );
}

export default BookCard;
