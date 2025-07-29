import { onFetchHomePost } from "@/redux/reducer/home/HomePostApi";
import { onFetchTrendingPost } from "@/redux/reducer/home/TrendingPostApi";
import { createSlice } from "@reduxjs/toolkit";

const TrendingPostSlice = createSlice({
  name: "trending_post",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    message: "",
    updateData: [],

  },
  reducers: {
    trendingUserPost: (state, action) => {
      state.data = action.payload;
    },
    setTrendingLoading: (state, action) => {
      state.isLoaded = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(onFetchTrendingPost.fulfilled, (state, action) => {
        state.data = action?.payload?.data;
        state.success = action?.payload?.success;
        state.isLoaded = false;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(onFetchTrendingPost.rejected, (state, action) => {
        state.data = [];
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
        state.message = "";
      });
  },
});
export const {trendingUserPost, setTrendingLoading}=TrendingPostSlice.actions
export default TrendingPostSlice.reducer;
