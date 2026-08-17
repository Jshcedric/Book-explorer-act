import BookCard from "./BookCard.jsx";
import "./BookList.css";

function BookList({ books, onSelectBook }) {
  return (
    <div className="book-list">
      {books.map((book) => (
        <BookCard key={book.key} book={book} onSelect={onSelectBook} />
      ))}
    </div>
  );
}

export default BookList;
