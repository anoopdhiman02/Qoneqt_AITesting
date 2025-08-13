import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";
import { BASE_GO_URL } from "@/utils/constants";

interface blockUserPayload {
  userId: string | number;
  isBlock: number;
  profileId: number | string;
}
export const onBlockUser = createAsyncThunk(
  "block_user",
  async ({ userId, isBlock, profileId }: blockUserPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.User_Block}`,
      data: {
        user_id: userId,
        block_id: profileId,
        block_status: isBlock,
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching follow user:", error);
      return error;
    }
  }
);
