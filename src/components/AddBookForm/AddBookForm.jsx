import { useState, useEffect } from "react";
import styles from "./AddBookForm.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  addBookToLibrary,
  fetchRecommendedBooks,
} from "../../redux/books/booksOperations";
import { selectUserBooks, selectBooks } from "../../redux/books/booksSelectors";
import { toast } from "react-toastify";
import axios from "../../api/axiosInstance";

export default function AddBookForm({ setBookDetails }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");

  const userBooks = useSelector(selectUserBooks);
  const recommendedBooks = useSelector(selectBooks);

  useEffect(() => {
    if (recommendedBooks.length === 0) {
      dispatch(fetchRecommendedBooks({ page: 1, limit: 100 }));
    }
  }, [dispatch, recommendedBooks.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !pages || +pages <= 0) {
      toast.warn("Please fill out all fields correctly.");
      return;
    }

    const isDuplicate = userBooks.some(
      (b) =>
        b.title.trim().toLowerCase() === title.trim().toLowerCase() &&
        b.author.trim().toLowerCase() === author.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.warn("This book already exists in your library.");
      return;
    }

    const matchedBook = recommendedBooks.find(
      (b) =>
        b.title.trim().toLowerCase() === title.trim().toLowerCase() &&
        b.author.trim().toLowerCase() === author.trim().toLowerCase()
    );

    try {
      const addedBook = await dispatch(
        addBookToLibrary({
          title: title.trim(),
          author: author.trim(),
          totalPages: +pages,
        })
      ).unwrap();

      const { data: fullBook } = await axios.get(`/books/${addedBook._id}`);

      if (!fullBook.imageUrl && matchedBook?.imageUrl) {
        fullBook.imageUrl = matchedBook.imageUrl;
      }

      toast.success("Book added to library!");
      setTitle("");
      setAuthor("");
      setPages("");
    } catch (err) {
      toast.error(err || "Failed to add book");
    }
  };

  return (
    <div className={styles.addBookFormContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.label}>Filters:</p>
        <p className={styles.labelDesk}>Create your library:</p>
        <div className={styles.filterInputWrapper}>
          <span className={styles.filterLabel}>Book title:</span>
          <input
            type="text"
            placeholder="I See You Are Interested In The Dark"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.filterInputWrapper}>
          <span className={styles.filterLabel}>The author:</span>
          <input
            type="text"
            placeholder="Hilarion Pavlyuk"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.filterInputWrapper}>
          <span className={styles.filterLabel}>Number of pages:</span>
          <input
            type="number"
            placeholder="664"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            className={styles.input}
            min={1}
          />
        </div>

        <button type="submit" className={styles.button}>
          Add book
        </button>
      </form>
    </div>
  );
}
