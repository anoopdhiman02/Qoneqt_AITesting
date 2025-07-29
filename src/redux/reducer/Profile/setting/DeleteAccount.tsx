import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface deleteAccountPayload {
  userId?: number;
  reason?: string;
}
export const onDeleteAccount = createAsyncThunk(
  "delete_account",
  async ({ userId, reason }: deleteAccountPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Delete_Account}`,
      data: {
        user_id: userId,
        fromApp: 1,
        reason: reason,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching Delete_Account:", error);
      return error;
    }
  }
);


export const onUnDeleteAccount = createAsyncThunk(
  "UNdelete_account",
  async ({ userId }: deleteAccountPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.UnDelete_Account}`,
      data: {
        user_id: userId,
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching Delete_Account:", error);
      return error;
    }
  }
);