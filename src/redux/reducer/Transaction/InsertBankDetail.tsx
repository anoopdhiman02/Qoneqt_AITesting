import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { BASE_GO_URL } from "@/utils/constants";
import { ENDPOINTS } from "@/utils/endPoints";

interface insertBankDetails {
  userId?: string | number;
  account_name: string;
  account_number: string;
  bank_name: string;
  branch_name: string;
  ifsc_code: string;
  type: string | number;
}
export const onInsertBankDetail = createAsyncThunk(
  "insert_bank",
  async ({
    userId,
    account_name,
    account_number,
    bank_name,
    branch_name,
    ifsc_code,
    type,
  }: insertBankDetails) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Profile_Update_Bank_Detail}`,
      data: {
        fromApp: 1,
        user_id: userId,
        account_name: account_name,
        account_number: account_number,
        bank_name: bank_name,
        branch_name: branch_name,
        ifsc: ifsc_code,
        type: type,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.log("wee", error)
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
