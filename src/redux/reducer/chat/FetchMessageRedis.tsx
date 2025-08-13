import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface MessageRedisListPayload {
  userId: number;
}
export const onFetchMessageRedisListApi = createAsyncThunk(
  "messages",
  async ({ userId }: MessageRedisListPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Get_Message_Redis}`,
      data: {
        user_id: userId,
        fromApp: 1,
        from: "message_home",
      },
    };
    try {

      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching get message:>>>", error);
      return error;
    }
  }
);
