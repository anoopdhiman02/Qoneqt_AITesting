import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";

interface deletePostPayload {
  user_id?: number;
  post_id?: any;
}
export const onDeletePost = createAsyncThunk(
  "delete_post",
  async ({ post_id, user_id }: deletePostPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}post/${post_id}/delete`,
      data: {
        user_id: user_id,
        fromApp: 1,
      },
    };
    console.log("options", JSON.stringify(options))
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error delete post:>>", error);
      return error;
    }
  }
);
