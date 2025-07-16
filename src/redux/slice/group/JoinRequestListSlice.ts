import { createSlice } from "@reduxjs/toolkit";
import { onJoinRequestList } from "@/redux/reducer/group/JoinRequestList";

const joinRequestListSlice = createSlice({
  name: "join_group",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    message: "",
  },
  reducers: {
    updateJoinRequestList: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onJoinRequestList.fulfilled, (state, action) => {
        state.data = action?.payload?.data;
        state.success = action?.payload?.success;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(onJoinRequestList.rejected, (state, action: any) => {
        state.data = [];
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
        state.message = action?.payload?.message;
      });
  },
});
export const { updateJoinRequestList } = joinRequestListSlice.actions;
export default joinRequestListSlice.reducer;
