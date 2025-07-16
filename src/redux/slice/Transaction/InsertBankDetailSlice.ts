import { onInsertBankDetail } from '@/redux/reducer/Transaction/InsertBankDetail';
import {createSlice} from '@reduxjs/toolkit';

const insertBankDetailSlice = createSlice({
  name: 'insert_bank',
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: '',
    message:''
  },
  reducers: {
    // You can include synchronous actions directly in createSlice
  },
  extraReducers: builder => {
    builder
      .addCase(onInsertBankDetail.fulfilled, (state, action) => {
        state.data = action?.payload;
        state.success = action?.payload?.success;
        state.isLoaded = true;
        state.error = false;
        state.error_message = '';
        state.message = action.payload.message
      })
      .addCase(onInsertBankDetail.rejected, (state, action) => {
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = 'fetch data';
      });
  },
});

export default insertBankDetailSlice.reducer;
