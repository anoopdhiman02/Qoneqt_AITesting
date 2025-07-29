import { createSlice } from "@reduxjs/toolkit";
import { fetchProfileDetails } from "../../reducer/Profile/FetchProfileDetailsApi";

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
};

const profileDetailsSlice = createSlice({
  name: "profile_details",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileDetails.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action?.payload?.success;
        state.error = false;
        state.error_message = "";
      })
      .addCase(fetchProfileDetails.rejected, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers:{
    setProfileLoadingData : (state, action) =>{
      state.isLoaded = true;
    },
    updateProfileViewData : (state, action) =>{
      state.data = action.payload;
    }
  },
});
export const {setProfileLoadingData,updateProfileViewData} = profileDetailsSlice.actions;
export default profileDetailsSlice.reducer;
