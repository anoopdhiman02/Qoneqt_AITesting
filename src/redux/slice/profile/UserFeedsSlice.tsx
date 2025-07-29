import { createSlice } from "@reduxjs/toolkit";
import { onFetchUserFeeds } from "../../reducer/Profile/FetchUserFeeds";

const initialState = {
  data: [],
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  updatedData: [],
};

const myFeedsSlice = createSlice({
  name: "user_feeds",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onFetchUserFeeds.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.data = action.payload?.data;
        state.updatedData = action.payload?.last_count == 0 ? [...action.payload?.data] : [...state.updatedData,...action.payload?.data]
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
      })
      .addCase(onFetchUserFeeds.rejected, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.error = true;
        state.success = false;
      });
  },
  reducers: {
    setUserFeedData: (state, action) => {
      state.updatedData = action.payload;
    },
    setUserFeedLoading: (state, action) => {
      state.isLoaded = true;
    },
  },
});
export const { setUserFeedData, setUserFeedLoading } = myFeedsSlice.actions;
export default myFeedsSlice.reducer;
