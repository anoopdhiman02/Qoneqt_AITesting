import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";


interface FollowerListPayload {
  userId: number;
  profileId: number;
  lastCount: number;
}
export const onGetFollowers = createAsyncThunk(
  "follower_list",
  async ({ userId, profileId, lastCount }: FollowerListPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Profile}${profileId}${ENDPOINTS.Followers}`,
      data: JSON.stringify({
        profile_id: Number(profileId),
        last_count: lastCount,
        user_id: userId,
        fromApp: 1,
      }),
    };

    try {
      const response = await axiosInstance.request(options);
      return {...response.data, lastCount};
    } catch (error) {
      return error;
    }
  }
);
