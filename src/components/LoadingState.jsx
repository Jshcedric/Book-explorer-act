import "./LoadingState.css";

/**
 * Skeleton cards mirror the real BookCard shape (tab, cover, title lines)
 * so the layout doesn't jump when results arrive. Count is fixed rather
 * than random so the grid height stays predictable while loading.
 */
function LoadingState() {
  const placeholders = Array.from({ length: 8 });

  return (
    <div>
      <p className="loading-state__message catalog-label">Searching for books…</p>
      <div className="book-list" aria-hidden="true">
        {placeholders.map((_, i) => (
          <div className="skeleton-card" key={i}>
            <span className="skeleton-card__tab" />
            <div className="skeleton-card__cover" />
            <div className="skeleton-card__body">
              <div className="skeleton-card__line skeleton-card__line--title" />
              <div className="skeleton-card__line skeleton-card__line--author" />
              <div className="skeleton-card__line skeleton-card__line--year" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingState;
