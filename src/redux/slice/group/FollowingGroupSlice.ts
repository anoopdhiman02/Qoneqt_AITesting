import { fetchFollowingGroups } from "@/redux/reducer/group/FetchFollowingGroups";
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

const myGroupsSlice = createSlice({
  name: "following_groups",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowingGroups.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.data =  action?.payload?.lastCount == 0 ? action?.payload?.data : action?.payload?.data ? [...state.data, ...action?.payload?.data]: [...state.data];
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.message;
      })
      .addCase(fetchFollowingGroups.rejected, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers:{
    setFollowingGroupsLoading: (state, action) => {
          state.isLoaded = true;
        },
  },
});
export const { setFollowingGroupsLoading } = myGroupsSlice.actions;
export default myGroupsSlice.reducer;


