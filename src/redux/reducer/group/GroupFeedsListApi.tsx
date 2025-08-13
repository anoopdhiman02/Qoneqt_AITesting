import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface fecthPostPayload {
  userId: number;
  groupId?: any;
  lastCount: number;
  isLightMode: boolean;
}

export const onFetchGroupFeeds = createAsyncThunk(
  "group_feeds",
  async ({ userId, groupId, lastCount, isLightMode }: fecthPostPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Group_List}${groupId}${ENDPOINTS.Group_List1}`,
      data: JSON.stringify({
        user_id: userId,
        last_count: lastCount,
        fromApp: 1,
      }),
    };
    try {
      const response = await axiosInstance.request(options);
      return { ...response.data, lastCount: lastCount, isLightMode: isLightMode, };
    } catch (error) {
      console.error("Error group List:", error);
      return error;
    }
  }
);
