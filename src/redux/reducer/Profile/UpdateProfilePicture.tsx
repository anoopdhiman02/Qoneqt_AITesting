import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import FormData from "form-data";
import { Platform } from "react-native";
import { ENDPOINTS } from "@/utils/endPoints";

interface updateProfilePicturePayload {
  file?: {
    uri: string;
    name: string;
    type: string;
  };
  userId: number | string;
}

export const onUpdateProfilePicture = createAsyncThunk(
  "profile_picture",
  async ({ file, userId }: updateProfilePicturePayload) => {
    let attachType = "image";
    const formData = new FormData();

    const determineAttachmentType = (name: string) => {
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];
      const audioExtensions = ["mp3", "wav", "ogg"];
      const videoExtensions = ["mp4", "avi", "mov"];

      const extension = name ?  name.split(".").pop().toLowerCase() : 'jpg';

      if (imageExtensions.includes(extension)) return "image";
      if (audioExtensions.includes(extension)) return "audio";
      if (videoExtensions.includes(extension)) return "video";
      if (
        !imageExtensions.includes(extension) &&
        !audioExtensions.includes(extension) &&
        !videoExtensions.includes(extension)
      ) {
        return "null";
      }
    };

    if (attachType != "text") {
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
      } else {
        attachType = attachmentType;
      }
      try {
        formData.append("profile_pic", fileToUpload);
      } catch (error) {
        return null;
      }
    }

    formData.append("fromApp", "1");
    formData.append("user_id", userId.toString());

    const options = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Profile_Edit_Picture}`,
      data: formData,
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error create group:", error);
      return error;
    }
  }
);
