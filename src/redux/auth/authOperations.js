import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { setAuthToken } from "../../api/axiosInstance";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/users/signup", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/users/signin", userData);
      console.log("API Response:", response.data);

      setAuthToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ name: response.data.name, email: response.data.email })
      );

      return {
        user: { name: response.data.name, email: response.data.email },
        token: response.data.token,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);
