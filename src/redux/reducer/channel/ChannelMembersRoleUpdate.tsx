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

interface channelRoleUpdateload {
  // Adjust the type based on your actual payload structure
  token: string | null | undefined;
  user_id: number;
  channel_id: number;
  role: String;
}
export const onChannelRoleUpdate = createAsyncThunk(
  "update_role",
  async ({ token, user_id, channel_id, role }: channelRoleUpdateload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token} `,
      },
      url: `${BASE_URL}${URL_PATH}${ENDPOINTS.Channel_Role}`,
      data: JSON.stringify({
        user_id: user_id,
        id: channel_id,
        role: role,
        fromApp: 1,
      }),
    };

    try {
      const response = await axiosInstance.request(options);

      return response.data;
    } catch (error) {
      console.error("Error create group:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
