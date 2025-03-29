import { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import styles from "./ReadingPage.module.scss";
import { toast } from "react-toastify";

import Header from "../../components/Header/Header";
import Dashboard from "../../components/Dashboard/Dashboard";
import CurrentBook from "../../components/CurrentBook/CurrentBook";

import {
  getReadingProgress,
  startReading,
  stopReading,
} from "../../redux/reading/readingOperations";
import { setCurrentReadingBook } from "../../redux/reading/readingSlice";
import { selectUserBooks } from "../../redux/books/booksSelectors";
import {
  selectCurrentReadingBook,
  selectReadingStatus,
  selectCurrentProgress,
} from "../../redux/reading/readingSelectors";

export default function ReadingPage() {
  const readingStatus = useSelector(selectReadingStatus);
  const isReading = readingStatus === "active";
  const [pageInput, setPageInput] = useState("");
  const currentProgress = useSelector(selectCurrentProgress);

  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const userBooks = useSelector(selectUserBooks);
  const currentBook = useSelector(selectCurrentReadingBook);

  useEffect(() => {
    if (!currentBook) {
      const saved = localStorage.getItem("readingBook");
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch(setCurrentReadingBook(parsed));
      }
    }
  }, [currentBook, dispatch]);

  useEffect(() => {
    if (currentBook?._id) {
      dispatch(getReadingProgress(currentBook._id));
    }
  }, [currentBook, dispatch]);

  const handleStartReading = async () => {
    if (!currentBook) return;

    const pageNum = parseInt(pageInput);

    if (!pageInput || isNaN(pageNum) || pageNum <= 0) {
      toast.error("Enter a valid page number");

      // Прокрутка, если ввод невалиден
      setTimeout(() => {
        inputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);

      return;
    }

    if (pageNum > currentBook.totalPages) {
      toast.error("Page number exceeds total pages");

      setTimeout(() => {
        inputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);

      return;
    }

    try {
      if (!isReading) {
        await dispatch(
          startReading({ bookId: currentBook._id, page: pageNum })
        ).unwrap();
        toast.success("Started reading");
      } else {
        if (pageNum <= currentProgress?.startPage) {
          toast.error("The finish page can't be less than the start page");

          setTimeout(() => {
            inputRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 100);

          return;
        }

        await dispatch(
          stopReading({ bookId: currentBook._id, page: pageNum })
        ).unwrap();
        toast.success("Stopped reading");
      }
    } catch (err) {
      toast.error("Error during reading action");
    }
  };

  return (
    <div className={styles.containerReading}>
      <Header />
      <div className={styles.contentReading}>
        <Dashboard
          page="reading"
          inputRef={inputRef}
          pageInput={pageInput}
          setPageInput={setPageInput}
        />

        <CurrentBook book={currentBook} onReadClick={handleStartReading} />
      </div>
    </div>
  );
}
