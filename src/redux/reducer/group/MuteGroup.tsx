import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";


interface MuteGroupPayload {
  user_id: Number;
  group_id: string;
  mute_status: Number;
  mute_untill: Number;
  fromApp?: any;
}

export const MuteGrouprequest = createAsyncThunk(
  "Mute_Group",
  async ({ group_id, mute_status, mute_untill, user_id }: MuteGroupPayload) => {
    const reqBody: MuteGroupPayload = {
      group_id: group_id,
      user_id: user_id,
      mute_status: mute_status,
      mute_untill: mute_untill,
      fromApp: 1
    };
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Group_Mute}`,
      data: reqBody,
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);
