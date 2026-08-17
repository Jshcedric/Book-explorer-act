import "./ErrorState.css";

function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-state__mark" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <path
            d="M24 6 44 40H4L24 6Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line x1="24" y1="20" x2="24" y2="29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="34" r="1.6" fill="currentColor" />
        </svg>
      </div>
      <h2>Something went wrong</h2>
      <p>{message || "Please try again."}</p>
      <button type="button" className="error-state__retry" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

export default ErrorState;
