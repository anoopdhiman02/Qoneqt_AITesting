import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { BASE_GO_URL } from "../../../utils/constants";
import { ENDPOINTS } from "@/utils/endPoints";

interface PostDetailsPayload {
  postId: string | number;
  userId: number;
  lastCount: number;
}
export const onFetchComments = createAsyncThunk(
  "comments",
  async ({ postId, userId, lastCount }: PostDetailsPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Comment_List}${postId}${ENDPOINTS.Comment_List1}`,
      data: {
        last_count: lastCount || 0,
        user_id: userId,
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetchingComment_List:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
