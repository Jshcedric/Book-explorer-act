# The Stacks — Book Search App

A React book search app built on the Open Library API.

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Project structure

- `src/App.jsx` — top-level state (search text, results, loading/error) and
  the conditional rendering that switches between states.
- `src/services/bookApi.js` — the Open Library API call and response mapping.
- `src/components/`
  - `SearchBar` — controlled search input with basic validation.
  - `InitialState` — welcome screen shown before the first search.
  - `LoadingState` — skeleton cards shown while fetching.
  - `EmptyState` — shown when a search returns no results.
  - `ErrorState` — shown on a failed request, with a retry button.
  - `BookList` / `BookCard` — the results grid and individual cards.
  - `BookDetails` — the modal shown when a book card is clicked.

## Notes

- No API key is required — Open Library's search endpoint is public.
- If search ever errors immediately with "Couldn't reach Open Library,"
  that means the browser itself can't reach openlibrary.org (network/DNS/
  firewall issue) — check the browser console for the underlying error
  and confirm `https://openlibrary.org/search.json?q=dune` loads directly
  in a new tab.
