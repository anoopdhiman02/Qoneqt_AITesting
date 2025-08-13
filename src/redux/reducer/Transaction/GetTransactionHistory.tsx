import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

export interface Datum {
  id?: number;
  transaction_id?: string;
  transaction_type?: string;
  transaction_amount?: number;
  transaction_status?: string;
  sender_id?: number;
  receiver_id?: number;
  payment_mode?: string;
  loop_id?: number;
  post_id?: number;
  created_at?: Date;
}

interface transactionHistoryPayload {
  userId: number;
  lastCount: number;
}
export const getTransactionHistory = createAsyncThunk(
  "transaction_history",
  async ({ userId, lastCount }: transactionHistoryPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.TransAction_List}`,
      data: {
        user_id: userId,
        last_count: lastCount,
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return {...response.data, last_count: lastCount};
      
    } catch (error) {
      console.error("Error fetching TransAction_List", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
