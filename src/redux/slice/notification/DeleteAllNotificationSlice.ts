import { onDeleteAllNotification } from "@/redux/reducer/notification/DeleteNotification";
import { createSlice } from "@reduxjs/toolkit";

const deleteAllNotificationSlice = createSlice({
  name: "delete_all_notification",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
  },
  reducers: {
    // You can include synchronous actions directly in createSlice
  },
  extraReducers: (builder) => {
    builder

      .addCase(onDeleteAllNotification.fulfilled, (state, action) => {
        state.data = action?.payload;
        state.success = true;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
      })
      .addCase(onDeleteAllNotification.rejected, (state, action) => {
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export default deleteAllNotificationSlice.reducer;
