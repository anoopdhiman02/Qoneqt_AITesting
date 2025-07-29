import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface CategoryPostPayload {
  //   token: string | null | undefined;
  userId: number;
  catId: number | string;
  lastCount: number;
}
export const onFetchCategoryPost = createAsyncThunk(
  "home_post",
  async ({ userId, catId, lastCount }: CategoryPostPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Post_Category_Api}${catId}`,
      data: {
        user_id: userId,
        last_count: lastCount,
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.log("Error  onFetchCategoryPost:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
