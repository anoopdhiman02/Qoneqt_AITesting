import { onFetchReferral } from '@/redux/reducer/Transaction/FetchReferral';
import {createSlice} from '@reduxjs/toolkit';

const fetchReferralSlice = createSlice({
  name: 'fetch_referral',
  initialState: {
    data: {},
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

      .addCase(onFetchReferral.fulfilled, (state, action) => {
        
        state.data = action?.payload?.data;
        state.success = action?.payload?.success;
        state.isLoaded = true;
        state.error = false;
        state.error_message = '';
      })
      .addCase(onFetchReferral.rejected, (state, action) => {
        state.data = action?.payload?.data;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = 'fetch data';
      });
  },
});

export default fetchReferralSlice.reducer;
