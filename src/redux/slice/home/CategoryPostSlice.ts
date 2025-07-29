import { onFetchCategoryPost } from "@/redux/reducer/home/CategoryPostApi";
import { onFetchHomePost } from "@/redux/reducer/home/HomePostApi";
import { createSlice } from "@reduxjs/toolkit";

const CategoryPostSlice = createSlice({
  name: "category_post",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    message: "",
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(onFetchCategoryPost.fulfilled, (state, action) => {
        state.data = action?.payload?.data;
        state.success = action?.payload?.success;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(onFetchCategoryPost.rejected, (state, action) => {
        state.data = [];
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
        state.message = "";
      });
  },
});

export default CategoryPostSlice.reducer;
