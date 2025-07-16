import { createSlice } from "@reduxjs/toolkit";
import { fetchMyProfileDetails } from "../../reducer/Profile/FetchProfileDetailsApi";

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
};

const ProfileMyDetailsSlice = createSlice({
  name: "my_profile_details",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfileDetails.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action?.payload?.success;
        state.error = false;
        state.error_message = "";
      })
      .addCase(fetchMyProfileDetails.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },

  reducers: {
    updateProfileData: (state, action) => {
      state.data = action.payload.data;
    },
  },
});
export const { updateProfileData } = ProfileMyDetailsSlice.actions;
export default ProfileMyDetailsSlice.reducer;
