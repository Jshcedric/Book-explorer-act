import "./SearchBar.css";

/**
 * Visual only in this phase — no controlled state or submit handling yet.
 * Phase 3 turns this into a controlled component wired to search state.
 */
function SearchBar() {
  return (
    <form className="search-slip" onSubmit={(e) => e.preventDefault()}>
      <div className="search-slip__field">
        <span className="catalog-label search-slip__label">Search the catalog</span>
        <input
          type="text"
          className="search-slip__input"
          placeholder="Title, author, or keyword — try “dune”"
          aria-label="Search books by title, author, or keyword"
        />
      </div>
      <button type="submit" className="search-slip__button">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
