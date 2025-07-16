import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface deletePostPayload {
  commentId?: string | number;
  userId?: number;
  postId?: number;
}
export const onCommentDelete = createAsyncThunk(
  "comment_delete",
  async ({ commentId, postId, userId }: deletePostPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Comment_Delete}${postId}${ENDPOINTS.Comment_Delete1}`,
      data: {
        user_id: userId,
        comment_id: commentId,
        fromApp: 1,
      },
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error delete post:", error);
      return error;
    }
  }
);
