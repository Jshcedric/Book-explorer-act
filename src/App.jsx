import { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar.jsx";
import InitialState from "./components/InitialState.jsx";
import BookList from "./components/BookList.jsx";
import LoadingState from "./components/LoadingState.jsx";
import EmptyState from "./components/EmptyState.jsx";
import ErrorState from "./components/ErrorState.jsx";
import BookDetails from "./components/BookDetails.jsx";
import { searchBooks } from "./services/bookApi.js";

/**
 * PHASE 9 — bugfix found during testing: pressing "Search" again with the
 * exact same text after an error did nothing, because React bails out on
 * an unchanged state value. `searchTrigger` bundles the query with an
 * incrementing `attempt` counter, so every submit (even a repeat) and
 * every retry reliably re-runs the effect below.
 */
function App() {
  const [query, setQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(null); // { text, attempt }
  const [searchError, setSearchError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!searchTrigger) return;

    // Guards against a slow earlier request overwriting a faster later one.
    let cancelled = false;

    async function runSearch() {
      setIsLoading(true);
      setApiError("");

      try {
        const results = await searchBooks(searchTrigger.text);
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
  }, [searchTrigger]);

  function handleQueryChange(value) {
    setQuery(value);
    if (searchError) setSearchError("");
  }

  function handleSearchSubmit() {
    const trimmed = query.trim();

    if (!trimmed) {
      setSearchError("Please enter a title, author, or keyword.");
      return;
    }

    setSearchError("");
    setSearchTrigger((prev) => ({ text: trimmed, attempt: (prev?.attempt ?? 0) + 1 }));
  }

  function handleRetry() {
    setSearchTrigger((prev) => ({ ...prev, attempt: prev.attempt + 1 }));
  }

  function renderResults() {
    if (!searchTrigger) return <InitialState />;
    if (isLoading) return <LoadingState />;
    if (apiError) return <ErrorState message={apiError} onRetry={handleRetry} />;
    if (books.length === 0) return <EmptyState query={searchTrigger.text} />;

    return <BookList books={books} onSelectBook={setSelectedBook} />;
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
              onQueryChange={handleQueryChange}
              onSubmit={handleSearchSubmit}
              error={searchError}
            />
          </div>
        </div>
      </header>

      <main className="results-area">{renderResults()}</main>

      {selectedBook && (
        <BookDetails book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}

export default App;
