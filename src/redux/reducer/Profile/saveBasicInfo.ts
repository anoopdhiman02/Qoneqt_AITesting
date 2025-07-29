import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { BASE_GO_URL } from "../../../utils/constants";
import { ENDPOINTS } from "@/utils/endPoints";


interface SaveDetailsPayload {
  firstName: string;
  lastName: string;
  headline: string;
  socialName: string;
  userId: string | number;
}
export const onSaveBasicInfo = createAsyncThunk(
  "save_basic_info",
  async ({
    userId,
    firstName,
    lastName,
    headline,
    socialName,
  }: SaveDetailsPayload) => {
    var form = new FormData();
    form.append("fromApp", "1");
    form.append("user_id", userId.toString());
    form.append("fullname", firstName + " " + lastName);
    form.append("about", headline);
    form.append("social_name", socialName);

    const options = {
      method: "post",

      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Profile_Edit_Info}`,
      data: form,
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching Profile_Edit_Info:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
