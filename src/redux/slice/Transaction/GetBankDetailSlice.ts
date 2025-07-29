import { onFetchBankDetail } from '@/redux/reducer/Transaction/GetBankDetail';
import {createSlice} from '@reduxjs/toolkit';

const fetchBankDetailSlice = createSlice({
  name: 'fetch_bank_detail',
  initialState: {
    data: {},
    success: false,
    isLoaded: false,
    error: false,
    error_message: '',
    message:""
  },
  reducers: {
    // You can include synchronous actions directly in createSlice
  },
  extraReducers: builder => {
    builder

      .addCase(onFetchBankDetail.fulfilled, (state, action) => {
        
        state.data = action?.payload?.data;
        state.success = action?.payload?.success;
        state.isLoaded = true;
        state.error = false;
        state.error_message = '';
        state.message = action.payload.message
      })
      .addCase(onFetchBankDetail.rejected, (state, action) => {
        state.data = action?.payload?.data;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = 'fetch data';
      });
  },
});

export default fetchBankDetailSlice.reducer;
