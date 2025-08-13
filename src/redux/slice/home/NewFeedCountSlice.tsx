import { newFeedCountReq } from "@/redux/reducer/home/NewFeedCount";
import { createSlice } from "@reduxjs/toolkit";

const NewFeedSlice = createSlice({
  name: "New_Feed",
  initialState: {
    data:null,
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    message: "",
  },
  reducers: {
    resetNewFeedCount: (state) => {
      state.data = null;
      state.success = false;
      state.isLoaded = false;
      state.error = false;
      state.error_message = "";
      state.message = "";
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(newFeedCountReq.fulfilled, (state, action) => {
        state.data = action?.payload?.data;
        state.success = action?.payload?.success;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(newFeedCountReq.rejected, (state, action) => {
        state.data = [];
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
        state.message = "";
      });
  },
  
});

export const { resetNewFeedCount } = NewFeedSlice.actions;
export default NewFeedSlice.reducer;
