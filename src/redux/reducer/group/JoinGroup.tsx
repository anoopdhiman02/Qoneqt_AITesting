import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface joinGroupPayload {
  user_id: number;
  join: number;
  groupId: number | string;
}
export const onJoinGroup = createAsyncThunk(
  "join_group",
  async ({ user_id, join, groupId }: joinGroupPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Group_Join}${groupId}${ENDPOINTS.Group_Join1}`,
      data: {
        user_id: user_id,
        join: join,
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
