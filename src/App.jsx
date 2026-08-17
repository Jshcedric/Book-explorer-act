import { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar.jsx";
import InitialState from "./components/InitialState.jsx";
import { searchBooks } from "./services/bookApi.js";

/**
 * PHASE 4 — connected to the real Open Library API.
 * `submittedQuery` (from Phase 3) now drives a useEffect that fetches
 * results. `books`, `isLoading`, and `apiError` are the search-results
 * state your spec calls for. The rendering here is intentionally plain —
 * BookCard styling is Phase 5, and polished loading/empty/error UI is
 * Phase 6. This phase is only about the data being correct.
 */
function App() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [searchError, setSearchError] = useState("");

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!submittedQuery) return;

    // Guards against a slow earlier request overwriting a faster later one.
    let cancelled = false;

    async function runSearch() {
      setIsLoading(true);
      setApiError("");

      try {
        const results = await searchBooks(submittedQuery);
        if (!cancelled) {
          setBooks(results);
        }
      } catch (err) {
        if (!cancelled) {
          setApiError(err.message);
          setBooks([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [submittedQuery]);

  function handleSearchSubmit() {
    const trimmed = query.trim();

    if (!trimmed) {
      setSearchError("Please enter a title, author, or keyword.");
      return;
    }

    setSearchError("");
    setSubmittedQuery(trimmed);
  }

  function renderResults() {
    if (!submittedQuery) return <InitialState />;
    if (isLoading) return <p className="plain-status">Searching for books…</p>;
    if (apiError) return <p className="plain-status plain-status--error">{apiError}</p>;
    if (books.length === 0) return <p className="plain-status">No books found.</p>;

    // Plain list for now — Phase 5 replaces this with BookCard in a grid.
    return (
      <ul className="plain-results">
        {books.map((book) => (
          <li key={book.key}>
            <strong>{book.title}</strong> — {book.author}
            {book.firstPublishYear ? ` (${book.firstPublishYear})` : ""}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__mark">
            <span className="site-header__mark-dot" aria-hidden="true" />
            <span className="catalog-label">Open Library Catalog</span>
          </div>
          <h1>The Stacks</h1>
          <p>A quiet corner of the internet for finding your next book.</p>

          <div className="site-header__search">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              onSubmit={handleSearchSubmit}
              error={searchError}
            />
          </div>
        </div>
      </header>

      <main className="results-area">{renderResults()}</main>
    </div>
  );
}

export default App;
