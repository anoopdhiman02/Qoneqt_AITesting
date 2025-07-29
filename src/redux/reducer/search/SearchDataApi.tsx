import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";
import { getAccessToken } from "@/localDB/TokenManager";


interface SearchDataPayload {
  // Adjust the type based on your actual payload structure
  user_id: string | number;
  last_count: number;
  query: string;
  stype: string;
}
export const onSearchDataApi = createAsyncThunk(
  "search_data",
  async ({ query, user_id, last_count, stype }: SearchDataPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Search_Data}`,
      data: {
        fromApp: 1,
        last_count: last_count,
        search: query,
        type: stype || 'hashtags',
        user_id: user_id,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return {...response.data, search: query};
    } catch (error) {
      console.error("Error fetching Search_Data:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
