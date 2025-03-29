// components/FinishModal/FinishModal.jsx
import { useEffect } from "react";
import styles from "./FinishModal.module.scss";
import img from "../../img/dashboard/book.png";
import img2x from "../../img/dashboard/book@2x.png";
import imgBig from "../../img/dashboard/book-big.png";
import imgBig2x from "../../img/dashboard/book-big@2x.png";

export default function FinishModal({ onClose }) {
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
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          <svg className={styles.icon}>
            <use href="/sprite.svg#icon-x" />
          </svg>
        </button>
        <div className={styles.complete}>
          <img
            src={img}
            srcSet={`${img} 1x, ${img2x} 2x`}
            alt="book"
            className={styles.completeIconLike}
          />
          <img
            src={imgBig}
            srcSet={`${imgBig} 1x, ${imgBig2x} 2x`}
            alt="book"
            className={styles.completeIconLikeTablet}
          />
          <h2>The book is read</h2>
          <p>
            It was an <span className={styles.span}>exciting journey</span> ,
            where each page revealed new horizons, and the characters became
            inseparable friends.
          </p>
        </div>
      </div>
    </div>
  );
}
