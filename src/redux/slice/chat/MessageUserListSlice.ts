import { onFetchMessageUserListApi } from "@/redux/reducer/chat/FetchMessageUserList";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
};

const MessageUserListSlice = createSlice({
  name: "message_user",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onFetchMessageUserListApi.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
      })
      .addCase(onFetchMessageUserListApi.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default MessageUserListSlice.reducer;
