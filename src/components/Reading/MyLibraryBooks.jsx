import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { selectReadingStatus } from "../../redux/readingFilter/readingFilterSelectors";
import { setReadingStatus } from "../../redux/readingFilter/readingFilterSlice";
import { setCurrentReadingBook } from "../../redux/reading/readingSlice";
import { fetchUserBooks } from "../../redux/books/booksOperations";
import {
  selectUserBooks,
  selectBooksLoading,
} from "../../redux/books/booksSelectors";
import { removeBookFromLibrary } from "../../redux/books/booksOperations";
import book1x from "../../img/dashboard/book.png";
import book2x from "../../img/dashboard/book@2x.png";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import styles from "./MyLibraryBooks.module.scss";
import BookModal from "../BookModal/BookModal";
import axios from "../../api/axiosInstance";

export default function MyLibraryBooks() {
  const dispatch = useDispatch();
  const status = useSelector(selectReadingStatus);
  const books = useSelector(selectUserBooks);
  const isLoading = useSelector(selectBooksLoading);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookDetails, setBookDetails] = useState({});
  const navigate = useNavigate();

  const statuses = [
    { value: "unread", label: "Unread" },
    { value: "reading", label: "In progress" },
    { value: "finished", label: "Done" },
    { value: "all", label: "All books" },
  ];
  const selected = statuses.find((s) => s.value === status);

  const fetchBookDetails = async (id) => {
    if (bookDetails[id]) return;

    try {
      const response = await axios.get(`/books/${id}`);
      setBookDetails((prev) => ({ ...prev, [id]: response.data }));
    } catch (err) {}
  };

  useEffect(() => {
    dispatch(fetchUserBooks());
  }, [dispatch]);

  useEffect(() => {
    books.forEach((book) => {
      fetchBookDetails(book._id);
    });
  }, [books]);

  const handleOpenModal = (book) => setSelectedBook(book);
  const handleCloseModal = () => setSelectedBook(null);

  const handleRemove = async (id) => {
    try {
      await dispatch(removeBookFromLibrary(id)).unwrap();
      toast.success("Book removed!");
    } catch (err) {
      toast.error("Failed to remove book");
    }
  };

  const goToReadingPage = () => {
    console.log("Go to reading");
  };

  const filteredBooks = books.filter((book) => {
    if (status === "all") return true;
    return book.status === status;
  });

  const handleChange = (e) => {
    dispatch(setReadingStatus(e.target.value));
  };

  return (
    <div className={styles.libraryWrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Library</h2>
        <div className={styles.customSelectWrapper}>
          <Listbox
            value={status}
            onChange={(val) => dispatch(setReadingStatus(val))}
          >
            <div className={styles.listboxContainer}>
              <Listbox.Button className={styles.listboxButton}>
                {selected.label}
                <ChevronDown className={styles.chevronIcon} />
              </Listbox.Button>
              <Listbox.Options className={styles.listboxOptions}>
                {statuses.map((item) => (
                  <Listbox.Option
                    key={item.value}
                    value={item.value}
                    className={({ active }) =>
                      `${styles.listboxOption} ${
                        active ? styles.activeOption : ""
                      }`
                    }
                  >
                    {item.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </div>
      {isLoading ? (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      ) : (
        <>
          {books.length === 0 ? (
            <div className={styles.booksCount}>
              <div className={styles.booksCountWrapper}>
                <img
                  className={styles.dashboardBookImg}
                  src={book1x}
                  srcSet={`${book1x} 1x, ${book2x} 2x`}
                  alt="book"
                />
              </div>
              <p className={styles.booksCountText}>
                <span>To start training, add</span> some of your books
                <span> or from the recommended ones</span>
              </p>
            </div>
          ) : (
            <ul className={styles.booksList}>
              {filteredBooks.map((book) => (
                <li key={book._id} className={styles.bookCard}>
                  <div className={styles.bookImageWrapper}>
                    <img
                      src={bookDetails[book._id]?.imageUrl}
                      alt={book.title}
                      className={styles.bookImage}
                      onClick={() => handleOpenModal(book)}
                    />
                  </div>

                  <div className={styles.bookInfo}>
                    <div className={styles.bookDetails}>
                      <h3 className={styles.bookTitle}>{book.title}</h3>
                      <p className={styles.bookAuthor}>{book.author}</p>
                    </div>
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemove(book._id)}
                    >
                      <svg className={styles.removeIcon}>
                        <use href="/sprite.svg#icon-trash-2" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={handleCloseModal}
          buttonText="Start reading"
          onButtonClick={() => {
            dispatch(setCurrentReadingBook(selectedBook));
            localStorage.setItem("readingBook", JSON.stringify(selectedBook));

            handleCloseModal();
            navigate("/reading");
          }}
        />
      )}
    </div>
  );
}
