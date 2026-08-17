import { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar.jsx";
import InitialState from "./components/InitialState.jsx";

/**
 * PHASE 3 — search state + controlled input + submission, still no API.
 * `query` is the live input value; `submittedQuery` is only updated once
 * a valid search is submitted, and is what a future fetch (Phase 4) will
 * key off of. `searchError` holds simple input validation, separate from
 * the API error state that arrives later.
 */
function App() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [searchError, setSearchError] = useState("");

  function handleSearchSubmit() {
    const trimmed = query.trim();

    if (!trimmed) {
      setSearchError("Please enter a title, author, or keyword.");
      return;
    }

    setSearchError("");
    setSubmittedQuery(trimmed);
    // Phase 4 replaces this with the real Open Library fetch.
    console.log("Search triggered for:", trimmed);
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

      <main className="results-area">
        {submittedQuery ? (
          <div className="search-echo">
            <span className="catalog-label">Search submitted</span>
            <h2>&ldquo;{submittedQuery}&rdquo;</h2>
            <p>
              The actual fetch to Open Library isn&rsquo;t wired up yet —
              that&rsquo;s Phase 4. For now this just confirms the search
              state is working end to end.
            </p>
          </div>
        ) : (
          <InitialState />
        )}
      </main>
    </div>
  );
}

export default App;
