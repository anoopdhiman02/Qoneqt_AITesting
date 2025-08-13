import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL} from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface changeKycContactPayload {
  userId: string | number;
  contact: string;
  isMobile: string | number;
}
export const onChangeKycContact = createAsyncThunk(
  "change_kyc_contact",
  async ({ userId, contact, isMobile }: changeKycContactPayload) => {
    const options = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      url: `${BASE_GO_URL}${ENDPOINTS.Change_KYC_Contact}`,
      data: {
        user_id: userId,
        contact: contact,
        is_mobile: isMobile?.toString(),
        fromApp: 1,
      },
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);
