import { memo } from "react";
import BookCard from "./BookCard.jsx";
import "./BookList.css";

/**
 * Memoized alongside BookCard — when App re-renders for an unrelated
 * reason (theme toggle, opening a book's details), `books` and
 * `onSelectBook` keep the same reference, so this whole grid bails out
 * of re-rendering instead of walking every card again.
 */
function BookList({ books, onSelectBook }) {
  return (
    <div className="book-list">
      {books.map((book) => (
        <BookCard key={book.key} book={book} onSelect={onSelectBook} />
      ))}
    </div>
  );
}

export default memo(BookList);
