import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

// Define the types for the API response and payload
interface PostLikeResponse {
  // Adjust this interface based on the actual structure of your API response
  data: any;
}

interface PostLikePayload {
  // Adjust the type based on your actual payload structure
  // token: string | null | undefined;
  postId: string;
  liked: number;
  userId: number | string;
  reaction: number;
}
export const onPostLike = createAsyncThunk(
  "like",
  async ({ userId, postId, liked, reaction }: PostLikePayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token} `,
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Post_Like}${postId}${ENDPOINTS.Post_Like1}`,
      data: {
        user_id: userId,
        like: liked,
        fromApp: 1,
        reaction: reaction,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching Post_Like:", error);
      return error;
    }
  }
);
