import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import styles from "./RecommendedPage.module.scss";

import Header from "../../components/Header/Header";
import Dashboard from "../../components/Dashboard/Dashboard";
import RecommendedBooks from "../../components/RecommendedBooks/RecommendedBooks";

export default function RecommendedPage() {
  return (
    <>
      <div className={styles.containerRecommended}>
        <Header />
        <div className={styles.contentRecommended}>
          <Dashboard page="recommended" />

          <RecommendedBooks />
          <Suspense fallback={<div>Загрузка...</div>}></Suspense>
        </div>
      </div>
    </>
  );
}
