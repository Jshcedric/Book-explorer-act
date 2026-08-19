import { useRef, useState } from "react";
import "./ThemeToggle.css";

function getInitialTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);
  const switchingRef = useRef(false);
  const isDark = theme === "dark";

  function applyTheme(nextTheme) {
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  }

  function handleToggle() {
    if (switchingRef.current) return;

    const nextTheme = isDark ? "light" : "dark";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.getElementById("root");

    if (reduceMotion || !root || typeof root.animate !== "function") {
      applyTheme(nextTheme);
      return;
    }

    // Do NOT use document.startViewTransition here. On a page with many
    // cover images, the browser snapshots the full viewport twice, which
    // can create a visible flash/flicker. Instead, fade the already-
    // composited app layer slightly, swap the CSS variables near the
    // midpoint, then fade it back in. Opacity stays on the compositor and
    // avoids repainting hundreds of cards as part of the animation.
    switchingRef.current = true;

    const animation = root.animate(
      [
        { opacity: 1 },
        { opacity: 0.78, offset: 0.46 },
        { opacity: 1 },
      ],
      {
        duration: 170,
        easing: "ease-in-out",
      },
    );

    const swapTimer = window.setTimeout(() => {
      applyTheme(nextTheme);
    }, 72);

    animation.finished
      .catch(() => {})
      .finally(() => {
        window.clearTimeout(swapTimer);
        switchingRef.current = false;
      });
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="12" y1="2.5" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="21.5" />
            <line x1="2.5" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="21.5" y2="12" />
            <line x1="5.1" y1="5.1" x2="6.9" y2="6.9" />
            <line x1="17.1" y1="17.1" x2="18.9" y2="18.9" />
            <line x1="5.1" y1="18.9" x2="6.9" y2="17.1" />
            <line x1="17.1" y1="6.9" x2="18.9" y2="5.1" />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
