import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";


interface fetchBankDetailPayload {
  // Adjust the type based on your actual payload structure
  //   token: string | null | undefined;
  userId: number | string;
}
export const onFetchBankDetail = createAsyncThunk(
  "fetch_bank-detail",
  async ({ userId }: fetchBankDetailPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token} `,
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Get_Bank_Details}`,
      data: {
        user_id: userId,
        fromApp: 1,
      },
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.log("Error fetching bank details:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
