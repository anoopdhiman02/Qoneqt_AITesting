import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, URL_PATH } from "../../../utils/constants";
import { uploadToR2 } from "@/utils/r2Uploads";
import axiosInstance from "@/utils/axiosInstance";
import FormData from "form-data";
import { Platform } from "react-native";
import { router } from "expo-router";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { ENDPOINTS } from "@/utils/endPoints";

// Define the types for the API response and payload
interface ProfileDetailsResponse {
  // Adjust this interface based on the actual structure of your API response
  data: any;
}

interface CategoryChannelPayload {
  // Adjust the type based on your actual payload structure
  userId: number | string | Blob;
  groupId: string;
  channelName: string;
  categoryId: number;
  type: number;
  file: any;
  perk: string;
}
export const onCreateCategoryChannel = createAsyncThunk(
  "create_channel",
  async ({
    userId,
    groupId,
    categoryId,
    channelName,
    type,
    file,
    perk,
  }: CategoryChannelPayload) => {
    try {
      let r2UploadResult = null;

      const determineAttachmentType = (name: string) => {
        const imageExtensions = ["jpg", "jpeg", "png", "gif"];

        const extension = name ?  name.split(".").pop().toLowerCase() :'jpg';

        if (imageExtensions.includes(extension)) return "image";
        if (!imageExtensions.includes(extension)) {
          return "null";
        }
      };

      let data = new FormData();
      if (file != "") {
        const fileToUpload = {
          uri:
            Platform.OS === "android"
              ? file.uri
              : file.uri.replace("file://", ""),
          type: file.type || "image/jpeg",
          name: file.name || "image.jpg",
        };
        const attachmentType = determineAttachmentType(file.name);
        if (attachmentType === "null") {
          return null;
        }
        try {
          data.append("channel_pic", fileToUpload);
        } catch (error) {
          return null;
        }
      }
      data.append("user_id", userId.toString());
      data.append("group_id", groupId);
      data.append("channel_name", channelName);
      data.append("type", type.toString());
      data.append("category_id", categoryId.toString());

      data.append("perks", perk);
      data.append("fromApp", "1");

      const options = {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${token} `,
        },
        url: `${BASE_URL}${ENDPOINTS.Channel_Create_Category}`,
        data: data,
      };

      try {
        const response = await axiosInstance.request(options);
        if (response.data.success) {
          showToast({
            type: "success",
            text1: response.data?.message,
          });
          router.back();
          return response.data;
        } else {
          showToast({
            type: "error",
            text1: response.data?.message || "Something went wrong",
          });
          return response.data;
        }
      } catch (error) {
        console.error("Error create group:", error);
        // Re-throw the error to let it propagate to the component
        return error;
      }
    } catch (error) {
      console.error("Error create group:>>", error);
      return error;
    }
  }
);
