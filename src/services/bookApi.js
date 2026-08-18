const SEARCH_URL = "https://openlibrary.org/search.json";
const COVER_URL = "https://covers.openlibrary.org/b/id";

/**
 * Turns one raw Open Library search "doc" into the shape the rest of
 * the app relies on, filling in sensible fallbacks for missing fields
 * (Open Library search results are inconsistent — many books are
 * missing a cover, an author, or a publish year).
 */
function mapDocToBook(doc) {
  return {
    key: doc.key,
    title: doc.title || "Untitled",
    author: doc.author_name?.[0] || "Unknown author",
    firstPublishYear: doc.first_publish_year || null,
    coverId: doc.cover_i || null,
    coverUrl: doc.cover_i ? `${COVER_URL}/${doc.cover_i}-M.jpg` : null,
    editionCount: doc.edition_count || null,
    subjects: doc.subject?.slice(0, 6) || [],
  };
}

/**
 * Shared fetch + error handling for every Open Library request in this
 * file. Throws an Error with a friendly message on network failure or
 * a non-OK response, so callers can catch it and show it directly.
 */
async function fetchBooks(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    // The friendly message below is what the UI shows, but the browser
    // console gets the real reason (CORS block, offline, DNS failure, etc.)
    // so it's actually diagnosable instead of a black box.
    console.error("Open Library fetch failed:", err);
    throw new Error("Couldn't reach Open Library. Check your connection and try again.");
  }

  if (!response.ok) {
    throw new Error("Something went wrong. Please try again.");
  }

  const data = await response.json();
  const docs = data.docs || [];

  return docs.map(mapDocToBook);
}

/**
 * Searches Open Library for books matching `query`.
 */
export function searchBooks(query) {
  const url = `${SEARCH_URL}?q=${encodeURIComponent(query)}`;
  return fetchBooks(url);
}

/**
 * A small set of well-regarded books to show before the user has
 * searched, so the app doesn't open on an empty page. Pulled from the
 * "fiction" subject sorted by rating, rather than hardcoded titles, so
 * it's real catalog data rather than a fake-looking static list.
 */
export function getRecommendedBooks() {
  const url = `${SEARCH_URL}?q=subject:fiction&sort=rating&limit=8`;
  return fetchBooks(url);
}

/**
 * Pulls a page of well-rated books for a single Open Library subject —
 * powers the "browse by genre" chips on the initial screen. Reuses the
 * same fetch/error/mapping pipeline as everything else, so a genre
 * request behaves exactly like a search as far as the rest of the app
 * is concerned.
 */
export function getBooksBySubject(subject) {
  const url = `${SEARCH_URL}?q=subject:${encodeURIComponent(subject)}&sort=rating&limit=20`;
  return fetchBooks(url);
}
