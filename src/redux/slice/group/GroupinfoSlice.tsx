import { createSlice } from "@reduxjs/toolkit";
import { GrounInforeq } from "@/redux/reducer/group/GroupInfo";


const GroupInfoSlice = createSlice({
  name: "group_Info",
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
      .addCase(GrounInforeq.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action?.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.message;
      })
      .addCase(GrounInforeq.rejected, (state, action) => {
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export default GroupInfoSlice.reducer;
