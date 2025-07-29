import {createSlice} from '@reduxjs/toolkit';
import {onSavePersonalDetails} from '../../reducer/Profile/savePersonalDetails';

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: '',
  isLoaded: false,
  called: false,
  message: ''
};

const personalDetailsSlice = createSlice({
  name: 'save_details',
  initialState: initialState,
  extraReducers: builder => {
    builder
      .addCase(onSavePersonalDetails.fulfilled, (state, action) => {
     
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload.data;
        state.success = action?.payload.success;
        state.error = false;
        state.error_message = action?.payload.message;
        state.message = action?.payload.message
      })
      .addCase(onSavePersonalDetails.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = 'failed api';
        state.success = false;
        state.message = action?.payload.message
      });
  },
  reducers: undefined,
});

export default personalDetailsSlice.reducer;
