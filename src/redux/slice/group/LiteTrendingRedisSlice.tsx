import { trendingLiteGroupReq } from "@/redux/reducer/group/trendingGroup";
import { createSlice } from "@reduxjs/toolkit";

const Lite_Redis = createSlice({
  name: "trending_LiteRedis",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    updateData: [],
  },
  reducers: {
    //
  },
  extraReducers: (builder) => {
    builder
      .addCase(trendingLiteGroupReq.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.updateData = [...state.updateData, ...(action.payload?.data||[])];
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
      })
      .addCase(trendingLiteGroupReq.rejected, (state, action) => {
        state.isLoaded = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
});
export default Lite_Redis.reducer;
