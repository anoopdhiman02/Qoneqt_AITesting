import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../../utils/constants";
import { showToast } from "@/components/atom/ToastMessageComponent";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface EventPostDetailsPayload {
  postId: number | string;
  eventId: number | string;
  userId: number | string;
}
export const onFetchEventPostDetail = createAsyncThunk(
  "post_details",
  async ({ postId, eventId, userId }: EventPostDetailsPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_URL}${ENDPOINTS.Event_Post_Detail}`,
      data: {
        postId: postId,
        groupId: eventId,
        user_id: userId,
        fromApp: 1,
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;

    } catch (error) {
      showToast({ type: "info", text1: error.message || "Something went wrong" });
      return error;
    }
  }
);
