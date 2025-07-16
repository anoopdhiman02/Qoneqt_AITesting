import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../../utils/constants";
import { ENDPOINTS } from "../../../utils/endPoints";
import axiosInstance from "@/utils/axiosInstance";

interface ChannelCategoryListPayload {

  userId: number;
  groupId: number | string;
}
export const onFetchChannelCategoryList = createAsyncThunk(
  "channel_category_list",
  async ({ userId, groupId }: ChannelCategoryListPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token} `,
      },
      url: `${BASE_URL}${ENDPOINTS.Channel_Category}${groupId}${ENDPOINTS.Channel_Category1}`,
      data: { user_id: userId, fromApp: 1 },
    };

    try {
      const response = await axiosInstance.request(options);

      return response?.data;
    } catch (error) {
      console.error("Error fetching channel category:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
