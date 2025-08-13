import {createSlice} from '@reduxjs/toolkit';
import {onDeleteAccount} from '../../../reducer/Profile/setting/DeleteAccount';

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: '',
  isLoaded: false,
  called: false,
  message: ''
};

const deleteAccountSlice = createSlice({
  name: 'delete_account',
  initialState: initialState,
  extraReducers: builder => {
    builder
      .addCase(onDeleteAccount.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.message = action.payload?.message;
      })
      .addCase(onDeleteAccount.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = 'failed api';
        state.success = false;
      });
  },
  reducers: undefined,
});

export default deleteAccountSlice.reducer;
