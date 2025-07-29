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

interface DeleteCategoryPayload {
  category_id: Number;
  group_id: Number;
  user_id: Number;
  fromApp: Number;
}
export const onDeleteCategory = createAsyncThunk(
  "delete_category",
  async ({
    category_id,
    fromApp,
    group_id,
    user_id,
  }: DeleteCategoryPayload) => {
    const body: DeleteCategoryPayload = {
      category_id: category_id,
      group_id: group_id,
      user_id: user_id,
      fromApp: fromApp,
    };
    const options = {
      method: "post",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        // Authorization: `Bearer ${token} `,
      },
      url: `${BASE_URL}${ENDPOINTS.Delete_Channel_Category}`,
      data: body,
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
