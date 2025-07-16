import { onFetchDiscoverPost } from "@/redux/reducer/home/DiscoverPostApi";
import { createSlice } from "@reduxjs/toolkit";

const discoverPostSlice = createSlice({
  name: "discover_post",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    message: "",
  },
  reducers: {
    updateDiscoverData:(state,action)=>{
      state.data=action.payload
      }
    // You can include synchronous actions directly in createSlice
  },
  extraReducers: (builder) => {
    builder
    .addCase(onFetchDiscoverPost.pending,(state, action) => {
      state.isLoaded = true;
      state.error = false;
      state.error_message = "";
    })

      .addCase(onFetchDiscoverPost.fulfilled, (state, action) => {
        state.data = action?.payload?.data;
        state.success = action?.payload?.success;
        state.message = action.payload.message;

        state.isLoaded = false;
        state.error = false;
        state.error_message = "";
      })
      .addCase(onFetchDiscoverPost.rejected, (state, action) => {
        state.data = [];
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export const {updateDiscoverData} =discoverPostSlice.actions
export default discoverPostSlice.reducer;
