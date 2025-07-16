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

interface ChannelGroupInfoPayload {
  // Adjust the type based on your actual payload structure
  // token: string | null | undefined;

  userId: number;
  groupId: string | string[];
}
export const onFetchChannelGroupInfo = createAsyncThunk(
  "channel_group_info",
  async ({ userId, groupId }: ChannelGroupInfoPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token} `,
      },
      url: `${BASE_URL}${ENDPOINTS.Channel_Group}${groupId}`,
      data: { user_id: userId, fromApp: 1 },
    };

    try {
      const response = await axiosInstance.request(options);

      return response.data;
    } catch (error) {
      console.error("Error channel group info:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
