import { VerifyOtpApi } from "@/redux/reducer/login/VerifyOtpApi";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  token: {},
  success: false,
  message: "",
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  status: 0,
};

const VerifyOtpSlice = createSlice({
  name: "login_user",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(VerifyOtpApi.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.message;
        state.token = action.payload?.token;
      })
      .addCase(VerifyOtpApi.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: {
    updateIsloaded: (State, action) => {
      State.isLoaded = action.payload;
    },
  },
});
export const { updateIsloaded } = VerifyOtpSlice.actions;
export default VerifyOtpSlice.reducer;
