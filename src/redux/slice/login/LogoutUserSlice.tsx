import { LoginUserApi } from "@/redux/reducer/login/LoginUser";
import { OnLogoutReq } from "@/redux/reducer/login/LogoutReq";
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
  isOldUser: false,
};

const LogoutUserSlice = createSlice({
  name: "logout_user",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(OnLogoutReq.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.message;
        state.isOldUser = action.payload?.login;
      })
      .addCase(OnLogoutReq.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default LogoutUserSlice.reducer;
