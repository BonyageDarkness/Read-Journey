import { useState, useEffect } from "react";

import styles from "./BookModal.module.scss";
import img from "../../img/modal/like.png";
import img2 from "../../img/modal/like@2x.png";
import img3 from "../../img/modal/like-big.png";
import img4 from "../../img/modal/like-big@2x.png";
import { useDispatch, useSelector } from "react-redux";
import { selectUserBooks } from "../../redux/books/booksSelectors";
import { addRecommendedBookById } from "../../redux/books/booksOperations";
import { toast } from "react-toastify";

export default function BookModal({
  book,
  onClose,
  buttonText = "Add to library",
  onButtonClick,
}) {
  const dispatch = useDispatch();
  const [isComplete, setIsComplete] = useState(false);
  const userBooks = useSelector(selectUserBooks);

  const handleAddToLibrary = async () => {
    try {
      if (!book._id) {
        toast.error("No book ID provided");
        return;
      }

      const isAlreadyInLibrary = userBooks.some(
        (b) => b.title === book.title && b.author === book.author
      );

      if (isAlreadyInLibrary) {
        toast.warn("This book is already in your library");
        return;
      }

      await dispatch(addRecommendedBookById(book._id)).unwrap();
      setIsComplete(true);
      toast.success("Book added to library!");
    } catch (error) {
      toast.error(error || "Failed to add book");
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        className={`${styles.modal} ${isComplete ? styles.modalComplete : ""}`}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          <svg className={styles.icon}>
            <use href="/sprite.svg#icon-x" />
          </svg>
        </button>

        {!isComplete ? (
          <>
            <img
              src={book.imageUrl}
              alt={book.title}
              className={styles.image}
            />
            <h2 className={styles.title}>{book.title}</h2>
            <p className={styles.author}>{book.author}</p>
            <p className={styles.pages}>{book.totalPages} pages</p>

            <button
              className={styles.addBtn}
              onClick={async () => {
                // если `onButtonClick` передан — используем его
                if (onButtonClick) {
                  await onButtonClick(); // он сам добавит книгу и перенаправит
                } else {
                  // fallback: просто добавление
                  await handleAddToLibrary();
                }
              }}
            >
              {buttonText}
            </button>
          </>
        ) : (
          <div className={styles.complete}>
            <img
              src={img}
              srcSet={`${img} 1x, ${img2} 2x`}
              alt="like"
              className={styles.completeIconLike}
            />
            <img
              src={img3}
              srcSet={`${img3} 1x, ${img4} 2x`}
              alt="like"
              className={styles.completeIconLikeTablet}
            />
            <h2>Good job</h2>
            <p>
              Your book is now in{" "}
              <span className={styles.span}>the library!</span> The joy knows no
              bounds and now you can start your training
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
