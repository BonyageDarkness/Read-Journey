// redux/reading/readingOperations.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

export const startReading = createAsyncThunk(
  "reading/startReading",
  async ({ bookId, page }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/books/reading/start", {
        id: bookId,
        page,
      });
      return response.data;
    } catch (err) {
      console.error("📛 startReading error:", err.response?.data);
      return rejectWithValue(err.response?.data?.message || "Start failed");
    }
  }
);

export const stopReading = createAsyncThunk(
  "reading/stopReading",
  async ({ bookId, page }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/books/reading/finish", {
        id: bookId,
        page,
      });
      return response.data;
    } catch (err) {
      console.error("📛 stopReading error:", err.response?.data);
      return rejectWithValue(err.response?.data?.message || "Stop failed");
    }
  }
);

export const deleteReadingEntry = createAsyncThunk(
  "reading/deleteReadingEntry",
  async ({ bookId, entryId }, { rejectWithValue }) => {
    try {
      await axios.delete("/books/reading", {
        params: { bookId, readingId: entryId },
      });
      return entryId;
    } catch (err) {
      console.error("📛 deleteReadingEntry error:", err.response?.data);
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

export const getReadingProgress = createAsyncThunk(
  "reading/getReadingProgress",
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/books/${bookId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load");
    }
  }
);
