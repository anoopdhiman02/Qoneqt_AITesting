import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface checkWithdrawalPayload {
  user_id?: number | string;
  amount?: any;
}
export const onCheckWithdrawal = createAsyncThunk(
  "check_withdrawal",
  async ({ user_id, amount }: checkWithdrawalPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Check_Withdraw}`,
      data: {
        user_id: user_id,
        amount: amount,
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
