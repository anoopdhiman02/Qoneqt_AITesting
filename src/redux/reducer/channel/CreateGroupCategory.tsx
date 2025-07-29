import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, URL_PATH } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

// Define the types for the API response and payload
interface ProfileDetailsResponse {
  // Adjust this interface based on the actual structure of your API response
  data: any;
}

interface createChannelCategoryPayload {
  // Adjust the type based on your actual payload structure

  group_id: number;
  user_id: number | null | undefined;
  categoryName: string;
}
export const onCreateGroupCategory = createAsyncThunk(
  "create_category",
  async ({ group_id, user_id, categoryName }: createChannelCategoryPayload) => {
    const options = {
      method: "post",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        // Authorization: `Bearer ${token} `,
      },
      url: `${BASE_URL}${ENDPOINTS.Group_Create_Category}`,
      data: {
        user_id: user_id,
        group_id: group_id,
        category: categoryName,
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
