import { searchGroupList } from "@/redux/reducer/group/SearchGroupList";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  message: "",
};



const searchGroupSlice = createSlice({
  name: "search_group",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(searchGroupList.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.message = action.payload?.message;
      })
      .addCase(searchGroupList.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: {
    updateLoader: (state, action) => {
      state.isLoaded = action.payload;
    }
  },
});
export const { updateLoader } = searchGroupSlice.actions;

export default searchGroupSlice.reducer;
