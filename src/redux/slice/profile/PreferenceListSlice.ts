import { fetchPreferenceList } from "@/redux/reducer/Profile/PreferenceList";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
};

const preferenceListSlice = createSlice({
  name: "preference_list",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchPreferenceList.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action?.payload?.data;
        state.success = action?.payload?.success;
        state.error = false;
        state.error_message = action?.payload?.message;
      })
      .addCase(fetchPreferenceList.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default preferenceListSlice.reducer;
