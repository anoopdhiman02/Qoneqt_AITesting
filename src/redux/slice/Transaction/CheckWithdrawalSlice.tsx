import {createSlice} from '@reduxjs/toolkit';
import {onCheckWithdrawal} from '../../reducer/Transaction/CheckWithdrawal';

const checkWithdrawalSlice = createSlice({
  name: 'check_withdrawal',
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: '',
    message: ""
  },
  reducers: {
    // You can include synchronous actions directly in createSlice
  },
  extraReducers: builder => {
    builder
      .addCase(onCheckWithdrawal.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.success = action?.payload?.success;
        state.isLoaded = true;
        state.error = false;
        state.error_message = '';
        state.message = action.payload.message
      })
      .addCase(onCheckWithdrawal.rejected, (state, action: any) => {
        state.data = [];
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = 'fetch data';
        state.message = action.payload.message;
      });
  },
});

export default checkWithdrawalSlice.reducer;
