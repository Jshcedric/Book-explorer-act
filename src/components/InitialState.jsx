import BookList from "./BookList.jsx";
import GENRES from "../data/genres.js";
import "./InitialState.css";

/**
 * Shown before the user has submitted their first search. App.jsx swaps
 * this out for LoadingState, ErrorState, EmptyState, or the BookList
 * grid once a search has been submitted. `recommendedBooks` is fetched
 * once on app load so there's something to browse immediately, rather
 * than an empty page.
 *
 * PHASE 10 — added a row of genre chips so there's a browsing path into
 * the catalog that doesn't require typing anything. Picking one calls
 * `onSelectGenre`, which App.jsx treats just like a search.
 */
function InitialState({ recommendedBooks, isLoadingRecommended, onSelectBook, onSelectGenre }) {
  return (
    <div className="initial-state">
      <div className="initial-state__genres">
        <span className="catalog-label initial-state__genres-label">Browse by genre</span>
        <div className="genre-chips">
          {GENRES.map((genre) => (
            <button
              key={genre.subject}
              type="button"
              className="genre-chip"
              onClick={() => onSelectGenre(genre)}
            >
              {genre.label}
            </button>
          ))}
        </div>
      </div>

      {(isLoadingRecommended || recommendedBooks.length > 0) && (
        <div className="initial-state__recommended">
          <span className="catalog-label initial-state__recommended-label">
            Recommended reading
          </span>
          {isLoadingRecommended ? (
            <p className="initial-state__recommended-loading">Pulling a few good ones…</p>
          ) : (
            <BookList books={recommendedBooks} onSelectBook={onSelectBook} />
          )}
        </div>
      )}
    </div>
  );
}

export default InitialState;
