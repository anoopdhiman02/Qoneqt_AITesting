import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { BASE_GO_URL } from "../../../utils/constants";
import { ENDPOINTS } from "@/utils/endPoints";


interface UserFeedsPayload {
  userId: number | string | undefined;
  lastCount: number;
  profileId: number | string | undefined;
}
export const onFetchUserFeeds = createAsyncThunk(
  "user_feeds",
  async ({ userId, lastCount, profileId }: UserFeedsPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}profile/${profileId}/feeds`,
      data: {
        user_id: userId,
        last_count: lastCount,
        profile_id: profileId,
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return {...response.data,last_count: lastCount};
    } catch (error) {
      console.error("Error fetching Profile_Feed:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
export const onFetchMyUserFeeds = createAsyncThunk(
  "my_user_feeds",
  async ({ userId, lastCount, profileId }: UserFeedsPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}profile/${profileId}/feeds`,
      data: {
        user_id: userId,
        last_count: lastCount,
        profile_id: profileId,
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return {...response.data,last_count: lastCount};
    } catch (error) {
      console.log("Error fetching Profile_Feed:>>", error);
      return error
    }
  }
);
