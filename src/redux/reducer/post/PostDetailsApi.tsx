import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { BASE_GO_URL } from "../../../utils/constants";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { ENDPOINTS } from "@/utils/endPoints";

interface PostDetailsPayload {
  postId: string;
  userId: number | string;
}
export const onFetchPostDetail = createAsyncThunk(
  "post_details",
  async ({ userId, postId }: PostDetailsPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Post_Details}${postId}`,
      data: { user_id: userId, fromApp: 1 },
    };
    console.log("options", options);

    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching Post_Details:", error);
      // Re-throw the error to let it propagate to the component
      showToast({ type: "error", text1: error.message || "Something went wrong" });
      return error;
    }
  }
);
