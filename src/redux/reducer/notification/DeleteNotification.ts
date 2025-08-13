import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface deleteNotificationPayload {
  userId?: number | null | undefined;
  notificationId?: number | null | undefined;
}
export const onDeleteNotification = createAsyncThunk(
  "delete_all_notification",
  async ({ userId, notificationId }: deleteNotificationPayload) => {
    const options = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Notification_Delete}`,
      data:{
        user_id: userId,
        id: notificationId,
        fromApp: 1,
      }
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.log("Error fetching notification delete:", error);
      return error;
    }
  }
);

export const onDeleteAllNotification = createAsyncThunk(
  "delete_all_notification",
  async ({ userId }: deleteNotificationPayload) => {
    const options = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Notification_DeleteAll}`,
      data:{
        user_id: userId,
        fromApp: 1,
      }
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.log("Error fetching notification delete:", error);
      return error;
    }
  }
);

