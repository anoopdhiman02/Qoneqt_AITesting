import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

// Define the types for the API response and payload
interface EditCategoryNameResponse {
  // Adjust this interface based on the actual structure of your API response
  data: any;
}

interface EditCategoryNamePayload {
  // Adjust the type based on your actual payload structure
  // token: string | null | undefined;

  userId: number;
  groupId: number | string;
  categoryId: number | string;
  categoryName: string;
}
export const onEditCategoryName = createAsyncThunk(
  "edit_category_name",
  async ({
    userId,
    groupId,
    categoryId,
    categoryName,
  }: EditCategoryNamePayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token} `,
      },
      url: `${BASE_URL}${ENDPOINTS.Edit_Category_Name}`,
      data: {
        user_id: userId,
        group_id: groupId,
        category_id: categoryId,
        category: categoryName,
        fromApp: 1,
      },
    };

    try {
      const response = await axiosInstance.request(options);

      return response?.data;
    } catch (error) {
      console.error("Error Edit Category Name:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
