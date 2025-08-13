import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface newFeedCountRequest {
  user_id: number;
  last_id: number;
  fromApp?: number;
}
export const newFeedCountReq = createAsyncThunk(
  "New_Feed",
  async ({ last_id, user_id }: newFeedCountRequest) => {
    const body: newFeedCountRequest = {
      user_id: user_id,
      last_id: last_id,
      fromApp: 1,
    };
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.New_Feed_Count}`,
      data: body,
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching home posts:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
