import {createSlice} from '@reduxjs/toolkit';
import { onUnDeleteAccount} from '../../../reducer/Profile/setting/DeleteAccount';

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: '',
  isLoaded: false,
  called: false,
  message: ''
};

const UnDeleteAccountSlice = createSlice({
  name: 'UNdelete_account',
  initialState: initialState,
  extraReducers: builder => {
    builder
      .addCase(onUnDeleteAccount.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.message = action.payload?.message;
      })
      .addCase(onUnDeleteAccount.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = 'failed api';
        state.success = false;
      });
  },
  reducers: undefined,
});

export default UnDeleteAccountSlice.reducer;
