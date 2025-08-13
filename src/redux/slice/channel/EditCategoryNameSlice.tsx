import { onEditCategoryName } from "@/redux/reducer/channel/EditCategoryName";
import { createSlice } from "@reduxjs/toolkit";

const editCategoryNameSlice = createSlice({
  name: "edit_category_name",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(onEditCategoryName.fulfilled, (state, action) => {
        state.data = action?.payload?.data;
        state.success = action?.payload?.success;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })

      .addCase(onEditCategoryName.rejected, (state, action) => {
        state.data = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
        state.message = action?.payload?.message;
      });
  },
});

export default editCategoryNameSlice.reducer;
