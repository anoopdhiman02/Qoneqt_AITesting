import { createSlice } from "@reduxjs/toolkit";

import { onFetchChatUserDetailsApi } from "../../reducer/chat/ChatUserDetailsApi";

const initialState = {
  data: [],
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
};

const ChatUserDetailsSlice = createSlice({
  name: "chat_user_details",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onFetchChatUserDetailsApi.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
      })
      .addCase(onFetchChatUserDetailsApi.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default ChatUserDetailsSlice.reducer;
