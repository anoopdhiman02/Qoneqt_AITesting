import { createSlice } from "@reduxjs/toolkit";
import { onFetchMyUserFeeds } from "../../reducer/Profile/FetchUserFeeds";

const initialState = {
  data: [],
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  updatedData: [],
};

const ProfileMyFeedsSlice = createSlice({
  name: "my_user_feeds",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onFetchMyUserFeeds.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.data = Array.isArray(action.payload?.data) ? action.payload?.data : [];
        // state.updatedData = Array.isArray(action.payload?.data) ? [...state.updatedData, ...action.payload?.data] : [...state.updatedData, action.payload?.data]
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
      })
      .addCase(onFetchMyUserFeeds.rejected, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.error = true;
        state.success = false;
      });
  },
  reducers: {
    setMyUserFeedData: (state, action) => {
      state.updatedData = action.payload;
    },
    setIsLoading: (state, action)=>{
      state.isLoaded = true;
    }
  },
});
export const { setMyUserFeedData, setIsLoading } = ProfileMyFeedsSlice.actions;
export default ProfileMyFeedsSlice.reducer;
