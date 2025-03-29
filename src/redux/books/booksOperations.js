import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { setAuthToken } from "../../api/axiosInstance";

export const fetchRecommendedBooks = createAsyncThunk(
  "books/fetchRecommendedBooks",
  async (
    { page = 1, limit = 5, title = "", author = "" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/books/recommend", {
        params: { page, limit, title, author },
      });

      return {
        results: response.data.results,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error("📛 fetchRecommendedBooks error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const fetchUserBooks = createAsyncThunk(
  "books/fetchUserBooks",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }

      const response = await axios.get("/books/own");
      return response.data;
    } catch (error) {
      console.error("📛 fetchUserBooks error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user books"
      );
    }
  }
);

export const addBookToLibrary = createAsyncThunk(
  "books/addBookToLibrary",
  async (bookData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }

      const response = await axios.post("/books/add", bookData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add book"
      );
    }
  }
);
export const addRecommendedBookById = createAsyncThunk(
  "books/addRecommendedBookById",
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/books/add/${bookId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add recommended book"
      );
    }
  }
);

export const removeBookFromLibrary = createAsyncThunk(
  "books/removeBookFromLibrary",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/books/remove/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove book"
      );
    }
  }
);
