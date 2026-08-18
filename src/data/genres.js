/**
 * Genres shown as "browse by" chips on the initial screen. `label` is
 * what the user sees; `subject` is the exact Open Library subject slug
 * sent to the API (some, like "science_fiction", need underscores).
 */
const GENRES = [
  { label: "Fiction", subject: "fiction" },
  { label: "Mystery", subject: "mystery" },
  { label: "Fantasy", subject: "fantasy" },
  { label: "Science Fiction", subject: "science_fiction" },
  { label: "Romance", subject: "romance" },
  { label: "Horror", subject: "horror" },
  { label: "Biography", subject: "biography" },
  { label: "History", subject: "history" },
  { label: "Poetry", subject: "poetry" },
  { label: "Young Adult", subject: "young_adult" },
];

export default GENRES;
