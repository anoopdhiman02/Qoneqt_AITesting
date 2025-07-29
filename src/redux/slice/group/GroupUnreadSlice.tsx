import { createSlice } from "@reduxjs/toolkit";
import { groupUnreadReq } from "@/redux/reducer/group/Groupunread";

const groupUnreadSlice = createSlice({
  name: "Group_Unread",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    message: "",
    called: false,
    status: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(groupUnreadReq.fulfilled, (state, action) => {
        state.data = action.payload?.data?.qoneqtdb_loop_group[0];
        state.success = action.payload?.success;
        state.message = action.payload?.message;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
        state.called = false;
        state.status = action.payload.status;
      })
      .addCase(groupUnreadReq.rejected, (state, action) => {
        state.data = [];
        state.success = false;
        state.isLoaded = true;
        state.error = true;
        state.error_message = action?.error?.message || "";
      });
  },
});

export default groupUnreadSlice.reducer;
