import { createSlice } from "@reduxjs/toolkit";
import { onFetchComments } from "../../reducer/post/FetchComments";

const fetchCommentsSlice = createSlice({
  name: "comments",
  initialState: {
    data: [],
    combinedData: [],
    success: false,
    message: "",
    error: false,
    error_message: "",
    isLoaded: false,
    called: false,
    status: 0,
  },
  reducers: {
    ClearData: (state, action) => {
      state.combinedData = action.payload;
    },
    UpdateData: (state, action) => {
      state.data = action.payload;
    },
    updateReplyData: (state, action) => {
      state.data = action.payload;
    },
    commentLoading: (state, action) => {
      state.isLoaded = action.payload;
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onFetchComments.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.combinedData = [
          ...state.combinedData,
          ...action?.payload?.data,
        ];
        state.data = action?.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.message;
      })
      .addCase(onFetchComments.rejected, (state: any, action) => {
        state.data = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export const { updateReplyData, ClearData, UpdateData, commentLoading } = fetchCommentsSlice.actions;

export default fetchCommentsSlice.reducer;
