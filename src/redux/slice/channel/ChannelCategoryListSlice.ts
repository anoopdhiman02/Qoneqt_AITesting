import { onFetchChannelCategoryList } from "@/redux/reducer/channel/ChannelCategoryList";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  success: false,
  message: "",
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  status: 0,
};

const ChannelCategoryListSlice = createSlice({
  name: "channel_category_list",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onFetchChannelCategoryList.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action?.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.message;
      })
      .addCase(onFetchChannelCategoryList.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: undefined,
});

export default ChannelCategoryListSlice.reducer;
