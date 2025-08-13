import { createPost } from "@/redux/reducer/post/CreatePost";
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
  loading:false,
  progress:0,
  isFailed:false
};

const createPostSlice = createSlice({
  name: "create_post",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.data = action?.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.message;
        state.loading=false
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
        state.loading=false;
        state.progress=0;
          });
  },
  reducers: {
    updateloader: (State, action) => {
      State.isLoaded = action.payload;
    },
    updatePostDetail: (State, action) => {
      State.data = {};
      State.called = false;
      State.isLoaded = false;
    },
    updateLoading:(State,action)=>{
      State.loading=action.payload
    },
    updateProgress:(State,action)=>{
      State.progress=action.payload
    },
    updateFailed:(State,action)=>{
      State.isFailed=action.payload
    }
  },
});

export const { updateloader, updatePostDetail,updateLoading,updateProgress,updateFailed } = createPostSlice.actions;
export default createPostSlice.reducer;
