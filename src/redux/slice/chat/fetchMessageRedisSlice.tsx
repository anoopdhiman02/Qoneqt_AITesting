import { createSlice } from "@reduxjs/toolkit";

import { onFetchMessageRedisListApi } from "../../reducer/chat/FetchMessageRedis";

const initialState = {
  data: [],
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
};

const MessageRedisListSlice = createSlice({
  name: "message_redis_list",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onFetchMessageRedisListApi.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
      })
      .addCase(onFetchMessageRedisListApi.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default MessageRedisListSlice.reducer;
