import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";


interface ChatUserDetailsPayload {
  userId: number;
  profileId: number;
}
export const onFetchChatUserDetailsApi = createAsyncThunk(
  "chatUserDetails",
  async ({ userId, profileId }: ChatUserDetailsPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.User_Chat_Detail}${profileId}`,
      data: {
        user_id: userId,
        fromApp: 1,
      },
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching user chat details:", error);
      return error;
    }
  }
);
