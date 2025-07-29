import { onCreateGroupCategory } from "@/redux/reducer/channel/CreateGroupCategory";
import { createSlice } from "@reduxjs/toolkit";

const createGroupCategorySlice = createSlice({
  name: "create_group_category",
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

      .addCase(onCreateGroupCategory.fulfilled, (state, action) => {
        state.data = action?.payload?.data;
        state.success = action?.payload?.success;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })

      .addCase(onCreateGroupCategory.rejected, (state, action) => {
        state.data = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export default createGroupCategorySlice.reducer;
