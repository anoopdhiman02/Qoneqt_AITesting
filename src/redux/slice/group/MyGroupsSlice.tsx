import { createSlice } from "@reduxjs/toolkit";
import { fetchMyGroups } from "../../reducer/group/FetchmyGroups";

const initialState = {
  data: [],
  success: false,
  message: "",
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  status: 0,
  lastCount: 0,
};

const myGroupsSlice = createSlice({
  name: "my_groups",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyGroups.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.lastCount = action?.payload.lastCount;
        state.data = action?.payload.lastCount == 0 ? action?.payload?.data || [] : action?.payload?.data ? [...state.data, ...action?.payload?.data]: [...state.data];
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(fetchMyGroups.rejected, (state, action: any) => {
        state.isLoaded = false;
        state.called = false;
        state.error = true;
        state.message = action?.payload?.message || "failed api";
        state.success = false;
      });
  },
  reducers: {
    setMyGroupsLoading: (state, action) => {
      state.isLoaded = true;
    },
    upgradeMyGroupUnReadCount: (state, action) => {
      state.data = action.payload;
    }
  },
});
export const { setMyGroupsLoading, upgradeMyGroupUnReadCount } = myGroupsSlice.actions;
export default myGroupsSlice.reducer;
