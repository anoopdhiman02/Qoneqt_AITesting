import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

export const sendPushNotificationApi = createAsyncThunk(
  "pushNotification",
  async ( data) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Push_Notification}`,
      data: data,
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error Push Notification", error);
      return error;
    }
  }
);
