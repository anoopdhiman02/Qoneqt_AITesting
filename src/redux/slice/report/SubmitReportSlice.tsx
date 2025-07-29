import { createSlice } from "@reduxjs/toolkit";
import { onSubmitReport } from "../../reducer/report/SubmitReport";

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  message: "",
};

const submitReportSlice = createSlice({
  name: "submit_report",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onSubmitReport.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.message = action.payload?.message;
      })
      .addCase(onSubmitReport.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default submitReportSlice.reducer;
