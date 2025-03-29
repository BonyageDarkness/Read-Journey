import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import styles from "./LibraryPage.module.scss";

import Header from "../../components/Header/Header";
import Dashboard from "../../components/Dashboard/Dashboard";

import MyLibraryBooks from "../../components/Reading/MyLibraryBooks";

export default function LibraryPage() {
  return (
    <div className={styles.containerLibrary}>
      <Header />
      <div className={styles.contentLibrary}>
        <Dashboard page="library" />
        <MyLibraryBooks />
      </div>
    </div>
  );
}
