import { useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "./AddReading.module.scss";
import {
  startReading,
  stopReading,
} from "../../redux/reading/readingOperations";
import {
  selectReadingStatus,
  selectCurrentProgress,
  selectCurrentReadingBook,
} from "../../redux/reading/readingSelectors";
import FinishModal from "../FinishModal/FinishModal";

const AddReading = forwardRef(({ bookId, pageInput, setPageInput }, ref) => {
  const dispatch = useDispatch();
  const [showFinishModal, setShowFinishModal] = useState(false);

  const readingStatus = useSelector(selectReadingStatus);
  const isReading = readingStatus === "active";
  const currentBook = useSelector(selectCurrentReadingBook);
  const currentProgress = useSelector(selectCurrentProgress);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentBook) {
      toast.error("No current book");
      return;
    }

    const pageNum = parseInt(pageInput);

    if (!pageInput || isNaN(pageNum) || pageNum <= 0) {
      toast.error("Enter a valid page number");
      return;
    }

    if (pageNum > currentBook.totalPages) {
      toast.error("Page number exceeds total pages");
      return;
    }

    try {
      if (!isReading) {
        await dispatch(startReading({ bookId, page: pageNum })).unwrap();
        toast.success("Started reading");
      } else {
        if (pageNum <= currentProgress?.startPage) {
          toast.error("The finish page can't be less than the start page");
          return;
        }

        const result = await dispatch(
          stopReading({ bookId, page: pageNum })
        ).unwrap();

        toast.success("Stopped reading");

        if (
          result.status === "finished" ||
          pageNum === currentBook.totalPages
        ) {
          setShowFinishModal(true);
        }
      }

      setPage("");
    } catch (error) {
      toast.error(error || "Something went wrong");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form} ref={ref}>
        <p className={styles.label}>
          {isReading ? "Stop page:" : "Start page:"}
        </p>
        <div className={styles.readingInputWrapper}>
          <span className={styles.readingLabel}>Page number:</span>
          <input
            type="text"
            value={pageInput}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) setPageInput(value);
            }}
            className={styles.readingInput}
            placeholder="0"
          />
        </div>

        <button type="submit" className={styles.button}>
          {isReading ? "To stop" : "To start"}
        </button>
      </form>

      {/* Здесь модалка */}
      {showFinishModal && (
        <FinishModal onClose={() => setShowFinishModal(false)} />
      )}
    </>
  );
});
export default AddReading;
