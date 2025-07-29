import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL} from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface FollowingListPayload {
  userId: number;
  profileId: number;
  lastCount: number;
}
export const onFetchFollowings = createAsyncThunk(
  "following_list",
  async ({ userId, profileId, lastCount }: FollowingListPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Profile}${profileId}${ENDPOINTS.Followings}`,
      data: {
        fromApp: 1,
        last_count: lastCount,
        profile_id: Number(profileId),
        user_id: userId,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return {...response.data, lastCount};
    } catch (error) {
      console.log("Error fetching Profile_Following_List:", error);
      return error;
    }
  }
);
