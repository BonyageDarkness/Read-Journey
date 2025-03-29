import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendedBooks } from "../../redux/books/booksOperations";
import { selectBooks, selectUserBooks } from "../../redux/books/booksSelectors";
import BookModal from "../BookModal/BookModal";
import { sampleSize } from "lodash";
import { Link } from "react-router-dom";
import styles from "./RecommendedBlock.module.scss";

export default function RecommendedBlock() {
  const dispatch = useDispatch();
  const [selectedBook, setSelectedBook] = useState(null); // ✅ добавил
  const recommended = useSelector(selectBooks);
  const userBooks = useSelector(selectUserBooks);
  const isLoading = false;

  const handleOpenModal = (book) => setSelectedBook(book);
  const handleCloseModal = () => setSelectedBook(null);

  useEffect(() => {
    if (recommended.length === 0) {
      dispatch(fetchRecommendedBooks({ page: 1, limit: 100 }));
    }
  }, [dispatch, recommended.length]);

  const userBookIds = userBooks.map((book) => book._id);

  const notInLibrary = recommended.filter(
    (book) => !userBookIds.includes(book._id)
  );

  const randomBooks = sampleSize(notInLibrary, 3);

  return (
    <div className={styles.block}>
      <h2 className={styles.title}>Recommended books</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul className={styles.bookList}>
            {randomBooks.map((book) => (
              <li key={book._id} className={styles.bookCard}>
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className={styles.image}
                  onClick={() => handleOpenModal(book)}
                />
                <p className={styles.name}>{book.title}</p>
                <p className={styles.author}>{book.author}</p>
              </li>
            ))}
          </ul>

          {selectedBook && (
            <BookModal book={selectedBook} onClose={handleCloseModal} />
          )}

          <div className={styles.view}>
            <div className={styles.viewAll}>
              <Link to="/recommended" className={styles.link}>
                Home
              </Link>
            </div>
            <Link to="/recommended" className={styles.link}>
              <svg className={styles.icon}>
                <use href="/sprite.svg#icon-log-in" />
              </svg>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
