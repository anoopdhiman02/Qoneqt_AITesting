import { createSlice } from "@reduxjs/toolkit";
import { onChannelRoleUpdate } from "../../reducer/channel/ChannelMembersRoleUpdate";

const channelRoleUpdateSlice = createSlice({
  name: "channel_role_update",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(onChannelRoleUpdate.fulfilled, (state, action) => {
        state.data = action?.payload;
        state.success = true;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
      })

      .addCase(onChannelRoleUpdate.rejected, (state, action) => {
        state.data = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export default channelRoleUpdateSlice.reducer;
