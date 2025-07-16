import { createSlice } from "@reduxjs/toolkit";
import { AllGroupReq } from "@/redux/reducer/group/AllGroups";

const AllGroupSlice = createSlice({
  name: "All_Groups",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    lastCount: 0,
  },
  reducers: {
    setAllGroupsLoading: (state, action) => {
      state.isLoaded = action.payload;
    },
    upgradeAllGroupUnReadCount: (state, action) => {
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(AllGroupReq.fulfilled, (state, action) => {
        const newData = action?.payload.data || [];
        const lastCount = action?.payload.lastCount;

        if (lastCount === 0) {
          state.data = newData;
        } else {
          const existingIds = new Set(state.data.map((item) => item.id));
          const filteredNewData = newData.filter(
            (item) => !existingIds.has(item.id)
          );
          state.data = [...state.data, ...filteredNewData];
        }
        state.success = true;
        state.isLoaded = false;
        state.error = false;
        state.error_message = "";
        state.lastCount = action?.payload.lastCount;
      })

      .addCase(AllGroupReq.rejected, (state, action) => {
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});
export const { setAllGroupsLoading, upgradeAllGroupUnReadCount } = AllGroupSlice.actions;

export default AllGroupSlice.reducer;
