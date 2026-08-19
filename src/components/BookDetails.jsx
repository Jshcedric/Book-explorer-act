import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./BookDetails.css";

function BookDetails({ book, onClose }) {
  const closeButtonRef = useRef(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  function requestClose() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      onClose();
      return;
    }
    setIsClosing(true);
  }

  // Run focus/keyboard work after the modal has painted. The previous
  // useLayoutEffect + body overflow mutation forced synchronous layout at
  // the exact moment a card was clicked, which made the popup feel delayed.
  // Keeping the page scrollbar as-is also avoids a full-page reflow.
  useEffect(() => {
    const focusFrame = requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    function handleKeyDown(e) {
      if (e.key === "Escape") requestClose();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const { title, author, firstPublishYear, coverUrl, editionCount, subjects } = book;

  const modal = (
    <div
      className={`book-details-backdrop${isClosing ? " book-details-backdrop--closing" : ""}`}
      onClick={requestClose}
      onAnimationEnd={(e) => {
        if (isClosing && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`book-details${isClosing ? " book-details--closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-details-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="book-details__close"
          onClick={requestClose}
          ref={closeButtonRef}
          aria-label="Close book details"
        >
          ×
        </button>

        <div className="book-details__content">
          <div className="book-details__cover">
            {coverUrl && !imageFailed ? (
              <img
                src={coverUrl}
                alt={`Cover of ${title}`}
                decoding="async"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="book-details__cover-placeholder" role="img" aria-label={`No cover available for ${title}`}>
                <svg viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    d="M10 8c0-2.2 1.8-4 4-4h20a2 2 0 0 1 2 2v34a2 2 0 0 1-2 2H14c-2.2 0-4 1.8-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M10 8v34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>

          <div className="book-details__info">
            <span className="catalog-label">Catalog entry</span>
            <h2 id="book-details-title">{title}</h2>
            <p className="book-details__author">{author}</p>

            <dl className="book-details__meta">
              <div>
                <dt>First published</dt>
                <dd>{firstPublishYear || "Unknown"}</dd>
              </div>
              <div>
                <dt>Editions</dt>
                <dd>{editionCount ? `${editionCount} in the catalog` : "Unknown"}</dd>
              </div>
            </dl>

            {subjects && subjects.length > 0 && (
              <div className="book-details__subjects">
                <span className="catalog-label">Subjects</span>
                <div className="book-details__tags">
                  {subjects.map((subject) => (
                    <span className="book-details__tag" key={subject}>
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default BookDetails;
