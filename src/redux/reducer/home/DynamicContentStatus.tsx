import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL} from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

// Define the types for the API response and payload
export interface DynamicContentStatusResponse {
  data: any;
}
interface DynamicContentStatusRequests {
  user_id?: Number;
  fromApp?: any
}
export const DynamicContentStatusReq = createAsyncThunk(
  "Dynamic_Content_Status",
  async ({ user_id }: DynamicContentStatusRequests) => {
   const formData = new FormData();
   formData.append("user_id", user_id?.toString());
   formData.append("fromApp", "1");
    const options = {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Dynamic_Content_Status_Request}`,
      data: formData,
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching Dynamic_Content_Status_Request:", error);
      return error;
    }
  }
);
