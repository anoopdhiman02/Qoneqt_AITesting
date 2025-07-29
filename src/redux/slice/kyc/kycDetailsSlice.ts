import {
  kycBasicDetails,
  onKycAadharUpload,
  onKycChangeContact,
  onKycOtpVerify,
  onKycPanUpload,
  onKycSelfie,
  onKycSendOtp,
} from "@/redux/reducer/kyc/kycDetails";
import { createSlice } from "@reduxjs/toolkit";

const kycDetailsSlice = createSlice({
  name: "kyc_basic_details",
  initialState: {
    basicData: null,
    panData: null,
    faceData: null,
    aadharData: null,
    otpData: null,
    otpSendData: null,
    changeContact: null,
    data: null,
    isLoaded: false,
    isBasicSuccess: false,
    isPanSuccess: false,
    isFaceSuccess: false,
    isAadharSuccess: false,
    isOtpSuccess: false,
    isOtpSendSuccess: false,
    success: false,
    error: false,
    error_message: "",
    message: "",
  },
  reducers: {
    setKycLoading: (state, action) => {
      state.isLoaded = true;
    },
    clearAllValues: (state, action)=>{
      state.basicData = null;
      state.panData = null;
      state.faceData = null;
      state.aadharData = null;
      state.otpData = null;
      state.otpSendData = null;
      state.changeContact = null;
      state.data = null;
      state.isLoaded = false;
      state.isBasicSuccess = false;
      state.isPanSuccess = false;
      state.isFaceSuccess = false;
      state.isAadharSuccess = false;
      state.isOtpSuccess = false;
      state.isOtpSendSuccess = false;
      state.success = false;
      state.error = false;
      state.error_message = "";
      state.message = "";
    }
    // You can include synchronous actions directly in createSlice
  },
  extraReducers: (builder) => {
    builder
      .addCase(kycBasicDetails.fulfilled, (state, action) => {
        state.basicData = action?.payload;
        state.isBasicSuccess = action?.payload?.success;
        state.isLoaded = false;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(kycBasicDetails.rejected, (state, action) => {
        state.basicData = action?.payload;
        state.isBasicSuccess = false;
        state.isLoaded = false;
        state.error = true;
        //@ts-ignore
        state.error_message = action?.payload?.message;
      })
      .addCase(onKycSelfie.fulfilled, (state, action) => {
        state.faceData = action?.payload;
        state.success = action?.payload?.success;
        state.isLoaded = false;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(onKycSelfie.rejected, (state, action) => {
        state.faceData = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        //@ts-ignore
        state.error_message = action?.payload?.message;
      })
      .addCase(onKycOtpVerify.fulfilled, (state, action) => {
        state.otpData = action?.payload;
        state.isOtpSuccess = action?.payload?.success;
        state.isLoaded = false;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(onKycOtpVerify.rejected, (state, action) => {
        state.otpData = action?.payload;
        state.isOtpSuccess = false;
        state.isLoaded = false;
        state.error = true;
        //@ts-ignore
        state.error_message = action?.payload?.message;
      })
      .addCase(onKycAadharUpload.fulfilled, (state, action) => {
        state.aadharData = action?.payload;
        state.isAadharSuccess = action?.payload?.success;
        state.isLoaded = false;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(onKycAadharUpload.rejected, (state, action) => {
        state.aadharData = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        //@ts-ignore
        state.error_message = action?.payload?.message;
      })
      .addCase(onKycPanUpload.fulfilled, (state, action) => {
        state.panData = action?.payload;
        state.success = action?.payload?.success;
        state.isLoaded = false;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(onKycPanUpload.rejected, (state, action) => {
        state.panData = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        //@ts-ignore
        state.error_message = action?.payload?.message;
      })
      .addCase(onKycSendOtp.fulfilled, (state, action) => {
        state.otpSendData = action?.payload;
        state.success = action?.payload?.success;
        state.isLoaded = false;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(onKycSendOtp.rejected, (state, action) => {
        state.otpSendData = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        //@ts-ignore
        state.error_message = action?.payload?.message;
      })
      .addCase(onKycChangeContact.fulfilled, (state, action) => {
        state.changeContact = action?.payload;
        state.success = action?.payload?.success;
        state.isLoaded = false;
        state.error = false;
        state.error_message = "";
        state.message = action?.payload?.message;
      })
      .addCase(onKycChangeContact.rejected, (state, action) => {
        state.changeContact = action?.payload;
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        //@ts-ignore
        state.error_message = action?.payload?.message;
      });
  },
});
export const { setKycLoading, clearAllValues } = kycDetailsSlice.actions;
export default kycDetailsSlice.reducer;
