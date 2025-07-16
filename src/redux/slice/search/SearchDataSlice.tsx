import { createSlice } from "@reduxjs/toolkit";
import { onSearchDataApi } from "../../reducer/search/SearchDataApi";

const initialState = {
  data: {},
  search: '',
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
};

const searchDataSlice = createSlice({
  name: "search_data",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onSearchDataApi.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data;
        state.search = action.payload?.search;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
      })
      .addCase(onSearchDataApi.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
        state.search = '';
      });
  },
  reducers: undefined,
});

export default searchDataSlice.reducer;
