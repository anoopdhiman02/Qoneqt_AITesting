import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface verifyOtpPayload {
  contact?: string;
  ccode?: string;
  otp?: any;
  isMobile?: number;
  loginType?: any;
  identityType?: any;
  fname?: string;
  lname?: string;
  device_id?: string;
}

export const VerifyOtpApi = createAsyncThunk(
  "verify_otp",
  async ({
    contact,
    ccode,
    otp,
    isMobile,
    loginType,
    identityType,
    fname,
    lname,
    device_id,
  }: verifyOtpPayload) => {
    const data = new FormData();
    data.append("fromApp", "1");
    data.append("contact", contact);
    data.append("otp", otp);
    data.append("login", loginType);
    data.append("first_name", fname);
    data.append("last_name", lname);
    data.append("device_id", device_id);
    const options = {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Verify_OTP_GO}`,
      data: data,
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.log("error", JSON.stringify(error));
      return {message: error.message || error?.response?.data?.message || "Something went wrong. Please try again.", status: error?.status}
    }
  }
);
