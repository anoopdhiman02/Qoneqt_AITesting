import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import FormData from "form-data";
import { Platform } from "react-native";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";


interface CreatePostPayload {
  group_id?: number;
  fromApp: number;
  cat_id?: number | string;
  fileData?: any;
  post_type?: number;
  attachment?: string;
  description?: string;
  user_id: number | string;
  imageHeight?: any;
  file_key?: string;
  subgroup?: any;
}

// Thunk to create a post
export const createPost = createAsyncThunk(
  "create_post",
  async ({
    description,
    group_id,
    fromApp,
    post_type,
    fileData,
    user_id,
    attachment,
    cat_id,
    imageHeight,
    file_key,
    subgroup
  }: CreatePostPayload) => {
    const data = new FormData();

    const determineFileInfo = (file: { name: string; type?: string }) => {
      const name = file.name.toLowerCase();
      const newType = file.type.split("/");
      const extension = name.split(".").pop() || "";

      const mimeTypes = {
        // Images
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        // Audio
        mp3: "audio/mp3",
        wav: "audio/wav",
        ogg: "audio/ogg",
        m4a: "audio/m4a",
        // Video
        mp4: "video/mp4",
        avi: "video/x-msvideo",
        mov: "video/quicktime",
      };

      const type =
        file.type || mimeTypes[extension] || "application/octet-stream";

      if (type.startsWith("image/")) return { type, category: "image" };
      if (type.startsWith("audio/")) return { type, category: "audio" };
      if (type.startsWith("video/")) return { type, category: "video" };

      return { type: "application/octet-stream", category: "null" };
    };

    if (attachment !== "text" && fileData && fileData.length > 0) {
      let detectedAttachmentType = "null";
      if (attachment != "image") {
        fileData.forEach((file) => {
          const { type, category } = determineFileInfo(file);

          if (category === "null") {
            console.error("Invalid file type:", file.name);
            return;
          }

          if (detectedAttachmentType === "null") {
            detectedAttachmentType = category;
          }

          const fileToUpload = {
            uri:
              Platform.OS === "android"
                ? file.uri
                : file.uri.replace("file://", ""),
            type,
            name: file.name,
          };

          data.append("fileData", fileToUpload);
        });

        attachment = detectedAttachmentType;
      } else {
        if (fileData[0]?.uri) {
          fileData.map((file: any) => {
            data.append("fileData", file);
          });

          // data.append("img_height", imageHeight);
          attachment = "image";
        } else {
          data.append("fileData", fileData.join(","));
          data.append("img_height", imageHeight);
          attachment = "image";
        }
      }
    }

    data.append("fromApp", fromApp);
    // Convert subgroup array to strings and append each one
    if (subgroup && subgroup.length > 0) {
      subgroup.forEach((id) => {
        data.append("subgroup", String(id));
      });
    } else {
      data.append("subgroup", subgroup); // or skip this line if empty array is okay
    }
    data.append("user_id", user_id);
    data.append("description", description || "");
    data.append("post_type", post_type || 0);
    data.append("group_id", group_id || "");
    data.append("cat_id", cat_id || "");
    data.append("attachment", attachment);
    data.append("upload_preset", "ml_default");
    if (attachment != "image") {
      data.append("fileKey", file_key);
    }
    const options = {
      method: "POST",
      url: `${BASE_GO_URL}${
        attachment === "image" && fileData[0]?.uri == undefined
          ? "post/create-imgs"
          : ENDPOINTS.Post_Create
      }`,
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.log("error", JSON.stringify(error));
      return error;
    }
  }
);
