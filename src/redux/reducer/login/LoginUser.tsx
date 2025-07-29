import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_GO_URL } from "../../../utils/constants";
import { ENDPOINTS } from "@/utils/endPoints";

interface userLoginPayload {
  contact: string;
  ccode: string;
  referralCode: string;
  isMobile: boolean;
  os: string;
  os_version: string;
  app_version: string;
  fcmToken: string;
}

export const LoginUserApi = createAsyncThunk(
  "login_user",
  async (
    {
      contact,
      ccode,
      isMobile,
      referralCode,
      os,
      os_version,
      app_version,
      fcmToken,
    }: userLoginPayload,
    { rejectWithValue }
  ) => {
     const data = new FormData();
     data.append("ccode", ccode);
     data.append("contact", contact);
     data.append("referral", referralCode);
     data.append("os", os);
     data.append("os_version", os_version);
     data.append("app_version", app_version);
     data.append("fcm_token", fcmToken);
     data.append("fromApp", "1");
    const options = {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.login}`,
      timeout: 60000,
      data: data,
    };

    try {
      console.log("options",JSON.stringify(options));
      const response = await axios.request(options);
      return response?.data;
    } catch (error) {
      console.log("error",JSON.stringify(error));
       return {message: error?.response?.data?.message || error?.message || "Something went wrong. Please try again.", status: error?.status};
    }
  }
);
