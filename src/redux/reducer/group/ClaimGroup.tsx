import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "@/utils/constants";
import { ENDPOINTS } from "@/utils/endPoints";

interface ClaimGrouppayload {
  user_id: string;
  groupid: any;
  attachment: any; // Attachment should be an object with URI, type, and name.
}

export const ClaimGroupSubmitRequest = createAsyncThunk(
  "Claim_Group",
  async ({ attachment, groupid, user_id }: ClaimGrouppayload) => {
    const formData = new FormData();
    if (attachment && attachment[0].uri) {
        formData.append("attachment", attachment[0]);
    } else {
      console.error("No attachment found");
      return null;
    }

    formData.append("groupid", groupid);
    formData.append("user_id", user_id);
    formData.append("fromApp", "1");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Claim_Group}`,
      data: formData,
    };
    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      console.error("Error claiming group:", error);
      return error;
    }
  }
);
