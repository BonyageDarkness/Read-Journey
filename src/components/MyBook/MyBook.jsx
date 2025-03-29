import { useSelector, useDispatch } from "react-redux";
import { useState, useRef } from "react";
import styles from "./MyBook.module.scss";

import AddReading from "../AddReading/AddReading";
import Diary from "../Diary/Diary";
import Statistics from "../Statistics/Statistics";
import { startReading } from "../../redux/reading/readingOperations";
import {
  selectCurrentReadingBook,
  selectReadingDiary,
} from "../../redux/reading/readingSelectors";

export default function MyBook({ inputRef, pageInput, setPageInput }) {
  const [activeTab, setActiveTab] = useState("diary");
  const book = useSelector(selectCurrentReadingBook);
  const dispatch = useDispatch();
  const diary = useSelector(selectReadingDiary);
  const hasProgress = diary && diary.length > 0;

  const handleStartReading = async () => {
    if (!book) return;

    await dispatch(startReading({ bookId: book._id, page: 1 }));

    setTimeout(() => {
      inputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  if (!book) {
    return (
      <div className={styles.emptyState}>
        <p>Select a book from your library to start reading</p>
      </div>
    );
  }

  return (
    <div className={styles.myBookWrapper}>
      <AddReading
        ref={inputRef}
        bookId={book._id}
        pageInput={pageInput}
        setPageInput={setPageInput}
        className={styles.myBookReading}
      />

      <div className={styles.myBookTabs}>
        {" "}
        {hasProgress && (
          <div className={styles.tabs}>
            <h3 className={styles.diaryTitle}>
              {activeTab === "diary" ? "Diary" : "Statistics"}
            </h3>

            <div className={styles.buttonIcons}>
              <button
                className={`${styles.tabButton} ${
                  activeTab === "diary" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("diary")}
              >
                <svg className={styles.icon}>
                  <use href="/sprite.svg#icon-hourglass" />
                </svg>
              </button>

              <button
                className={`${styles.tabButton} ${
                  activeTab === "statistics" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("statistics")}
              >
                <svg className={styles.icon}>
                  <use href="/sprite.svg#icon-pie-chart" />
                </svg>
              </button>
            </div>
          </div>
        )}
        {activeTab === "statistics" && (
          <p className={styles.progressText}>
            Each page, each chapter is a new round of knowledge, a new step
            towards understanding. By rewriting statistics, we create our own
            reading history.
          </p>
        )}
        <div className={styles.tabContent}>
          {activeTab === "diary" ? (
            <Diary bookId={book._id} />
          ) : (
            <Statistics bookId={book._id} />
          )}
        </div>
      </div>
    </div>
  );
}
