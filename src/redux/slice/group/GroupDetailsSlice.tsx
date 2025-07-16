import { groupDetailsApi } from "@/redux/reducer/group/GroupDetails";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  success: false,
  message: "",
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  status: 0,
};

const groupDetailsSlice = createSlice({
  name: "group_details",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(groupDetailsApi.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.data = action?.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.message;
      })
      .addCase(groupDetailsApi.rejected, (state, action) => {
        state.isLoaded = false;
        state.called = false;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: {
    groupDetailsLoading: (state, action) => {
      state.isLoaded = action.payload;
    },
  },
});
export const { groupDetailsLoading } = groupDetailsSlice.actions;

export default groupDetailsSlice.reducer;
