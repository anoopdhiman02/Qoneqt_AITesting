import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface deletegroupRequest {
  group_id : number,
    user_id : number,
    fromApp?: number
}

export const deletegroupReq = createAsyncThunk(
  "Delete_Group",
  async ({ group_id, user_id }: deletegroupRequest) => {
    const reqBody: deletegroupRequest = {
      group_id: Number(group_id),
      user_id: user_id,
      fromApp: 1
    };
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Delete_Group}`,
      data: reqBody,
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error adding perks :", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
