import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, URL_PATH } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

// Define the types for the API response and payload
interface ChannelInfoResponsePayload {
  // Adjust this interface based on the actual structure of your API response
  data: any;
}

interface ChannelInfoPayload {
  // Adjust the type based on your actual payload structure
  // token: string | null | undefined;

  userId?: any;
  channelId?: any;
}
export const onFetchChannelInfo = createAsyncThunk(
  "channel_info",
  async ({ userId, channelId }: ChannelInfoPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token} `,
      },
      url: `${BASE_URL}${ENDPOINTS.Channel_Info}${channelId}${ENDPOINTS.Channel_Info1}`,
      data: { user_id: userId, fromApp: 1 },
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error channel info:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
