import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_GO_URL } from "../../../utils/constants";
import { ENDPOINTS } from "@/utils/endPoints";
import useDeviceId from "@/app/hooks/useDeviceId";


export interface LogoutRequestPayload {
  // Adjust the type based on your actual payload structure
  user_id: string;
  token: string;
  fromApp?: number;
  device_id?: string;
}
export const OnLogoutReq = createAsyncThunk(
  "Logout_Clear",
  async ({ user_id, token }: LogoutRequestPayload) => {
    const deviceInfo = await useDeviceId();
    const body: LogoutRequestPayload = {
      user_id: user_id,
      token : token,
      fromApp: 1,
      device_id: deviceInfo,
    };

    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.User_Logout}`,
      data: body,
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);
