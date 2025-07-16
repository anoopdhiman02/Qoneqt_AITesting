import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface joinRequestListPayload {
  // Adjust the type based on your actual payload structure
  user_id: number;
  groupId: number | string;
}
export const onJoinRequestList = createAsyncThunk(
  "join_group",
  async ({ user_id, groupId }: joinRequestListPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.JoinRequestList}`,
      data: {
        user_id: user_id,
        group_id: Number(groupId),
        fromApp: 1,
      },
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
