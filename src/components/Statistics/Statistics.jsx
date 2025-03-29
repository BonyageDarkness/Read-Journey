import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  selectReadingDiary,
  selectCurrentReadingBook,
} from "../../redux/reading/readingSelectors";
import styles from "./Statistics.module.scss";

export default function Statistics() {
  const diary = useSelector(selectReadingDiary);
  const book = useSelector(selectCurrentReadingBook);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  if (!diary || diary.length === 0 || !book) return null;

  const totalPages = book.totalPages || 1;

  const totalReadPages = diary.reduce((sum, entry) => {
    return sum + (entry.finishPage - entry.startPage);
  }, 0);

  const progressPercent = Math.min(
    (totalReadPages / totalPages) * 100,
    100
  ).toFixed(2);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedPercent(progressPercent);
    }, 10);

    return () => clearTimeout(timeout);
  }, [progressPercent]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.progressWrapper}>
        <div className={styles.circleWrapper}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 116 116"
            fill="none"
            className={styles.circleSvg}
          >
            <circle
              cx="58"
              cy="59"
              r="48"
              stroke="#1F1F1F"
              strokeWidth="10"
              fill="none"
            />

            <circle
              cx="58"
              cy="59"
              r="48"
              stroke="#30B94D"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="301.59"
              strokeDashoffset={301.59 * (1 - animatedPercent / 100)}
              transform="rotate(-90 58 59)"
              style={{ transition: "stroke-dashoffset 0.4s ease-in-out" }}
            />
          </svg>{" "}
          <div className={styles.percentageText}>
            {`${Math.floor(animatedPercent)}%`}
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.box} />
        <div className={styles.legendPercent}>
          <span className={styles.percent}>{progressPercent}%</span>
          <span className={styles.pages}>{totalReadPages} pages read</span>
        </div>
      </div>
    </div>
  );
}
