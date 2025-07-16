import { LoginUserApi } from "@/redux/reducer/login/LoginUser";
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
  isFirstTimePopup: false,
  accessToken:'',
};

const LoginUserSlice = createSlice({
  name: "login_user",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(LoginUserApi.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.message;
        state.isOldUser = action.payload?.login;
      })
      .addCase(LoginUserApi.rejected, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: {
    setIsFirstTime:(state, action)=>{
      state.isFirstTimePopup= action.payload
    },
    setUserData:(state, action)=>{
      state.data = action.payload
    },
    setAccessToken:(state, action)=>{
      state.accessToken = action.payload
    },
    setLoginLoader:(state, action)=>{
      state.isLoaded = action.payload
    },
    updateLoginData:(state, action)=>{
      state.data = action.payload.data
    }
  },
});

export const {setIsFirstTime, setUserData, setAccessToken, setLoginLoader,updateLoginData} = LoginUserSlice.actions;

export default LoginUserSlice.reducer;
