// redux/reading/readingSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  startReading,
  stopReading,
  getReadingProgress,
  deleteReadingEntry,
} from "./readingOperations";

const initialState = {
  currentBook: null,
  diary: [],
  statistics: null,
  isLoading: false,
  error: null,
  currentProgress: null,
  readingStatus: "idle",
};

const readingSlice = createSlice({
  name: "reading",
  initialState,
  reducers: {
    setCurrentReadingBook: (state, action) => {
      state.currentBook = action.payload;
    },
    clearReadingState: (state) => {
      state.currentBook = null;
      state.diary = [];
      state.statistics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startReading.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startReading.fulfilled, (state, action) => {
        state.isLoading = false;

        state.currentProgress = action.payload;
        state.readingStatus = "active"; // ✅ активное чтение
      })

      .addCase(startReading.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(stopReading.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(stopReading.fulfilled, (state, action) => {
        state.isLoading = false;
        state.diary = action.payload.progress;
        state.statistics = action.payload.statistics || null;
        state.currentProgress = null;
        state.readingStatus = "finished"; // ✅ чтение завершено
      })

      .addCase(stopReading.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteReadingEntry.fulfilled, (state, action) => {
        state.diary = state.diary.filter(
          (entry) => entry._id !== action.payload
        );
      })
      .addCase(getReadingProgress.fulfilled, (state, action) => {
        const book = action.payload;
        state.diary = book.progress || [];
        state.currentProgress =
          book.progress.find((p) => p.status === "active") || null;
        state.readingStatus = state.currentProgress ? "active" : "finished";
      });
  },
});

export const { setCurrentReadingBook, clearReadingState } =
  readingSlice.actions;
export default readingSlice.reducer;
