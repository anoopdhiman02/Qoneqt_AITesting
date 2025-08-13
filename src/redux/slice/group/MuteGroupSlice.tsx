import { MuteGrouprequest } from '@/redux/reducer/group/MuteGroup';
import {createSlice} from '@reduxjs/toolkit';

const MuteGroupSlice = createSlice({
  name: 'Mute_Group',
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
      .addCase(MuteGrouprequest.fulfilled, (state, action) => {
        state.data = action?.payload;
        state.success = true;
        state.isLoaded = true;
        state.error = false;
        state.error_message = '';
      })

      .addCase(MuteGrouprequest.rejected, (state, action) => {
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = 'fetch data';
      });
  },
});

export default MuteGroupSlice.reducer;
