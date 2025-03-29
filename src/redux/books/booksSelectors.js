// redux/books/booksSelectors.js
export const selectBooks = (state) => state.books.items;
export const selectBooksLoading = (state) => state.books.isLoading;
export const selectBooksError = (state) => state.books.error;
export const selectCurrentPage = (state) => state.books.currentPage;
export const selectTotalPages = (state) => state.books.totalPages;
export const selectUserBooks = (state) => state.books.userBooks;
