import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface submitBasicDetailsPayload {
  userId: string | number;
  identificationType: number;
  isMobile: number;
  firstName: string;
  lastName: string;
  contact: string;
  dob: string;
  gender: string;
}

interface submitSelfiePayload {
    userId: string | number;
    faceVerification: any;
  }
  interface submitKycOtpPayload {
    userId?: string | number;
    otp?: string | number;
  }
  interface submitAadharPayload {
    userId?: string | number;
    adhaar_card_front?: any;
    adhaar_card_back?: any;
  }
  interface submitPanPayload {
    userId: string | number;
    pan_card_front: any;
  }
  interface submitSendOtpPayload {
    userId?: any;
    contact?: any;
  }

export const kycBasicDetails = createAsyncThunk(
  "kyc_basic_details",
  async ({
    userId,
    firstName,
    lastName,
    contact,
    dob,
    gender,
    identificationType,
    isMobile,
  }: submitBasicDetailsPayload) => {

    const formData = new FormData();
    formData.append("fromApp", "1");
    formData.append("user_id", userId.toString());
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("contact", contact);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("identification_type", identificationType.toString());
    formData.append("is_mobile", isMobile.toString());
    formData.append("fromApp","1");

    const options = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.KYC_BASIC_INO}`,
      data: formData,
    };
    var token = await AsyncStorage.getItem("acc_token");
    console.log("options", JSON.stringify(options), token);
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.error("Error KYC_BASIC_INO:", JSON.stringify(error));
      return error
    }
  }
);

export const onKycSelfie = createAsyncThunk(
    "kyc_Selfie",
    async ({
      userId,
      faceVerification,
    }: submitSelfiePayload) => {
  
      const determineAttachmentType = (name: string) => {
        const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  
        const extension = name ?  name.split(".").pop().toLowerCase() :'jpg';
  
        if (imageExtensions.includes(extension)) return "image";
        if (!imageExtensions.includes(extension)) {
          return "null";
        }
      };
  
      const formData = new FormData();
      formData.append("fromApp", "1");
      formData.append("user_id", userId.toString());
      if (faceVerification != "") {
        const fileToUpload: any = {
          uri:
            Platform.OS === "android"
              ? faceVerification.uri
              : faceVerification.uri.replace("file://", ""),
          type: faceVerification.type || "image/jpeg",
          name: faceVerification.name || "image.jpg",
        };
        const attachmentType = determineAttachmentType(faceVerification.name);
        if (attachmentType === "null") {
          return null;
        }
        try {
          formData.append("face_verification", fileToUpload);
        } catch (error) {
          return null;
        }
      }
  
      const options = {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${token} `,
        },
  
        url: `${BASE_GO_URL}${ENDPOINTS.KYC_SELFI_UPLOAD}`,
        data: formData,
      };
      try {
        const response = await axiosInstance.request(options);
        return response.data;
      } catch (error) {
        console.error("Error create group:", JSON.stringify(error));
        // Re-throw the error to let it propagate to the component
        return error
      }
    }
  );

export const onKycOtpVerify = createAsyncThunk(
    "kyc_otp_verify",
    async ({
      userId,
      otp,
    }: submitKycOtpPayload) => {

  
      const formData = new FormData();
      formData.append("fromApp", "1");
      formData.append("user_id", userId.toString());
      formData.append("otp", otp.toString());
      
  
      const options = {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${token} `,
        },
  
        url: `${BASE_GO_URL}${ENDPOINTS.KYC_OTP_VERIFY}`,
        data: formData,
      };
      try {
        const response = await axiosInstance.request(options);
        return response.data;
      } catch (error) {
        console.error("Error create group:", JSON.stringify(error));
        // Re-throw the error to let it propagate to the component
        return error
      }
    }
  );

  export const onKycAadharUpload = createAsyncThunk(
    "kyc_AadharUpload",
    async ({
      userId,
      adhaar_card_front,
      adhaar_card_back
    }: submitAadharPayload) => {
  
      const determineAttachmentType = (name: string) => {
        const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  
        const extension = name ?  name.split(".").pop().toLowerCase() :'jpg';
  
        if (imageExtensions.includes(extension)) return "image";
        if (!imageExtensions.includes(extension)) {
          return "null";
        }
      };
  
      const formData = new FormData();
      formData.append("fromApp", "1");
      formData.append("user_id", userId.toString());
      if (adhaar_card_front != "") {
        const fileToUpload: any = {
          uri:
            Platform.OS === "android"
              ? adhaar_card_front.uri
              : adhaar_card_front.uri.replace("file://", ""),
          type: adhaar_card_front.type || "image/jpeg",
          name: adhaar_card_front.name || "image.jpg",
        };
        const attachmentType = determineAttachmentType(adhaar_card_front.name);
        if (attachmentType === "null") {
          return null;
        }
        try {
          formData.append("adhaar_card_front", fileToUpload);
        } catch (error) {
          return null;
        }
      }
      if (adhaar_card_back != "") {
        const fileToUpload: any = {
          uri:
            Platform.OS === "android"
              ? adhaar_card_back.uri
              : adhaar_card_back.uri.replace("file://", ""),
          type: adhaar_card_back.type || "image/jpeg",
          name: adhaar_card_back.name || "image.jpg",
        };
        const attachmentBackType = determineAttachmentType(adhaar_card_back.name);
        if (attachmentBackType === "null") {
          return null;
        }
        try {
          formData.append("adhaar_card_back", fileToUpload);
        } catch (error) {
          return null;
        }
      }
  
      const options = {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${token} `,
        },
  
        url: `${BASE_GO_URL}${ENDPOINTS.KYC_AADHAR_UPLOAD}`,
        data: formData,
      };
      try {
        const response = await axiosInstance.request(options);
        return response.data;
      } catch (error) {
        console.error("Error create group:", JSON.stringify(error));
        // Re-throw the error to let it propagate to the component
        return error
      }
    }
  );
export const onKycPanUpload = createAsyncThunk(
    "kyc_pan",
    async ({
      userId,
      pan_card_front,
    }: submitPanPayload) => {
  
      const determineAttachmentType = (name: string) => {
        const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  
        const extension = name ?  name.split(".").pop().toLowerCase() :'jpg';
  
        if (imageExtensions.includes(extension)) return "image";
        if (!imageExtensions.includes(extension)) {
          return "null";
        }
      };
  
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
  
      const options = {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${token} `,
        },
  
        url: `${BASE_GO_URL}${ENDPOINTS.KYC_PAN_UPLOAD}`,
        data: formData,
      };
      try {
        const response = await axiosInstance.request(options);
        return response.data;
      } catch (error) {
        console.error("Error pan upload", error);
        // Re-throw the error to let it propagate to the component
        return error
      }
    }
  );
export const onKycSendOtp = createAsyncThunk(
    "kyc_send_otp",
    async ({
      userId,
      contact,
    }: any) => {

  
      const formData = new FormData();
      formData.append("fromApp", "1");
      formData.append("user_id", userId.toString());
      formData.append("contact", contact.toString());
      
  
      const options = {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
  
        url: `${BASE_GO_URL}${ENDPOINTS.KYC_SEND_OTP}`,
        data: formData,
      };
      try {
         const response = await axiosInstance.request(options);
        return response.data;
      } catch (error) {
        console.log("Error create group>>>:", error);
        // Re-throw the error to let it propagate to the component
        return error
      }
    }
  );

  export const onKycChangeContact = createAsyncThunk(
    "kyc_change_contact",
    async ({
      userId,
      contact,
    }: submitSendOtpPayload) => {

  
      const formData = new FormData();
      formData.append("fromApp", "1");
      formData.append("user_id", userId.toString());
      formData.append("contact", contact.toString());
      
  
      const options = {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
  
        url: `${BASE_GO_URL}${ENDPOINTS.KYC_CHANGE_CONTACT}`,
        data: formData,
      };
      try {
         const response = await axiosInstance.request(options);
        return response.data;
      } catch (error) {
        console.error("Error Change Contact:", error);
        // Re-throw the error to let it propagate to the component
        return error
      }
    }
  );