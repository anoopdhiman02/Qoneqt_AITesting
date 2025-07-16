import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL} from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface fetchReferralPayload {
  userId: number | string;
}
export const onFetchReferral = createAsyncThunk(
  "fetch_referral",
  async ({ userId }: fetchReferralPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Get_Referral}`,
      data: {
        user_id: userId,
        fromApp: 1,
      },
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.log("Error fetching referrral:", error);
      return error;
    }
  }
);
