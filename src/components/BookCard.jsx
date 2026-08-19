import { memo, useState } from "react";
import "./BookCard.css";

/**
 * Pure presentational component — receives everything via props.
 * Handles two different "no cover" cases: no cover_i from the API at
 * all, and a cover_i that exists but whose image 404s (this happens
 * fairly often with Open Library) — both fall back to the same
 * drawn placeholder instead of a broken-image icon.
 *
 * Wrapped in memo() because it's rendered dozens of times (a full grid
 * of covers, more after a couple "Load more" clicks). Without this,
 * toggling the theme re-renders every single card even though none of
 * them actually change — that unnecessary work is what made the
 * dark/light switch feel laggy despite the view-transition cross-fade.
 */
function BookCard({ book, onSelect }) {
  const { title, author, firstPublishYear, coverUrl } = book;
  const [imageFailed, setImageFailed] = useState(false);
  const showPlaceholder = !coverUrl || imageFailed;

  return (
    <article
      className="book-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(book)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(book);
        }
      }}
      aria-label={`View details for ${title}`}
    >
      <span className="book-card__tab" aria-hidden="true" />

      <div className="book-card__cover">
        {showPlaceholder ? (
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
        ) : (
          <img
            src={coverUrl}
            alt={`Cover of ${title}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
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

export default memo(BookCard);
