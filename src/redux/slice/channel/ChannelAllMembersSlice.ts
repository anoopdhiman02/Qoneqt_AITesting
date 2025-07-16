import { createSlice } from "@reduxjs/toolkit";
import { onFetchChannelAllMembers, onFetchChannelMembers } from "../../reducer/channel/ChannelMembers";

const channelAllMembersSlice = createSlice({
  name: "channel_Allmembers",
  initialState: {
    data: [],
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
      .addCase(onFetchChannelAllMembers.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action?.payload?.data?.data;
        state.success = action.payload?.data?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.data?.data?.message;
      })

      .addCase(onFetchChannelAllMembers.rejected, (state, action) => {
        state.data = [];
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export default channelAllMembersSlice.reducer;
