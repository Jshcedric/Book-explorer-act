import "./App.css";

/**
 * PHASE 1 — project setup + visual direction only.
 * The search bar, results grid, and states arrive in later phases.
 * This shell exists so the typography, color, and spacing choices
 * can be reviewed before any functionality is built on top of them.
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
        </div>
      </header>

      <p className="preview-note">
        <strong>Phase 1 preview.</strong> This confirms the look and feel —
        paper background, library-green ink, brass accents, and the
        Fraunces / Source Serif 4 / IBM Plex Mono type system. The search
        bar and results grid come next, in Phase 2.
      </p>
    </div>
  );
}

export default App;
