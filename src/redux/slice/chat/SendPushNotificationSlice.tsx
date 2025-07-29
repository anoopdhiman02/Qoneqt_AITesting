import {createSlice} from '@reduxjs/toolkit';
import { sendPushNotificationApi } from '@/redux/reducer/chat/SendPushNotification';

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: '',
  isLoaded: false,
  called: false,
};

const SendPushNotificationSlice = createSlice({
  name: 'pushNotification',
  initialState: initialState,
  extraReducers: builder => {
    builder
      .addCase(sendPushNotificationApi.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload;
        state.success = true;
        state.error = false;
        state.error_message = '';
      })
      .addCase(sendPushNotificationApi.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = 'failed api';
        state.success = false;
      });
  },
  reducers: undefined,
});

export default SendPushNotificationSlice.reducer;
