import {
  onFetchHomePost,
} from "@/redux/reducer/home/HomePostApi";
import { createSlice } from "@reduxjs/toolkit";

const homePostSlice = createSlice({
  name: "home_post",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    message: "",
    UpdatedData: [],
    nextPostData: [],
  },
  reducers: {
    setHomePostSlice: (state, action) => {
      state.UpdatedData = action.payload;
      state.nextPostData = [];
    },
    setPostLocalData: (state, action) => {
      state.UpdatedData = action.payload.UpdatedData;
    },
    setIsHomeLoading: (state, action) => {
      state.isLoaded = action.payload;
    },
    updateId: (state, action) => {
      state.UpdatedData = state.UpdatedData.map((item) => {
        if (item.Local) {
          return {
            ...item,
            id: action.payload,
          };
        }
        return item;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onFetchHomePost.fulfilled, (state, action) => {
        state.data = action.payload?.data;
        state.UpdatedData = action.payload?.last_count == 0 ? action.payload?.data : state.UpdatedData;
        state.isLoaded = false;
        state.success = action?.payload?.success;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(onFetchHomePost.rejected, (state, action) => {
        state.data = [];
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
        state.message = "";
      });
  },
});

export const {
  setHomePostSlice,
  setIsHomeLoading,
  setPostLocalData,
  updateId,
} = homePostSlice.actions;
export default homePostSlice.reducer;
