import { createSlice } from "@reduxjs/toolkit";
import {} from "../../reducer/post/PostDetailsApi";
import { onFetchEventPostDetail } from "@/redux/reducer/post/EventPostDetailsApi";
import { stat } from "react-native-fs";

const eventPostDetailSlice = createSlice({
  name: "event_post_details",
  initialState: {
    data: {},
    success: false,
    message: "",
    error: false,
    error_message: "",
    isLoaded: false,
    called: false,
    status: 0,
  },
  reducers: {
    ClearEventDetailsData: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onFetchEventPostDetail.pending, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = {};
        state.error = false;
      })
      .addCase(onFetchEventPostDetail.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.data = action?.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.message;
      })
      .addCase(onFetchEventPostDetail.rejected, (state, action) => {
        state.data = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});
export const{ ClearEventDetailsData}=eventPostDetailSlice.actions
export default eventPostDetailSlice.reducer;
