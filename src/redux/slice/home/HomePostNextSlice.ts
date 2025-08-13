import { onFetchHomeNextPost } from "@/redux/reducer/home/HomePostApi";
import { createSlice } from "@reduxjs/toolkit";

const homePostNextSlice = createSlice({
  name: "home_next_post",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    message: "",
    nextPostData: [],
    last_count:0
  },
  reducers: {
setIsHomeNextLoading:(state,action)=>{
  state.isLoaded=action.payload;
  },
setHomeNextPostData:(state,action)=>{
  state.data=action.payload;
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onFetchHomeNextPost.fulfilled, (state, action) => {
        state.data =  action.payload?.data;
        state.success = true;
        state.isLoaded = false;
        state.error = false;
        state.error_message = "";
        state.message = "";
        state.last_count= action.payload?.last_count;
      })
      .addCase(onFetchHomeNextPost.rejected, (state, action) => {
        state.data = [];
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
        state.message = "";
      });
  },
  
});


export const {setIsHomeNextLoading,setHomeNextPostData }=homePostNextSlice.actions
export default homePostNextSlice.reducer;
