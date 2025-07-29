import { createSlice } from "@reduxjs/toolkit";

import { onFetchMessageListApi } from "../../reducer/chat/FetchMessageList";

const initialState = {
  data: [],
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
};

const MessageListSlice = createSlice({
  name: "message_list",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onFetchMessageListApi.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data||[];
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
      })
      .addCase(onFetchMessageListApi.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default MessageListSlice.reducer;
