import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import "./App.css";
import SearchBar from "./components/SearchBar.jsx";
import InitialState from "./components/InitialState.jsx";
import BookList from "./components/BookList.jsx";
import LoadingState from "./components/LoadingState.jsx";
import EmptyState from "./components/EmptyState.jsx";
import ErrorState from "./components/ErrorState.jsx";
import BookDetails from "./components/BookDetails.jsx";
import ScrollToTopButton from "./components/ScrollToTopButton.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { searchBooks, getRecommendedBooks, getBooksBySubject } from "./services/bookApi.js";

/**
 * PHASE 9 — bugfix found during testing: pressing "Search" again with the
 * exact same text after an error did nothing, because React bails out on
 * an unchanged state value. `searchTrigger` bundles the query with an
 * incrementing `attempt` counter, so every submit (even a repeat) and
 * every retry reliably re-runs the effect below.
 *
 * PHASE 10 — `searchTrigger` grew a `type` field ("search" | "genre") so
 * the same trigger/effect machinery can drive either a free-text search
 * or a "browse by genre" click from the initial screen.
 */
function App() {
  const [query, setQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(null); // { type, text, attempt }
  const [searchError, setSearchError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  function handleThemeToggle() {
    const next = theme === "dark" ? "light" : "dark";

    // Previously every element on the page carried its own
    // background/border/color transition, so flipping themes meant
    // hundreds of book-card children animating independently at once —
    // that's what actually read as "laggy". The View Transitions API
    // instead takes a single before/after snapshot of the whole page
    // and cross-fades between them as one GPU-composited animation, so
    // it stays smooth no matter how many cards are on screen. Falls
    // back to an instant (untransitioned) swap on unsupported browsers
    // or when the user has reduced motion enabled.
    const canAnimate =
      typeof document.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canAnimate) {
      setTheme(next);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
  }

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);

  // Runs once on mount to populate the "before you search" screen —
  // deliberately silent on failure (just leaves the list empty) since
  // it's a nice-to-have, not something that should show an error state.
  useEffect(() => {
    let cancelled = false;

    getRecommendedBooks()
      .then((results) => {
        if (!cancelled) setRecommendedBooks(results);
      })
      .catch(() => {
        // Recommendations are optional polish — fail quietly.
      })
      .finally(() => {
        if (!cancelled) setIsLoadingRecommended(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!searchTrigger) return;

    // Guards against a slow earlier request overwriting a faster later one.
    let cancelled = false;

    async function runSearch() {
      setIsLoading(true);
      setApiError("");

      try {
        const results =
          searchTrigger.type === "genre"
            ? await getBooksBySubject(searchTrigger.text)
            : await searchBooks(searchTrigger.text);
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
    setSearchTrigger((prev) => ({ type: "search", text: trimmed, attempt: (prev?.attempt ?? 0) + 1 }));
  }

  // Genre chips on the initial screen reuse the same trigger/effect
  // machinery as a text search, just tagged "genre" and fed a subject
  // slug instead of the free-text query.
  function handleGenreSelect(genre) {
    setQuery("");
    setSearchError("");
    setSearchTrigger((prev) => ({ type: "genre", text: genre, attempt: (prev?.attempt ?? 0) + 1 }));
  }

  function handleRetry() {
    setSearchTrigger((prev) => ({ ...prev, attempt: prev.attempt + 1 }));
  }

  // Clicking the "The Stacks" title acts as a home link — it clears any
  // active search/genre/error state and returns to the initial screen.
  function handleGoHome() {
    setQuery("");
    setSearchError("");
    setApiError("");
    setSearchTrigger(null);
    setBooks([]);
    setSelectedBook(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderResults() {
    if (!searchTrigger) {
      return (
        <InitialState
          recommendedBooks={recommendedBooks}
          isLoadingRecommended={isLoadingRecommended}
          onSelectBook={setSelectedBook}
          onSelectGenre={handleGenreSelect}
        />
      );
    }
    if (isLoading) return <LoadingState />;
    if (apiError) return <ErrorState message={apiError} onRetry={handleRetry} />;
    if (books.length === 0) return <EmptyState query={searchTrigger.text} />;

    return <BookList books={books} onSelectBook={setSelectedBook} />;
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__top">
            <div className="site-header__mark">
              <span className="site-header__mark-dot" aria-hidden="true" />
              <span className="catalog-label">Open Library Catalog</span>
            </div>
            <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
          </div>
          <h1>
            <button type="button" className="site-header__home-link" onClick={handleGoHome}>
              The Stacks
            </button>
          </h1>
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

      <ScrollToTopButton />
    </div>
  );
}

export default App;
