import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRecommendedBooks,
  fetchUserBooks,
  addBookToLibrary,
  removeBookFromLibrary,
  addRecommendedBookById,
} from "./booksOperations";

const booksSlice = createSlice({
  name: "books",
  initialState: {
    items: [],
    userBooks: [],
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
    currentReadingBook: null,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedBooks.fulfilled, (state, action) => {
        state.items = action.payload.results;
        state.totalPages = action.payload.totalPages;
        state.isLoading = false;
      })
      .addCase(fetchRecommendedBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserBooks.fulfilled, (state, action) => {
        state.userBooks = action.payload;
      })
      .addCase(addBookToLibrary.fulfilled, (state, action) => {
        state.userBooks.push(action.payload);
      })
      .addCase(addRecommendedBookById.fulfilled, (state, action) => {
        state.userBooks.push(action.payload);
      })

      .addCase(removeBookFromLibrary.fulfilled, (state, action) => {
        state.userBooks = state.userBooks.filter(
          (book) => book._id !== action.payload
        );
      });
  },
});

export const { setCurrentPage } = booksSlice.actions;
export default booksSlice.reducer;
