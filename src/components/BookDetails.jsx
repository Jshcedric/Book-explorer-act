import { useLayoutEffect, useRef, useState } from "react";
import "./BookDetails.css";

/**
 * A modal rather than a separate page or inline expansion — keeps the
 * search results in place behind it so closing returns exactly where
 * the user was. Closes on Escape, backdrop click, or the close button.
 *
 * Closing is a two-step process (`isClosing` state) rather than an
 * instant unmount, so there's a quick fade/drop-out to match the
 * fade/rise-in on open — without it, the modal just vanished, which
 * read as abrupt next to the smooth open.
 */
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

  // useLayoutEffect (not useEffect) so the scroll lock and focus move
  // happen in the same paint as the modal mounting, before the browser
  // shows anything. With a plain useEffect this ran a frame *after*
  // the modal was already visible — the scrollbar disappearing and the
  // page reflowing right after the fade-in read as a small stutter on
  // every click. Doing it here means there's just one clean frame.
  useLayoutEffect(() => {
    closeButtonRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") requestClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, []);

  const { title, author, firstPublishYear, coverUrl, editionCount, subjects } = book;

  return (
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
}

export default BookDetails;
