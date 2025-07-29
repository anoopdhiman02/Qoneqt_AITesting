import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface DiscoverPostPayload {
  userId: number;
}
export const onFetchDiscoverPost = createAsyncThunk(
  "discover_post",
  async ({ userId }: DiscoverPostPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Post_Discover_Api}`,
      data: {
        user_id: userId,
        fromApp: 1,
      },
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching Discover_Api:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
