import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_GO_URL } from "../../../utils/constants";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

interface HomePostPayload {
  userId: number;
  lastCount: number;
  limit_count:number
}
export const onFetchHomePost = createAsyncThunk(
  "home_post",
  async ({ userId, lastCount,limit_count }: HomePostPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Home_Post_Api}`,
      data: {
        user_id: userId,
        last_count: lastCount,
        fromApp: 1,
        limit_count:limit_count
        
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return {...response.data, last_count: lastCount};
    } catch (error) {
      console.error("Error fetching home posts:1", error);
      return error;
    }
  }
);


export const onFetchHomeNextPost = createAsyncThunk(
  "home_post_next",
  async ({ userId, lastCount,limit_count }: HomePostPayload) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${BASE_GO_URL}${ENDPOINTS.Home_Post_Api}`,
      data: {
        user_id: userId,
        last_count: lastCount,
        fromApp: 1,
        limit_count:limit_count
      },
    };
    try {
      const response = await axiosInstance.request(options);
      return {...response.data, last_count: lastCount,};
    } catch (error) {
      console.error("Error fetching home posts:>>", error);
      // Re-throw the error to let it propagate to the component
      return error
      // return error;
    }
  }
);