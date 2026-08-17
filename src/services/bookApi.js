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
 * Searches Open Library for books matching `query`.
 * Throws an Error with a friendly message on network failure or a
 * non-OK response, so callers can catch it and show it directly.
 */
export async function searchBooks(query) {
  const url = `${SEARCH_URL}?q=${encodeURIComponent(query)}`;

  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error("Couldn't reach Open Library. Check your connection and try again.");
  }

  if (!response.ok) {
    throw new Error("Something went wrong. Please try again.");
  }

  const data = await response.json();
  const docs = data.docs || [];

  return docs.map(mapDocToBook);
}
