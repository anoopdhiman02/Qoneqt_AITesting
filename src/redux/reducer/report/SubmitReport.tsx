import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { BASE_GO_URL } from "../../../utils/constants";
import { ENDPOINTS } from "@/utils/endPoints";

interface ReportPayload {
  user_id: number | string;
  report_id: number;
  raised_for: string;
  raised_type: string;
  raised_against: string;
  raised_by: number | string;
  reason: string;
}

interface ReportPayload {
  // Adjust the type based on your actual payload structure
  user_id: number | string;
  report_id: number;
  raised_for: string;
  raised_type: string;
  raised_against: string;
  raised_by: number | string;
  reason: string;
}
export const onSubmitReport = createAsyncThunk(
  "submit_report",
  async ({
    user_id,
    report_id,
    raised_by,
    raised_against,
    raised_type,
    raised_for,
    reason,
  }: ReportPayload) => {
    const formData = new FormData();
    formData.append("user_id", user_id ? user_id.toString() : '225');
    formData.append("report_id", report_id ? report_id.toString() : '10055');
    formData.append("raised_for", raised_for ? raised_for : "spam");
    formData.append("raised_type", raised_type ? raised_type : "post");
    formData.append("raised_against", raised_against ? raised_against : "aka");
    formData.append("raised_by", raised_by ? raised_by.toString() : '225');
    formData.append("reason", reason ? reason : "spam");
    formData.append("fromApp", "1");
    const options = {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Submit_Report}`,
      data: formData,
    };
    try {
      const response = await axiosInstance.request(options);
      return response.data;
    } catch (error) {
      console.log("Error fetching Submit_Report:", JSON.stringify(error));
      // Re-throw the error to let it propagate to the component
      return error;
    }
  }
);
