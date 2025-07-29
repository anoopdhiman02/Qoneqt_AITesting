import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

// Define the types for the API response and payload
export interface DynamicActionResponse {
  data: any;
}
interface DynamicActionpayload {
  user_id: Number;
  campaign_id: string;
  status: string;
}
export const DynamicActionReq = createAsyncThunk(
  "Dynamic_Action",
  async ({ user_id, campaign_id, status }: DynamicActionpayload) => {
    const formData = new FormData();
    formData.append("user_id", user_id?.toString());
    formData.append("campaign_id", campaign_id?.toString());
    formData.append("status", status?.toString());
    formData.append("fromApp", "1");
    const options = {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Dynamic_Action_Request}`,
      data: formData,
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching Dynamic_Action_Request:", error);
      return error;
    }
  }
);
