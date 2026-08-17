import "./EmptyState.css";

function EmptyState({ query }) {
  return (
    <div className="empty-state">
      <div className="empty-state__stamp" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M16 16l16 16M32 16l-16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h2>No books found</h2>
      <p>
        Nothing in the catalog matched {query ? <>&ldquo;{query}&rdquo;</> : "that search"}.
        Try a different title, author, or a broader keyword.
      </p>
    </div>
  );
}

export default EmptyState;
