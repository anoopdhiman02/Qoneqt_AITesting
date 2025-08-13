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

interface channelDetailPayload {
  // Adjust the type based on your actual payload structure
  // token: string | null | undefined;
  channelId: string;
  userId: number;
}
export const onGetChannelDetails = createAsyncThunk(
  "channel_detail",
  async ({ userId, channelId }: channelDetailPayload) => {
    const options = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer ${token} `,
      },
      url: `${BASE_URL}${ENDPOINTS.Channel_Detail}${channelId}${ENDPOINTS.Channel_Detail1}`,
      data: {
        user_id: userId,
        fromApp: 1,
      },
    };

    try {
      const response = await axiosInstance.request(options);

      return response;
    } catch (error) {
      console.error("Error create group:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
