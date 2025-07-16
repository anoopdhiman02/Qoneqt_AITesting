import { trendingLiteGroupReq } from "@/redux/reducer/group/trendingGroup";
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



const trending_LiteGroupSlice = createSlice({
  name: "trending_LiteGroup",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(trendingLiteGroupReq.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data || [];
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.message = action.payload?.message;
      })
      .addCase(trendingLiteGroupReq.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      })
  },
  reducers: {
    updateTrending:(state,action)=>{
      state.data=action.payload
    }
  },
});

export default trending_LiteGroupSlice.reducer;
