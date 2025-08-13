import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface GroupInfoRequest {
  user_id: number;
  groupId: number;
  fromApp: number;
}

export const GrounInforeq = createAsyncThunk(
  "group_Info",
  async ({ user_id, groupId }: GroupInfoRequest) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },

      url: `${BASE_GO_URL}${ENDPOINTS.Groups_Info}${groupId}${ENDPOINTS.Groups_Info1}`,
      data: {
        user_id: user_id,
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error group info:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
