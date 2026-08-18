import BookList from "./BookList.jsx";
import "./InitialState.css";

/**
 * Shown before the user has submitted their first search. App.jsx swaps
 * this out for LoadingState, ErrorState, EmptyState, or the BookList
 * grid once a search has been submitted. `recommendedBooks` is fetched
 * once on app load so there's something to browse immediately, rather
 * than an empty page.
 */
function InitialState({ recommendedBooks, isLoadingRecommended, onSelectBook }) {
  return (
    <div className="initial-state">
      <div className="initial-state__intro">
        <div className="shelf" aria-hidden="true">
          <span className="shelf__spine" style={{ "--h": "76%", "--c": "var(--ink)" }} />
          <span className="shelf__spine" style={{ "--h": "58%", "--c": "var(--brass)" }} />
          <span className="shelf__spine" style={{ "--h": "88%", "--c": "var(--burgundy)" }} />
          <span className="shelf__spine" style={{ "--h": "64%", "--c": "var(--ink-soft)" }} />
          <span className="shelf__spine shelf__spine--tilt" style={{ "--h": "70%", "--c": "var(--brass-dim)" }} />
          <span className="shelf__spine" style={{ "--h": "50%", "--c": "var(--ink)" }} />
          <span className="shelf__spine" style={{ "--h": "82%", "--c": "var(--burgundy)" }} />
          <span className="shelf__line" />
        </div>

        <h2>Search the shelves</h2>
        <p>
          Look up a title, an author, or a subject above, and results from
          the Open Library catalog will appear here.
        </p>
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
