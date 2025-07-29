import {createSlice} from '@reduxjs/toolkit';
import {onUpdateProfilePicture} from '../../reducer/Profile/UpdateProfilePicture';

const initialState = {
  data: {},
  success: false,
  error: false,
  error_message: '',
  isLoaded: false,
  called: false,
  message:''
};

const updateProfilePictureSlice = createSlice({
  name: 'profile_picture',
  initialState: initialState,
  extraReducers: builder => {
    builder
      .addCase(onUpdateProfilePicture.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action.payload.data;
        state.success = action.payload.success;
        state.error = false;
        state.error_message = '';
        state.message = action.payload.message
      })
      .addCase(onUpdateProfilePicture.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = 'failed api';
        state.success = false;
      });
  },
  reducers: undefined,
});

export default updateProfilePictureSlice.reducer;
