import { onFetchChannelInfo } from "@/redux/reducer/channel/ChannelInfo";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  success: false,
  message: "",
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  status: 0,
};

const ChannelInfoSlice = createSlice({
  name: "channel_info",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onFetchChannelInfo.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action?.payload?.data?.qoneqtdb_channels[0];
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(onFetchChannelInfo.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default ChannelInfoSlice.reducer;
