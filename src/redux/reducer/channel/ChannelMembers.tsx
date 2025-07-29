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

interface channelMembersPayload {
  // Adjust the type based on your actual payload structure
  // token: string | null | undefined;
  channelId: any;
  userId: number;
  lastCount: number;
}

export const onFetchChannelMembers = createAsyncThunk(
  "channel_members",
  async ({ userId, channelId, lastCount }: channelMembersPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_URL}${ENDPOINTS.Channel_Member}${channelId}${ENDPOINTS.Channel_Member1}`,
      data: {
        user_id: userId,
        last_count: lastCount,
        fromApp: 1,
      },
    };

    try {
      const response = await axiosInstance.request(options);
      return response;
    } catch (error) {
      console.error("Error fetching channel member:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);

export const onFetchChannelAllMembers = createAsyncThunk(
  "channel_Allmembers",
  async ({ userId, channelId }: channelMembersPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_URL}${ENDPOINTS.Channel_Member}${channelId}${ENDPOINTS.Channel_AllMember}`,
      data: {
        user_id: userId,
        fromApp: 1,
      },
    };

    try {
      const response = await axiosInstance.request(options);
      return response;
    } catch (error) {
      console.error("Error fetching new Channel member:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
