import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import { determineAttachmentType } from "@/utils/r2Uploads";
import axiosInstance from "@/utils/axiosInstance";
import { Platform } from "react-native";
import { ENDPOINTS } from "@/utils/endPoints";

interface submitPanKycPayload {
  userId: string | number;
  pan_card_front?: any;
  with_profile?: number;
  profile_verification?: any;
}
export const onSubmitPanKyc = createAsyncThunk(
  "submit_event_kyc",
  async ({
    userId,
    pan_card_front,
    with_profile,
    profile_verification,
  }: submitPanKycPayload) => {

    const formData = new FormData();
    formData.append("fromApp", "1");
    formData.append("user_id", userId.toString());

    if (pan_card_front != "") {
      const fileToUpload: any = {
        uri:
          Platform.OS === "android"
            ? pan_card_front.uri
            : pan_card_front.uri.replace("file://", ""),
        type: pan_card_front.type || "image/jpeg",
        name: pan_card_front.name || "image.jpg",
      };
      const attachmentType = determineAttachmentType(pan_card_front.name);
      if (attachmentType === "null") {
        return null;
      }
      try {
        formData.append("pan_card_front", fileToUpload);
      } catch (error) {
        return null;
      }
    }

    if (with_profile === 1) {
      const fileToUpload: any = {
        uri:
          Platform.OS === "android"
            ? profile_verification.uri
            : profile_verification.uri.replace("file://", ""),
        type: profile_verification.type || "image/jpeg",
        name: profile_verification.name || "image.jpg",
      };
      const attachmentType = determineAttachmentType(profile_verification.name);
      if (attachmentType === "null") {
        return null;
      }
      try {
        formData.append("pan_card_front", fileToUpload);
      } catch (error) {
        return null;
      }
    }

    const options = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.KYC_PAN_UPLOAD}`,
      data: formData,
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error submit pan:", JSON.stringify(error));
      return error;
    }
  }
);
