import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL} from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface MessageListPayload {
  userId: number;
}
export const onFetchMessageListApi = createAsyncThunk(
  "messages",
  async ({ userId }: MessageListPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Message_List}`,
      data: {
        user_id: userId,
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.log("Error fetching all posts message:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
