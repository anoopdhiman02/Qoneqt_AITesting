import { createSlice } from "@reduxjs/toolkit";
import { onFetchGroupFeeds } from "../../reducer/group/GroupFeedsListApi";

const initialState = {
  data: {},
  UpdatedData: [],
  success: false,
  message: "",
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  status: 0,
  isUpdated: false,
};

const groupFeedsListSlice = createSlice({
  name: "feeds_post",
  initialState,
  reducers: {
    feedUpdatedData: (state, action) => {
      state.isLoaded = action.payload;
    },
    updateReactions: (state, action) => {
      state.UpdatedData = action.payload
    },
    updateIsUpdated: (state, action) => {
      state.isUpdated = action.payload
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(onFetchGroupFeeds.fulfilled, (state, action) => {
        const newData = action?.payload?.data ?? [];
        const newDataReverse = [...newData].reverse();
        const isFirstPage = action?.payload?.lastCount === 0;
        const groupPostList =  action?.payload.isLightMode ? isFirstPage
        ? [...newDataReverse]
        : [...newDataReverse,...state.UpdatedData,] : isFirstPage
        ? [...newData]
        : [...state.UpdatedData, ...newData]

        state.data = newData;
        state.UpdatedData = groupPostList;

        state.success = action?.payload?.success ?? false;
        state.message = action?.payload?.message ?? "";
        state.status = action?.payload?.status ?? 0;
        state.isLoaded = false;
        state.called = true;
        state.error = false;
        state.error_message = "";
        state.isUpdated = false;
      })
      .addCase(onFetchGroupFeeds.rejected, (state) => {
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "Error Fetching Data";
        state.isUpdated = false;
      });
  },
});
export const { feedUpdatedData,updateReactions,updateIsUpdated } = groupFeedsListSlice.actions;
export default groupFeedsListSlice.reducer;
