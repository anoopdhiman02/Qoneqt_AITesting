import { createSlice } from "@reduxjs/toolkit";
import { onGetFollowers } from "../../reducer/Profile/GetFollowerList";

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

const getFollowerListSlice = createSlice({
  name: "get_follower",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onGetFollowers.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.data = action.payload?.lastCount == 0 ? [...action.payload?.data] : [...state.data, ...action.payload?.data];
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.lastCount = action.payload?.lastCount;
        state.lastData = Array.isArray(action.payload?.data) ? action.payload?.data.length : 0;
      })
      .addCase(onGetFollowers.rejected, (state, action) => {
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
    loadingFollowerState: (state, action) => {
      state.isLoaded = action.payload;
    },
  },
});

export const { resetState, loadingFollowerState } = getFollowerListSlice.actions;
export default getFollowerListSlice.reducer;
