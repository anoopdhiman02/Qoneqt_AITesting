import axiosInstance from "@/utils/axiosInstance";
import { BASE_GO_URL } from "@/utils/constants";
import { ENDPOINTS } from "@/utils/endPoints";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface FetchNotificationsPayload {
  userId: number;
  type: number;
  lastCount: number;
}
export const fetchNotifications = createAsyncThunk(
  "all_notifications",
  async ({ userId, type, lastCount }: FetchNotificationsPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Notification_List}`,

      data: JSON.stringify({
        user_id: userId,
        type: type,
        last_count: lastCount,
        fromApp: 1,
      }),
    };

    try {
      const response = await axiosInstance.request(options);
      return {...response.data, type: type,lastCount };
    } catch (error) {
      return error;
    }
  }
);
