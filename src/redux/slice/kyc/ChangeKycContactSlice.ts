import { onChangeKycContact } from "@/redux/reducer/kyc/ChangeKycContact";
import { createSlice } from "@reduxjs/toolkit";

const changeKycContactSlice = createSlice({
  name: "change_kyc_contact",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    message: "",
  },
  reducers: {
    // You can include synchronous actions directly in createSlice
  },
  extraReducers: (builder) => {
    builder

      .addCase(onChangeKycContact.fulfilled, (state, action) => {

        state.data = action?.payload?.data;
        state.success = action?.payload?.success;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(onChangeKycContact.rejected, (state, action) => {
        state.data = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = "fetch data";
      });
  },
});

export default changeKycContactSlice.reducer;
