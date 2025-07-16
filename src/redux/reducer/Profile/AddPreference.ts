import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface addPreferencePayload {
  userId?: number | string;
  category?: any[];
}
export const onAddPreference = createAsyncThunk(
  "add_preference",
  async ({ userId, category }: addPreferencePayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },

      url: `${BASE_GO_URL}${ENDPOINTS.Profile_Update_Favourite}`,

      data: {
        user_id: Number(userId),
        categories: category,
        fromApp: 1,
      },
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching add preference:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);

export const onProfileFavouriteUpdate = createAsyncThunk(
  "profile_favourite_update",
  async ({ userId }: addPreferencePayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },

      url: `${BASE_GO_URL}${ENDPOINTS.Profile_Favourite}`,

      data: {
        user_id: Number(userId),
        fromApp: 1,
      },
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error profile_favourite_update:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
