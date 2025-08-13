import { createSlice } from "@reduxjs/toolkit";
import { onFetchPostDetail } from "../../reducer/post/PostDetailsApi";
import { State } from "react-native-gesture-handler";

const postDetailSlice = createSlice({
  name: "post_details",
  initialState: {
    data: [],
    newData: {},
    success: false,
    message: "",
    error: false,
    error_message: "",
    isLoaded: false,
    called: false,
    status: 0,
  },

  reducers: {
    updateCount: (state, action) => {
      state.data = action.payload;
    },
    setPostDetailsLoading: (state, action) => {
      state.isLoaded = true;
    },
    upgradePostData: (state, action) => {
      state.newData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onFetchPostDetail.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.data = action?.payload?.data;
        state.newData = action?.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.message;
      })
      .addCase(onFetchPostDetail.rejected, (state, action) => {
        state.data = [];
        state.newData = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});
export const { updateCount, setPostDetailsLoading, upgradePostData } = postDetailSlice.actions;
export default postDetailSlice.reducer;
