import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface EventLeaderBoardPayload {
  user_id: Number;
}
export const onFetchEventLeaderBoard = createAsyncThunk(
  "event_leaderBoard",
  async ({ user_id }: EventLeaderBoardPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Event_Leader_Board}`,
      data: { user_id: user_id, fromApp: 1 },
    };

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);
