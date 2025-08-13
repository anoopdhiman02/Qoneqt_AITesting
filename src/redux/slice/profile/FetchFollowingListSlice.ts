import { onFetchFollowings } from "@/redux/reducer/Profile/FetchFollowingList";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  lastCount: 0,
  lastData: 0,
};

const followingListSlice = createSlice({
  name: "following_list",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onFetchFollowings.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.data = action.payload?.lastCount == 0 ? [...action.payload?.data] : [...state.data, ...action.payload?.data];
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.lastCount = action.payload?.lastCount;
        state.lastData = Array.isArray(action.payload?.data) ? action.payload?.data.length : 0;
      })
      .addCase(onFetchFollowings.rejected, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: {
    resetState: (state) => {
      state = initialState;
    },
    loadingState: (state, action) => {
      state.isLoaded = action.payload;
    },
  },
});

export const { resetState, loadingState } = followingListSlice.actions;
export default followingListSlice.reducer;
