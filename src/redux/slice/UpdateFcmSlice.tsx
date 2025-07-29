import {createSlice} from '@reduxjs/toolkit';
import {onUpdateFcm} from '../reducer/UpdateFcm';

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: '',
  isLoaded: false,
  called: false,
};

const updateFcmSlice = createSlice({
  name: 'update_fcm',
  initialState: initialState,
  extraReducers: builder => {
    builder
      .addCase(onUpdateFcm.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload;
        state.success = true;
        state.error = false;
        state.error_message = '';
      })
      .addCase(onUpdateFcm.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = 'failed api';
        state.success = false;
      });
  },
  reducers: undefined,
});

export default updateFcmSlice.reducer;
