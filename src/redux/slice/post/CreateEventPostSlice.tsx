import { createEventPost } from "@/redux/reducer/post/CreateEventPost";
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
  Loader: false,
};

const createEventPostSlice = createSlice({
  name: "create_event_post",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createEventPost.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.Loader = false;
        state.data = action?.payload.data;
        state.success = action.payload.success;
        state.error = false;
        state.error_message = "";
        state.status = action.payload.status;
        state.message = action.payload?.message;
      })

      .addCase(createEventPost.rejected, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.error = true;
        state.Loader = false;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers: {
    clearEventData: (state, action) => {
      state.data = action.payload;
      state.message= '';
    },
    changeLoader: (State, action) => {
      State.Loader = action.payload;
    },
  },
});
export const { clearEventData, changeLoader } = createEventPostSlice.actions;
export default createEventPostSlice.reducer;
