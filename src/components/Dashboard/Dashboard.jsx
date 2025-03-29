import styles from "./Dashboard.module.scss";
import book1x from "../../img/dashboard/book.png";
import book2x from "../../img/dashboard/book@2x.png";
import { useDispatch } from "react-redux";
import { useState, useRef } from "react";
import { setFilters } from "../../redux/filters/filtersSlice";
import AddBookForm from "../AddBookForm/AddBookForm";
import RecommendedBlock from "../RecommendedBlock/RecommendedBlock";
import MyBook from "../MyBook/MyBook";

export default function Dashboard({ page, inputRef, pageInput, setPageInput }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const dispatch = useDispatch();

  const handleSearch = () => {
    dispatch(setFilters({ title, author }));
  };

  return (
    <div className={styles.dashboardContainer}>
      {page === "recommended" && (
        <>
          {/* FILTER FORM */}
          <form
            className={styles.filterForm}
            onSubmit={(e) => e.preventDefault()}
          >
            <p className={styles.filterFormTitle}>Filters:</p>

            <div className={styles.filterInputWrapper}>
              <span className={styles.filterLabel}>Book title:</span>
              <input
                type="text"
                placeholder="Enter text"
                className={styles.filterInput}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className={styles.filterInputWrapper}>
              <span className={styles.filterLabel}>The author:</span>
              <input
                type="text"
                placeholder="Enter text"
                className={styles.filterInput}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={styles.filterSubmit}
              onClick={handleSearch}
            >
              To apply
            </button>
          </form>

          {/* START YOUR WORKOUT */}
          <div className={styles.dashboardInfo}>
            <p className={styles.dashboardInfoTitle}>Start your workout</p>

            <ul className={styles.dashboardInfoList}>
              <li className={styles.dashboardInfoItem}>
                <div className={styles.numberCircle}>1</div>
                <p className={styles.dashboardInfoText}>
                  <span className={styles.dashboardInfoItemTitle}>
                    Create a personal library:
                  </span>{" "}
                  add the books you intend to read to it.
                </p>
              </li>
              <li className={styles.dashboardInfoItem}>
                <div className={styles.numberCircle}>2</div>
                <p className={styles.dashboardInfoText}>
                  <span className={styles.dashboardInfoItemTitle}>
                    Create your first workout:
                  </span>{" "}
                  define a goal, choose a period, start training.
                </p>
              </li>
            </ul>

            <div className={styles.dashboardLink}>
              <p className={styles.switch}>
                <a href="/library">My library</a>
              </p>
              <a href="/library" className={styles.switchIconLink}>
                <svg className={styles.switchIcon}>
                  <use href="/sprite.svg#icon-log-in" />
                </svg>
              </a>
            </div>
          </div>

          {/* BOOK IMAGE */}
          <div className={styles.dashboardBook}>
            <img
              className={styles.dashboardBookImg}
              src={book1x}
              srcSet={`${book1x} 1x, ${book2x} 2x`}
              alt="book"
            />
            <p className={styles.dashboardBookText}>
              "Books are{" "}
              <span className={styles.dashboardBookspan}>windows</span> to the
              world, and reading is a journey into the unknown."
            </p>
          </div>
        </>
      )}

      {page === "library" && (
        <>
          <AddBookForm />
          <RecommendedBlock />
        </>
      )}
      {page === "reading" && (
        <>
          <MyBook
            inputRef={inputRef}
            pageInput={pageInput}
            setPageInput={setPageInput}
          />
        </>
      )}
    </div>
  );
}
