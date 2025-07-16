import { createSlice } from "@reduxjs/toolkit";
import { onJoinRequestUpdate } from "@/redux/reducer/group/JoinRequestUpdate";

const joinRequestUpdateSlice = createSlice({
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(onJoinRequestUpdate.fulfilled, (state, action) => {
        state.data = action?.payload?.data;
        state.success = action?.payload?.success;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(onJoinRequestUpdate.rejected, (state, action: any) => {
        state.data = [];
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
        state.message = action?.payload?.message;
      });
  },
});
export default joinRequestUpdateSlice.reducer;
