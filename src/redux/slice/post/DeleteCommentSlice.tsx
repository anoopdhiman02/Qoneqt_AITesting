import { onCommentDelete } from "@/redux/reducer/post/CommentDelete";
import { createSlice } from "@reduxjs/toolkit";

const deleteCommentSlice = createSlice({
  name: "delete_comment",
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

      .addCase(onCommentDelete.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action?.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.data?.message;
      })
      .addCase(onCommentDelete.rejected, (state, action) => {
        state.data = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export default deleteCommentSlice.reducer;
