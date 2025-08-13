import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";


interface groupUnreadRequest {
  user_id: number;
  group_id: number;
  fromApp: number;
}

export const groupUnreadReq = createAsyncThunk(
  "Group_Unread",
  async ({ fromApp, user_id, group_id }: groupUnreadRequest) => {
    const body: groupUnreadRequest = {
      user_id: user_id,
      group_id: group_id,
      fromApp: 1,
    };
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },

      url: `${BASE_GO_URL}${ENDPOINTS.Group_Read_Unread}`,
      data: body,
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error group unread:", error);
      return error;
    }
  }
);
