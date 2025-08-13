import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface SaveDetailsPayload {
  userId: string | null | undefined;
  city: string;
  country: string;
  website: string;
}
export const onSavePersonalDetails = createAsyncThunk(
  "save_personal_details",
  async ({
    userId,
    city,
    country,
    website,
  }: SaveDetailsPayload) => {
    var form = new FormData();
    form.append("fromApp", "1");
    form.append("user_id", userId);
    form.append("city", city);
    form.append("country", country);
    form.append("website", website);
    form.append("show", "0");

    const options = {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Profile_Edit_Contact}`,
      data: form,
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching Profile_Edit_Contact:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
