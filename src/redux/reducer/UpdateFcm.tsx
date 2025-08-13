import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints"

interface updateFcmPayload {
  userId?: string | number;
  fcmToken: string | null | undefined;
}
export const onUpdateFcm = createAsyncThunk(
  "update_fcm",
  async ({ userId, fcmToken }: updateFcmPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Update_FCM}`,
      data: {
        fromApp: 1,
        user_id: userId,
        token: fcmToken,
      },
    };

    try {
      const response = await axiosInstance.request(options);

      return response.data;
    } catch (error) {
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
