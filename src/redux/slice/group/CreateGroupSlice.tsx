import { createGroup } from "@/redux/reducer/group/CreateGroup";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  message: "",
};

const createGroupSlice = createSlice({
  name: "create_group",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createGroup.fulfilled, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.data = action?.payload?.data;
        state.success = action?.payload?.success;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.isLoaded = false;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers:{
    setLoadingData : (state, action) =>{
      state.isLoaded = action.payload;
    }
  },
});
export const {setLoadingData} = createGroupSlice.actions;
export default createGroupSlice.reducer;
