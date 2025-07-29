import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface joinRequestUpdatePayload {
  // Adjust the type based on your actual payload structure
  user_id: number;
  group_id: number | string;
  change: number;
  join_uid: number;
}
export const onJoinRequestUpdate = createAsyncThunk(
  "join_group",
  async ({ user_id, group_id, change, join_uid }: joinRequestUpdatePayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.JoinRequestUpdate}`,
      data: {
        user_id: user_id,
        group_id: Number(group_id),
        change: change,
        join_uid: join_uid,
        fromApp: 1,
      },
    };
    var token = await AsyncStorage.getItem("acc_token");

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error create group:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
