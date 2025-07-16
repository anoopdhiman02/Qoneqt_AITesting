import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL} from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";
interface trendingLiteGroupRequest {
  user_id: number;
  fromApp: number;
  last_count: number;
}

export const trendingLiteGroupReq = createAsyncThunk(
  "trending_LiteGroup",
  async ({ user_id }: trendingLiteGroupRequest) => {
    const body: trendingLiteGroupRequest = {
      user_id: user_id,
      fromApp:1,
      last_count:0
    };
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },

      url: `${BASE_GO_URL}${ENDPOINTS.trending_Groups}`,
      data: body,
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error group trending Group");
      return error;
    }
  }
);
