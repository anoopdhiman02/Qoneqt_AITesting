import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL} from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface addCommentPayload {
  userId: any;
  postId: string;
  comment: any;
  parent: string;
  attachmentType: any;
  file: any;
}
export const onAddComment = createAsyncThunk(
  "add_comment",
  async ({
    userId,
    postId,
    comment,
    parent,
  }: addCommentPayload) => {
    const formData = new FormData();
    formData.append("fromApp", "1");
    formData.append("user_id", userId);
    formData.append("comment", comment);
    formData.append("parent", parent);
    formData.append("attachment", "text");
    formData.append("fileData", "");
    const options = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Comment_Add}${postId}${ENDPOINTS.Comment_Add1}`,
      data: formData,
    };
    try {
      const response = await axiosInstance.request(options);
      return response?.data;
    } catch (error) {
      console.error("Error fetching Comment_Add:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
