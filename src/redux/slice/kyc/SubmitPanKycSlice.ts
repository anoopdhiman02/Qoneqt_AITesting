import { onSubmitPanKyc } from "@/redux/reducer/kyc/SubmitPanKyc";
import { createSlice } from "@reduxjs/toolkit";

const submitPanKycSlice = createSlice({
  name: "submit_pan_kyc",
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

      .addCase(onSubmitPanKyc.fulfilled, (state, action) => {
        state.data = action?.payload.data;
        state.success = action?.payload.success;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload.message;
      })
      .addCase(onSubmitPanKyc.rejected, (state, action) => {
        state.data = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export default submitPanKycSlice.reducer;
