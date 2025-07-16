import { onFetchChannelGroupInfo } from "@/redux/reducer/channel/ChannelGroupInfo";
import { onFetchChannelList } from "@/redux/reducer/channel/ChannelList";
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

const ChannelGroupInfoSlice = createSlice({
  name: "channel_group_info",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onFetchChannelGroupInfo.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action?.payload?.data?.qoneqtdb_loop_group[0];
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(onFetchChannelGroupInfo.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default ChannelGroupInfoSlice.reducer;
