import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface followUserPayload {
  userId: number;
  profileId: number | string;
  isFollow: number;
}
export const onFollowUser = createAsyncThunk(
  "",
  async ({ userId, profileId, isFollow }: followUserPayload) => {
    const options = {
      method: "post",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },

      url: `${BASE_GO_URL}${ENDPOINTS.Profile_Follow_Users}${profileId}${ENDPOINTS.Profile_Follow_Users1}`,
      data: {
        user_id: userId,
        follow: isFollow,
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);

      return response.data;
    } catch (error) {
      console.error("Error fetching follow user:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
