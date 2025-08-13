import { onDeleteNotification } from "@/redux/reducer/notification/DeleteNotification";
import { createSlice } from "@reduxjs/toolkit";

const deleteNotificationSlice = createSlice({
  name: "delete_notification",
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

      .addCase(onDeleteNotification.fulfilled, (state, action) => {
        state.data = action?.payload;
        state.success = true;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
      })
      .addCase(onDeleteNotification.rejected, (state, action) => {
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export default deleteNotificationSlice.reducer;
