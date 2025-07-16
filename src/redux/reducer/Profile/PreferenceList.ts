import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";


interface PreferenceListPayload {
  userId: number | null | undefined;
}
export const fetchPreferenceList = createAsyncThunk(
  "preference_list",
  async ({ userId }: PreferenceListPayload) => {
    const options = {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Preference_List}`,
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.log("Error fetching Preference_List:", error);
      return error;
    }
  }
);
