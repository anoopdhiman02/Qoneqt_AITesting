import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, URL_PATH } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

// Define the types for the API response and payload
interface ProfileDetailsResponse {
  // Adjust this interface based on the actual structure of your API response
  data: any;
}

interface ChannelListPayload {
  // Adjust the type based on your actual payload structure
  // token: string | null | undefined;
  lastCount: number;
  userId: number;
  type: number;
}
export const onFetchChannelList = createAsyncThunk(
  "group_data",
  async ({ userId, type, lastCount }: ChannelListPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token} `,
      },
      url: `${BASE_URL}${ENDPOINTS.Channel_List}`,
      data: { user_id: userId, last_count: lastCount, type: type, fromApp: 1 },
    };

    try {
      const response = await axiosInstance.request(options);

      return response?.data;
    } catch (error) {
      console.error("Error fetching Channel List:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
