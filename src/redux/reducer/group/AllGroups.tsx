import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL} from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";


interface AllGroupRequest {
  user_id: number;
  last_count: number;
  fromApp: number;
}
export const AllGroupReq = createAsyncThunk(
  "All_Groups",
  async ({ last_count, user_id }: AllGroupRequest) => {
    const body: AllGroupRequest = {
      user_id: user_id,
      last_count: last_count,
      fromApp: 1,
    };
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.All_Groups}`,
      data: body,
    };

    try {
      const response = await axiosInstance.request(options);
      return {...response.data, lastCount: last_count};
    } catch (error) {
      console.error("Error fetching all Groups:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
