import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GetSubGroupListPayload {
  userId: string | number;
  groupId: string | number;
  key: string | "";
}
export const getSubgroupList = createAsyncThunk(
  "get_subgroup_post",
  async ({ userId, groupId, key }: GetSubGroupListPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Sub_Group_Get_List}`,
      data: {
        user_id: userId,
        group_id: groupId,
        search: key,
        fromApp: 1,
      },
    };
    const token = await AsyncStorage.getItem("acc_token");
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching Group_Search_List:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
