import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";


interface GroupDetailsPayload {
  // Adjust the type based on your actual payload structure
  // token: string | null | undefined;
  userId: string | number | undefined;
  groupId: string;
}
export const groupDetailsApi = createAsyncThunk(
  "group_details",
  async ({ groupId, userId }: GroupDetailsPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Group_Detail}${groupId}${ENDPOINTS.Group_Detail1}`,
      data: {
        user_id: userId,
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching Group Details:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
