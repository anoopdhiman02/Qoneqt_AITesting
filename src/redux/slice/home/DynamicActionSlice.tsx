import { DynamicActionReq } from "@/redux/reducer/home/DynamicActionReq";
import { createSlice } from "@reduxjs/toolkit";

const DynamicActionSlice = createSlice({
  name: "Dynamic_Action",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    message: "",
  },
  reducers: {
    // You can include synchronous actions directly in createSlice
  },
  extraReducers: (builder) => {
    builder
      .addCase(DynamicActionReq.fulfilled, (state, action) => {
        state.data = action?.payload?.data;
        state.success = action?.payload?.success;
        state.message = action.payload.message;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
      })
      .addCase(DynamicActionReq.rejected, (state, action) => {
        state.data = [];
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export default DynamicActionSlice.reducer;
