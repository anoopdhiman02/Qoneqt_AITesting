import { onFetchChannelList } from "@/redux/reducer/channel/ChannelList";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  success: false,
  message: "",
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  status: 0,
};

const ChannelListSlice = createSlice({
  name: "channels_list",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onFetchChannelList.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action?.payload?.data?.channelGroups;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.message;
      })
      .addCase(onFetchChannelList.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default ChannelListSlice.reducer;
