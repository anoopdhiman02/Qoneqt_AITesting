// src/utils/tokenManager.ts
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({
  id: "user_token",
  encryptionKey: "newToken",
});

export const setTokens = ({ accessToken, refreshToken }) => {
  storage.set("accessToken", accessToken || "");
  storage.set("refreshToken", refreshToken || "");
};

export const setUserInfoValue = (data) => {
  storage.set("user_info_value", JSON.stringify(data));
};

export const getUserInfoValue = () => {
  return JSON.parse(storage.getString("user_info_value") || "{}");
};

export const getAccessToken = () => {
  return storage.getString("accessToken");
};

export const getRefreshToken = () => {
  return storage.getString("refreshToken");
};

export const clearTokens = () => {
  storage.delete("accessToken");
  storage.delete("refreshToken");
};
