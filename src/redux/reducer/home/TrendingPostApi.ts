import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL, } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";
import { getAccessToken } from "@/localDB/TokenManager";

interface TrendingPostPayload {
  userId: number;
  lastCount: number;
}
export const onFetchTrendingPost = createAsyncThunk(
  "trending_post",
  async ({ userId, lastCount }: TrendingPostPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Trending_Post_Api}`,
      data: {
        user_id: userId,
        last_count: lastCount,
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return {...response.data, last_count: lastCount};
    } catch (error) {
      console.log("Error Trending posts:>>", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
