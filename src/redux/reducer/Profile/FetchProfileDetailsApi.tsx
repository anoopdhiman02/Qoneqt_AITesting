import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface userDetailsPayload {
  user_id: number | null | undefined;
}
interface FetchProfileDetailsPayload {
  // Adjust the type based on your actual payload structure
  profile?: string | null | undefined;
  userId?: number | null | undefined;
}

export const fetchMyProfileDetails = createAsyncThunk(
  "my_profile_details",
  async ({ profile, userId }: FetchProfileDetailsPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Profile_LoginUser}`,
      data: { user_id: userId, fromApp: 1 },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.log("error",error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
export const fetchProfileDetails = createAsyncThunk(
  "profile_details",
  async ({ profile, userId }: FetchProfileDetailsPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Profile_Follow_Users}${profile}`,
      data: { user_id: userId, fromApp: 1 },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
