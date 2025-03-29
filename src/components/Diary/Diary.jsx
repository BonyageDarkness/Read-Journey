import { useSelector, useDispatch } from "react-redux";
import styles from "./Diary.module.scss";
import {
  selectReadingDiary,
  selectCurrentReadingBook,
} from "../../redux/reading/readingSelectors";

import { deleteReadingEntry } from "../../redux/reading/readingOperations";
import { toast } from "react-toastify";
import starx1 from "../../img/diary/star.png";
import starx2 from "../../img/diary/star@2x.png";

export default function Diary({ bookId }) {
  const diary = useSelector(selectReadingDiary);
  const book = useSelector(selectCurrentReadingBook);
  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteReadingEntry({ bookId, entryId: id })).unwrap();
      toast.success("Entry deleted");
    } catch (err) {
      toast.error("Failed to delete entry");
    }
  };

  if (!diary || diary.length === 0) {
    return (
      <div className={styles.progressNone}>
        <h3 className={styles.empty}>Progress</h3>
        <p className={styles.progress}>
          Here you will see when and how much you read. To record, click on the
          red button above.
        </p>
        <div className={styles.progressBorder}>
          <img
            className={styles.prorgessImg}
            src={starx1}
            alt="star"
            srcSet={`${starx1} 1x, ${starx2} 2x`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.containerDiary}>
      <ul className={styles.diaryList}>
        {(() => {
          const shownDates = new Set();
          const dailyPages = {};

          diary.forEach((entry) => {
            const date = entry.finishReading
              ? new Date(entry.finishReading)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, ".")
              : "-";
            const pages = entry.finishPage - entry.startPage;
            dailyPages[date] = (dailyPages[date] || 0) + pages;
          });

          return [...diary].reverse().map((entry, index) => {
            const isLast = index === 0;

            const formattedDate = entry.finishReading
              ? new Date(entry.finishReading)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, ".")
              : "-";

            const showDate = !shownDates.has(formattedDate);
            shownDates.add(formattedDate);

            const pagesRead = entry.finishPage - entry.startPage;
            const durationMinutes = Math.round(
              (new Date(entry.finishReading) - new Date(entry.startReading)) /
                60000
            );

            const speed =
              entry.speed ||
              (durationMinutes > 0
                ? Math.round((pagesRead / durationMinutes) * 60)
                : 0);

            const percent = book?.totalPages
              ? ((pagesRead / book.totalPages) * 100).toFixed(1)
              : "0.0";

            return (
              <li key={entry._id} className={styles.diaryCard}>
                <div className={styles.timeline} />
                {showDate && (
                  <div className={styles.circleWrapper}>
                    <svg
                      className={`${styles.circleIcon} ${
                        !isLast ? styles.inactiveCircle : ""
                      }`}
                    >
                      <use href="/sprite.svg#icon-Frame-56" />
                    </svg>
                  </div>
                )}
                <div className={styles.content}>
                  {showDate && (
                    <div className={styles.dateRow}>
                      <span
                        className={`${styles.date} ${
                          !isLast ? styles.inactiveDate : ""
                        }`}
                      >
                        {formattedDate}
                      </span>
                      <div className={styles.left}>
                        <p className={styles.percent}>{percent}%</p>
                        <p className={styles.time}>{durationMinutes} minutes</p>
                      </div>
                    </div>
                  )}
                  {!showDate && (
                    <div className={styles.leftOnly}>
                      <p className={styles.percent}>{percent}%</p>
                      <p className={styles.time}>{durationMinutes} minutes</p>
                    </div>
                  )}

                  <div className={styles.detailsRow}>
                    <div className={styles.detailes}>
                      {showDate && (
                        <span className={styles.pages}>
                          {dailyPages[formattedDate]} pages
                        </span>
                      )}
                      <div className={styles.right}>
                        <svg className={styles.graphIcon}>
                          <use href="/sprite.svg#icon-graffic" />
                        </svg>
                        <p className={styles.speed}>
                          {speed > 0 ? `${speed} pages per hour` : "-"}
                        </p>
                      </div>
                    </div>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(entry._id)}
                    >
                      <svg className={styles.icon}>
                        <use href="/sprite.svg#icon-trash-2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            );
          });
        })()}
      </ul>
    </div>
  );
}
