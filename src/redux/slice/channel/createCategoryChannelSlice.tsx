import { createSlice } from "@reduxjs/toolkit";
import { onCreateCategoryChannel } from "../../reducer/channel/CreateCategoryChannel";

const createCategoryChannelSlice = createSlice({
  name: "create_category_channel",
  initialState: {
    data: {},
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    message: "",
  },
  reducers: {
    // You can include synchronous actions directly in createSlice
  },
  extraReducers: (builder) => {
    builder
    .addCase(onCreateCategoryChannel.pending, (state) => {
      state.data = {};
      state.isLoaded = true;
      state.error = false;
      state.message = null;
      state.error_message = '';
      state.message = '';
    })
      .addCase(onCreateCategoryChannel.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.success = action.payload.success;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
        state.message = action.payload.message;
      })
      .addCase(onCreateCategoryChannel.rejected, (state, action) => {
        state.data = action.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export default createCategoryChannelSlice.reducer;
