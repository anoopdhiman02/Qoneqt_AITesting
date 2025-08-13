import {createSlice} from '@reduxjs/toolkit';

import {onBlockUser} from '../../reducer/Profile/BlockUser';

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: '',
  isLoaded: false,
  called: false,
  message:''
};

const blockUserSlice = createSlice({
  name: 'block_user',
  initialState: initialState,
  extraReducers: builder => {
    builder
      .addCase(onBlockUser.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload?.data;
        state.success = action.payload?.success;
        state.error = false;
        state.message = action.payload?.message;
      })
      .addCase(onBlockUser.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = 'failed api';
        state.success = false;
      });
  },
  reducers: undefined,
});

export default blockUserSlice.reducer;
