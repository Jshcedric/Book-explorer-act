import "./SearchBar.css";

/**
 * PHASE 3 — now a controlled component. The input's value comes from
 * `query` (owned by App) and every keystroke flows back up through
 * `onQueryChange`. Submitting calls `onSubmit`, which App uses to run
 * the search. Basic validation (no empty/whitespace-only searches)
 * lives here since it's about the input itself, not the search result.
 */
function SearchBar({ query, onQueryChange, onSubmit, error }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form className="search-slip" onSubmit={handleSubmit} noValidate>
      <div className="search-slip__field">
        <span className="catalog-label search-slip__label">Search the catalog</span>
        <input
          type="text"
          className="search-slip__input"
          placeholder="Title, author, or keyword — try “dune”"
          aria-label="Search books by title, author, or keyword"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "search-slip-error" : undefined}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        {error && (
          <span id="search-slip-error" className="search-slip__error" role="alert">
            {error}
          </span>
        )}
      </div>
      <button type="submit" className="search-slip__button">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
