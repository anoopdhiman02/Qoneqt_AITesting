import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL} from "../../../utils/constants";
import FormData from "form-data";
import axiosInstance from "@/utils/axiosInstance";
import { Platform } from "react-native";
import { ENDPOINTS } from "@/utils/endPoints";


interface createGroupPayload {
  userId?: string;
  description?: string;
  name?: string;
  category?: number;
  type?: number | string;
  fee?: string;
  subscriptionType?: number;
  distribution?: number;
  attachType?: string;
  file?: {
    uri: string;
    name: string;
    type: string;
  };
}
export const createGroup = createAsyncThunk(
  "create_group",
  async ({
    userId,
    name,
    description,
    category,
    type,
    fee,
    distribution,
    attachType,
    subscriptionType,
    file,
  }: createGroupPayload) => {

    try {
      const determineAttachmentType = (name: string) => {
        const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  
        const extension = name ?  name.split(".").pop().toLowerCase() :'jpg';
        if (imageExtensions.includes(extension)) return "image";
        if (!imageExtensions.includes(extension)) {
          return "null";
        }
      };
  
  
      const formData = new FormData();
  
      if (attachType != "text") {
        const fileToUpload = {
          uri:
            Platform.OS === "android"
              ? file.uri
              : file.uri.replace("file://", ""),
          type: file?.type || "image/jpeg",
          name: file?.name || "image.jpg",
        };
        const attachmentType = determineAttachmentType(file.name);
        if (attachmentType === "null") {
          console.log(`Attachment error`)
          return null;
        } else {
          attachType = attachmentType;
        }
        try {
          formData.append("fileData", fileToUpload);
        } catch (error) {
          console.log(`File error`, error)
          return null;
        }
      }
      formData.append("user_id", userId);
      formData.append("description", description);
      formData.append("category", category.toString());
      formData.append("name", name);
      formData.append("type", type.toString());
      formData.append("member_fee", fee);
      formData.append("fee_distribution", distribution.toString());
      formData.append("subscription_type", subscriptionType.toString());
      formData.append("attachment", attachType);
      formData.append("fromApp", "1");
  
      const options = {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${token} `,
        },
  
        url: `${BASE_GO_URL}${ENDPOINTS.Create_Group}`,
        data: formData,
      };
      const response = await axiosInstance.request(options);
      return response.data;

    } catch (error) {
      console.error("Error create group:", error);
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
