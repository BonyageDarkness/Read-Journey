import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  readingStatus: "all",
};

const readingFilterSlice = createSlice({
  name: "readingFilter",
  initialState,
  reducers: {
    setReadingStatus: (state, action) => {
      state.readingStatus = action.payload;
    },
  },
});

export const { setReadingStatus } = readingFilterSlice.actions;
export default readingFilterSlice.reducer;
