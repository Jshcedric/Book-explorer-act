import { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar.jsx";
import InitialState from "./components/InitialState.jsx";
import BookList from "./components/BookList.jsx";
import LoadingState from "./components/LoadingState.jsx";
import EmptyState from "./components/EmptyState.jsx";
import ErrorState from "./components/ErrorState.jsx";
import BookDetails from "./components/BookDetails.jsx";
import { MIN_SEARCH_LENGTH, searchBooks } from "./services/bookApi.js";

/**
 * PHASE 7 — clicking a book opens a details modal.
 * `selectedBook` holds the book to show; closing sets it back to null.
 * `retryToken` exists purely so the "Try again" button can re-run the
 * exact same search: bumping it re-triggers the effect below even
 * though `submittedQuery` itself hasn't changed.
 */
function App() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [retryToken, setRetryToken] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!submittedQuery) return;

    // Cancels an older request when the query changes or the component unmounts.
    const controller = new AbortController();

    async function runSearch() {
      setIsLoading(true);
      setApiError("");

      try {
        const results = await searchBooks(submittedQuery, {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setBooks(results);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setApiError(err.message);
          setBooks([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    runSearch();

    return () => {
      controller.abort();
    };
  }, [submittedQuery, retryToken]);

  function handleSearchSubmit() {
    const trimmed = query.trim();

    if (!trimmed) {
      setSearchError("Please enter a title, author, or keyword.");
      return;
    }

    if (trimmed.length < MIN_SEARCH_LENGTH) {
      setSearchError(`Enter at least ${MIN_SEARCH_LENGTH} characters to search.`);
      return;
    }

    setSearchError("");
    setSubmittedQuery(trimmed);
  }

  function handleQueryChange(value) {
    setQuery(value);
    if (searchError) setSearchError("");
  }

  function handleRetry() {
    setRetryToken((n) => n + 1);
  }

  function renderResults() {
    if (!submittedQuery) return <InitialState />;
    if (isLoading) return <LoadingState />;
    if (apiError) return <ErrorState message={apiError} onRetry={handleRetry} />;
    if (books.length === 0) return <EmptyState query={submittedQuery} />;

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
