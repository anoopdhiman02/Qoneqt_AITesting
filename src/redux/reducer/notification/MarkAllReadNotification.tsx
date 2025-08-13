import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface marksNotificationPayload {
  userId: number | null | undefined;
}
export const onMarkAllNotification = createAsyncThunk(
  "mark_all_notification",
  async ({ userId }: marksNotificationPayload) => {
    const options = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.MARK_ALL_READ}`,
      data:{
        user_id: userId,
        fromApp: 1,
      },
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching Notification_Clear:", error);
      return error;
    }
  }
);
