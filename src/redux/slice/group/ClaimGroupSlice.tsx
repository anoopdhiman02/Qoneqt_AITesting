import { ClaimGroupSubmitRequest } from '@/redux/reducer/group/ClaimGroup';
import {createSlice} from '@reduxjs/toolkit';

const Claim_Group_Slice = createSlice({
  name: 'Claim_Group',
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: '',
  },
  reducers: {

  },
  extraReducers: builder => {
    builder
      .addCase(ClaimGroupSubmitRequest.fulfilled, (state, action) => {
        state.data = action?.payload;
        state.success = true;
        state.isLoaded = true;
        state.error = false;
        state.error_message = '';
      })
      .addCase(ClaimGroupSubmitRequest.rejected, (state, action) => {
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = 'fetch data';
      });
  },
});

export default Claim_Group_Slice.reducer;
