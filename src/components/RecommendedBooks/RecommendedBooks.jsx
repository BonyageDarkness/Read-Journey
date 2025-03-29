import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendedBooks } from "../../redux/books/booksOperations";
import { setCurrentPage } from "../../redux/books/booksSlice";
import {
  selectBooks,
  selectBooksLoading,
  selectCurrentPage,
  selectTotalPages,
} from "../../redux/books/booksSelectors";
import {
  selectTitleFilter,
  selectAuthorFilter,
} from "../../redux/filters/filtersSelectors";
import Loader from "../Loader/Loader";

import BookModal from "../BookModal/BookModal";
import styles from "./RecommendedBooks.module.scss";

export default function RecommendedBooks() {
  const dispatch = useDispatch();
  const books = useSelector(selectBooks);
  const isLoading = useSelector(selectBooksLoading);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const [selectedBook, setSelectedBook] = useState(null);
  const titleFilter = useSelector(selectTitleFilter);
  const authorFilter = useSelector(selectAuthorFilter);

  const handleOpenModal = (book) => setSelectedBook(book);
  const handleCloseModal = () => setSelectedBook(null);

  const [limit, setLimit] = useState(() => {
    const width = window.innerWidth;
    if (width >= 1440) return 10;
    if (width >= 768) return 8;
    return 2;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1440 && limit !== 10) setLimit(10);
      else if (width >= 768 && width < 1440 && limit !== 8) setLimit(8);
      else if (width < 768 && limit !== 2) setLimit(2);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [limit]);

  useEffect(() => {
    dispatch(
      fetchRecommendedBooks({
        page: currentPage,
        limit,
        title: titleFilter,
        author: authorFilter,
      })
    );
  }, [dispatch, currentPage, limit, titleFilter, authorFilter]);

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  return (
    <div className={styles.recommendedBooksContainer}>
      <div className={styles.recommendedBooksTitleWrapper}>
        <h2 className={styles.recommendedBooksTitle}>Recommended</h2>
        <div className={styles.controls}>
          <button
            className={styles.circleButton}
            onClick={handlePrev}
            disabled={currentPage === 1 || books.length === 0}
          >
            <svg
              className={
                currentPage === 1 || books.length === 0
                  ? `${styles.icon} ${styles.iconDisabled}`
                  : styles.icon
              }
            >
              <use href="/sprite.svg#icon-chevron-left" />
            </svg>
          </button>

          <button
            className={styles.circleButton}
            onClick={handleNext}
            disabled={currentPage >= totalPages || books.length === 0}
          >
            <svg
              className={
                currentPage >= totalPages || books.length === 0
                  ? `${styles.icon} ${styles.iconDisabled}`
                  : styles.icon
              }
            >
              <use href="/sprite.svg#icon-chevron-right" />
            </svg>
          </button>
        </div>
      </div>
      <div className={styles.recommendedBooksList}>
        {isLoading ? (
          <div className={styles.loaderWrapper}>
            <Loader />
          </div>
        ) : (
          <ul className={styles.booksList}>
            {books.map((book) => (
              <li key={book._id} className={styles.bookCard}>
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className={styles.bookImage}
                  onClick={() => handleOpenModal(book)}
                />

                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookAuthor}>{book.author}</p>
              </li>
            ))}
          </ul>
        )}
        {selectedBook && (
          <BookModal book={selectedBook} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
}
