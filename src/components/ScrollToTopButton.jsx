import { useEffect, useState } from "react";
import "./ScrollToTopButton.css";

/**
 * Appears once the user has scrolled past one viewport height, and
 * smooth-scrolls back to the top on click. Listener is passive and
 * cleaned up on unmount.
 */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleClick() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      className="scroll-top-button"
      onClick={handleClick}
      aria-label="Scroll back to top"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 19V6M6 11l6-6 6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default ScrollToTopButton;
