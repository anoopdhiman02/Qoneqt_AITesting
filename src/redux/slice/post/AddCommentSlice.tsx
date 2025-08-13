import { createSlice } from "@reduxjs/toolkit";
import { onAddComment } from "../../reducer/post/AddComment";

const addCommentSlice = createSlice({
  name: "add_comment",
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
    // You can include synchronous actions directly in createSlice
  },
  extraReducers: (builder) => {
    builder

      .addCase(onAddComment.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action?.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.message;
      })
      .addCase(onAddComment.rejected, (state, action) => {
        state.data = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export default addCommentSlice.reducer;
