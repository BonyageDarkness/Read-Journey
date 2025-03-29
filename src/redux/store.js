import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import booksReducer from "./books/booksSlice";
import filtersReducer from "./filters/filtersSlice";
import readingFilterReducer from "./readingFilter/readingFilterSlice";
import readingReducer from "./reading/readingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    filters: filtersReducer,
    readingFilter: readingFilterReducer,
    reading: readingReducer,
  },
});

export default store;
