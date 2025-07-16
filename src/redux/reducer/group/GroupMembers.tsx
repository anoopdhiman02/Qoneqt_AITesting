import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface groupMembersPayload {
  groupId: any;
  userId: number | string;
  type: number;
  lastCount: number;
  search: string;
}
export const onFetchGroupMembers = createAsyncThunk(
  "group_members",
  async ({ groupId, userId, type, lastCount, search }: groupMembersPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Group_Member}${groupId}${ENDPOINTS.Group_Member1}`,
      data: {
        user_id: userId,
        type: type,
        last_count: lastCount,
        search: search,
        fromApp: 1
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return {...response.data, lastCount: lastCount, type: type};
    } catch (error) {
      console.error("Error fetching memeber member1", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
