import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import FormData from "form-data";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface CreateEventPostPayload {
  file?: {
    uri: string;
    name: string;
    type: string;
  };
  userId: number | string;
  desc?: string;
  postType?: number;
  group_id?: number;
  catId?: number | string;
  attachType?: string;
  eventName: string;
  imgHeight?: any;
}

// Thunk to create a post
export const createEventPost = createAsyncThunk(
  "create_post",
  async ({
    desc,
    group_id,
    postType,
    file,
    userId,
    attachType,
    catId,
    eventName,
    imgHeight
  }: CreateEventPostPayload) => {
    const data = new FormData();

    // Append the other fields
    data.append("fromApp", "1");
    data.append("user_id", String(userId));
    data.append("description", desc || "");
    data.append("post_type", String(postType || 0));
    data.append("group_id", String(group_id || ""));
    data.append("cat_id", String(catId || "1"));
    data.append("attachment", "image");
    data.append("fileData", file);
    data.append("event_name", eventName);
    data.append("img_height", imgHeight);



    const options = {
      method: "POST",
      url: `${BASE_GO_URL}${ENDPOINTS.Event_Create_Post}`,
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    try {
      const response = await axiosInstance.request(options);
      console.log("res", JSON.stringify(response.data))
      return response.data;
    } catch (error) {
      console.error("Full error object:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      // return error;
      return error;
    }
  }
);
