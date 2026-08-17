import "./App.css";
import SearchBar from "./components/SearchBar.jsx";
import InitialState from "./components/InitialState.jsx";

/**
 * PHASE 2 — full visual interface, no API wiring yet.
 * The search bar is present but not controlled (see SearchBar.jsx);
 * that lands in Phase 3. Right now App only ever renders InitialState —
 * the loading/empty/error/results branches arrive in Phases 4–6.
 */
function App() {
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
            <SearchBar />
          </div>
        </div>
      </header>

      <main className="results-area">
        <InitialState />
      </main>
    </div>
  );
}

export default App;
