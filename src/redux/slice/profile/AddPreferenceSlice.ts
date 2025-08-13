import { onAddPreference } from "@/redux/reducer/Profile/AddPreference";
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

const addPreferenceSlice = createSlice({
  name: "add_preference",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onAddPreference.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.message = action.payload?.message;
      })
      .addCase(onAddPreference.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default addPreferenceSlice.reducer;
