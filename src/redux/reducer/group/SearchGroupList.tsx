import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SearchGroupListPayload {
  userId: string | number;
  key: string | "";
}
export const searchGroupList = createAsyncThunk(
  "search_group",
  async ({ userId, key }: SearchGroupListPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Group_Search_List}`,
      data: {
        user_id: userId,
        search: key,
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching Group_Search_List:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
