import { createSlice } from "@reduxjs/toolkit";
import { onFollowUser } from "../../reducer/Profile/FollowUser";

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  message: "",
};

const followUserSlice = createSlice({
  name: "follow_user",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onFollowUser.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload.data;
        state.success = action.payload.success;
        state.error = false;
        state.error_message = "";
        state.message = action.payload.message;
      })
      .addCase(onFollowUser.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default followUserSlice.reducer;
