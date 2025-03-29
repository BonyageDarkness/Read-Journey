import { useSelector } from "react-redux";
import { selectReadingStatus } from "../../redux/reading/readingSelectors";
import styles from "./CurrentBook.module.scss";

export default function CurrentBook({ book, onReadClick }) {
  const readingStatus = useSelector(selectReadingStatus);
  const isReading = readingStatus === "active";

  if (!book) return null;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>My reading</h3>
      <div className={styles.bookInformation}>
        <div className={styles.imageWrapper}>
          <img src={book.imageUrl} alt={book.title} className={styles.image} />
        </div>
        <p className={styles.bookTitle}>{book.title}</p>
        <p className={styles.author}>{book.author}</p>

        <button
          type="button"
          onClick={onReadClick}
          className={styles.readButton}
        >
          <svg className={styles.start}>
            <use
              href={`/sprite.svg#${
                isReading ? "icon-blockStop" : "icon-block"
              }`}
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
