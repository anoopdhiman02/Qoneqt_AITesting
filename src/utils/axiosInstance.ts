import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  getUserInfoValue, // Add a function to clear tokens on failure
} from "@/localDB/TokenManager";
import { BASE_GO_URL } from "./constants";
import { setAccessToken } from "@/redux/slice/login/LoginUserSlice";
import { Alert } from "react-native";
import { router } from "expo-router";
import { clearUserData } from "@/localDB/LocalStroage";
import { deleteAllPrefs } from "./storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppStore } from "@/zustand/zustandStore";
import { storeDate, } from "@/utils/storeCureenData";
import useDeviceId from "@/app/hooks/useDeviceId";

const axiosInstance = axios.create({
  baseURL: BASE_GO_URL,
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
  },

});

let isRefreshing = false; // Flag to prevent multiple refresh calls
let failedQueue = []; // Queue to retry failed requests after refresh
let dispatch = null; // Declare a variable to store dispatch

// Function to set dispatch function
axiosInstance.setDispatch = (dispatchFunc) => {
  dispatch = dispatchFunc;
};

// Retry all failed requests after refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    token ? prom.resolve(token) : prom.reject(error);
  });
  failedQueue = [];
};

const fetchAllData = async () => {
  const {userInfo, userId } = useAppStore.getState();
  const [refreshTokenResponse,accessTokenResponse,refTokenResponse,tokenResponse] = await Promise.all([
    await getRefreshToken(),
    await AsyncStorage.getItem("acc_token"),
    await AsyncStorage.getItem("ref_token"),
    await getAccessToken()
  ]);

  return {refresh_token: refreshTokenResponse || refTokenResponse, access_token: accessTokenResponse || tokenResponse, user_id: userInfo?.id || userId}
};

// Request Interceptor: Attach the access token
axiosInstance.interceptors.request.use(
  async (config) => {
    const cacheData = await fetchAllData();
    if (cacheData.access_token) {
      config.headers["Authorization"] = `Bearer ${cacheData.access_token}`;
    }
    return config;
  },
  
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is already in progress, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const cacheData = await fetchAllData();
        const user_info = await getUserInfoValue();
        const refToken = await AsyncStorage.getItem("ref_token");
        const acc_token = await AsyncStorage.getItem("acc_token");
        const deviceInfo = await useDeviceId();
          var refOldToken = refToken || ''
          if (!refOldToken) {
            Alert.alert(
              "Session Expired",
              "Your session has expired. Please log in again to continue.",
              [
                {
                  text: "OK",
                  onPress: async () => {
                    await clearUserData();
                        deleteAllPrefs();
                    router.replace("/LoginScreen")
                  },
                },
              ]
            );
            throw new Error("No refresh token available");
          }
          const response = await axios.post(`${BASE_GO_URL}update-tokens`, {
            refresh_token:refOldToken,
            user_id: user_info?.id || cacheData.user_id,
            access_token:acc_token,
            device_id: deviceInfo,
          });
          const newAccess = response?.data?.data?.accessToken || response?.data?.accessToken || '';
          const newRefresh = response?.data?.data?.refreshToken || response?.data?.refreshToken || '';
          if (!newAccess && !newRefresh) {
            Alert.alert(
              "Session Expired",
              "Session expired. Log in again.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    router.replace("/LoginScreen")
                  },
                },
              ]
            );
            throw new Error("Failed to refresh access token");
          }
          
          await AsyncStorage.multiSet([
            ["acc_token", newAccess],
            ["ref_token", newRefresh],
          ]);
          setTokens({ accessToken: newAccess, refreshToken: newRefresh });
          storeDate();
  
          if (dispatch) {
            dispatch(setAccessToken(newAccess));
          }
         
         axiosInstance.defaults.headers["Authorization"] = `Bearer ${newAccess}`;
         processQueue(null, newAccess);
         originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

          return axiosInstance(originalRequest);
      } catch (err) {
console.log("err", JSON.stringify(err));
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const message = error?.response?.data?.message || error?.response?.data?.error || error?.message || error?.response?.message || "Unknown error";
    return Promise.reject(error.response?.data || { message });
  }
);

export default axiosInstance;