import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";
interface MyGroupsPayload {
  userId: number;
  lastCount: number;
}
export const fetchMyGroups = createAsyncThunk(
  "my_groups",
  async ({ userId, lastCount }: MyGroupsPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Get_My_Group}`,
      data: {
        user_id: userId,
        last_count: lastCount,
        search: "",
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return {...response.data, lastCount: lastCount};
    } catch (error) {
      console.error("Error fetching group/myGroups:", error);
      // Re-throw the error to let it propagate to the component
      return error;
      // return error;
    }
  }
);
