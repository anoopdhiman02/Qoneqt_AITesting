import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";


interface FollowingGroupsPayload {
  // Adjust the type based on your actual payload structure
  userId: number;
  lastCount: number;
}
export const fetchFollowingGroups = createAsyncThunk(
  "following_groups",
  async ({ userId, lastCount }: FollowingGroupsPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token} `,
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Get_Following_Group}`,
      data: {
        user_id: userId,
        last_count: lastCount,
        fromApp: 1,
      },
    };

    try {
      const response = await axiosInstance.request(options);
      return {...response?.data, lastCount: lastCount};
    } catch (error) {
      console.error("Error fetching get following group:", error);
      // Re-throw the error to let it propagate to the component
      return error;
      // return error;
    }
  }
);
