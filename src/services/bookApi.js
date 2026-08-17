const SEARCH_URL = "https://openlibrary.org/search.json";
const COVER_URL = "https://covers.openlibrary.org/b/id";
const SEARCH_LIMIT = 24;
const REQUEST_TIMEOUT_MS = 15_000;
export const MIN_SEARCH_LENGTH = 3;
const SEARCH_FIELDS = [
  "key",
  "title",
  "author_name",
  "first_publish_year",
  "cover_i",
  "edition_count",
  "subject",
];

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
export async function searchBooks(query, { signal } = {}) {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < MIN_SEARCH_LENGTH) {
    throw new Error(`Enter at least ${MIN_SEARCH_LENGTH} characters to search Open Library.`);
  }

  const params = new URLSearchParams({
    q: normalizedQuery,
    fields: SEARCH_FIELDS.join(","),
    limit: String(SEARCH_LIMIT),
  });
  const url = `${SEARCH_URL}?${params}`;

  // A failed upstream request should not leave the loading state spinning
  // forever. Combining this signal with the caller's signal also lets a new
  // search cancel an older one immediately.
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const requestSignal = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;

  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: requestSignal,
    });
  } catch (error) {
    // Preserve caller-initiated cancellation. App.jsx deliberately ignores it
    // when a query changes or the component unmounts.
    if (signal?.aborted) throw error;

    if (error?.name === "TimeoutError" || timeoutSignal.aborted) {
      throw new Error("Open Library took too long to respond. Please try again.");
    }

    throw new Error("Couldn't reach Open Library. Check your connection and try again.");
  }

  if (!response.ok) {
    if (response.status === 422) {
      throw new Error(`Enter at least ${MIN_SEARCH_LENGTH} characters to search Open Library.`);
    }

    if (response.status === 429) {
      throw new Error("Open Library is receiving too many requests. Please try again shortly.");
    }

    throw new Error(`Open Library returned an error (${response.status}). Please try again.`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Open Library returned an invalid response. Please try again.");
  }

  if (!Array.isArray(data?.docs)) {
    throw new Error("Open Library returned an unexpected response. Please try again.");
  }

  return data.docs.map(mapDocToBook);
}
