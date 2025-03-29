// redux/reading/readingSelectors.js
export const selectCurrentReadingBook = (state) => state.reading.currentBook;
export const selectReadingDiary = (state) => state.reading.diary;
export const selectReadingStatistics = (state) => state.reading.statistics;
export const selectReadingLoading = (state) => state.reading.isLoading;
export const selectReadingError = (state) => state.reading.error;
export const selectCurrentProgress = (state) => state.reading.currentProgress;
export const selectReadingStatus = (state) => state.reading.readingStatus;
