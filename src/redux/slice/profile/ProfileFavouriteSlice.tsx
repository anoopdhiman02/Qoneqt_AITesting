import { onProfileFavouriteUpdate } from "@/redux/reducer/Profile/AddPreference";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  message: "",
};

const profileFavouriteSlice = createSlice({
  name: "profile_favourite_update",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onProfileFavouriteUpdate.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.message = action.payload?.message;
      })
      .addCase(onProfileFavouriteUpdate.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default profileFavouriteSlice.reducer;
