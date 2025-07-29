import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL, } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";


interface readNotificationPayload {
  userId: number | null | undefined;
  notificationId: number | null | undefined;
}
export const onReadNotification = createAsyncThunk(
  "mark_read_notification",
  async ({ userId, notificationId }: readNotificationPayload) => {
    const options = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Notification_Read}`,
      data: {
        "fromApp": 1,
        "user_id": userId,
        "id": notificationId
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);
