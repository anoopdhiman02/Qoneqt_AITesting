import { onSaveBasicInfo } from "@/redux/reducer/Profile/saveBasicInfo";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  message:''
};

const saveBasicInfoSlice = createSlice({
  name: "save_basic_info",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onSaveBasicInfo.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload.data || '';
        state.success = action.payload.success;
        state.error = false;
        state.error_message = "";
        state.message = action.payload.message
      })
      .addCase(onSaveBasicInfo.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default saveBasicInfoSlice.reducer;
