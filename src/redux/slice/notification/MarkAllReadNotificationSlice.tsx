import {createSlice} from '@reduxjs/toolkit';
import {onMarkAllNotification} from '../../reducer/notification/MarkAllReadNotification';

const markAllReadNotificationSlice = createSlice({
  name: 'mark_all_notification',
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: '',
  },
  reducers: {
    // You can include synchronous actions directly in createSlice
  },
  extraReducers: builder => {
    builder

      .addCase(onMarkAllNotification.fulfilled, (state, action) => {
        state.data = action?.payload;
        state.success = true;
        state.isLoaded = true;
        state.error = false;
        state.error_message = '';
      })
      .addCase(onMarkAllNotification.rejected, (state, action) => {
        state.data = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = 'fetch data';
      });
  },
});

export default markAllReadNotificationSlice.reducer;
