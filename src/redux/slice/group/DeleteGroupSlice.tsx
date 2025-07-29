import { deletegroupReq } from "@/redux/reducer/group/DeleteGroup";
import { createSlice } from "@reduxjs/toolkit";

const Delete_Group_Slice = createSlice({
  name: "Delete_Group",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(deletegroupReq.fulfilled, (state, action) => {
        state.data = action?.payload;
        state.success = true;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
      })

      .addCase(deletegroupReq.rejected, (state, action) => {
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export default Delete_Group_Slice.reducer;
