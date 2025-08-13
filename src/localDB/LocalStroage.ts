import AsyncStorage from "@react-native-async-storage/async-storage";
import { MMKV } from "react-native-mmkv";
const storage = new MMKV();

export const storeIsLoggedIn = async (isLoggedIn) => {
  try {
    await AsyncStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  } catch (e) {
    console.error("Error storing isLoggedIn status: ", e);
  }
};

// Get isLoggedIn status (default to false if no data)
export const getIsLoggedIn = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("isLoggedIn");
    return jsonValue != null ? JSON.parse(jsonValue) : false; // Default to false if no value
  } catch (e) {
    console.error("Error reading isLoggedIn status: ", e);
    return false; // Default to false on error
  }
};

//kyc status

export const storeUserKycStatus = async (kyc_status) => {
  try {
    await AsyncStorage.setItem("kyc_status", JSON.stringify(kyc_status));
  } catch (e) {
    console.error("Error storing kyc_status status: ", e);
  }
};

// Get kyc_status status (default to false if no data)
export const getStoreUserKycStatus = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("kyc_status");
    return jsonValue != null ? JSON.parse(jsonValue) : false; // Default to false if no value
  } catch (e) {
    console.error("Error reading kyc_status status: ", e);
    return false; // Default to false on error
  }
};

// Store boolean data for "getStarted" status`
export const setGetStartedSkipped = async (data) => {
  try {
    // Save boolean value as a string using JSON.stringify
    await AsyncStorage.setItem("getStarted", JSON.stringify(data));
  } catch (e) {
    console.error("Error storing getStarted status: ", e);
  }
};

// Get "getStarted" status (default to false if no data)
export const getGetStartedSkipped = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("getStarted");
    // Return parsed boolean or default to false
    return jsonValue != null ? JSON.parse(jsonValue) : false;
  } catch (e) {
    console.error("Error reading getStarted status: ", e);
    return false; // Default to false on error
  }
};

export const storeUserData = async ({
  userId,
  isLoggedIn,
  kycStatusStore,
  identificationType,
}) => {
  try {
    const userData = {
      userId: userId,
      isLoggedIn: isLoggedIn || false,
      kycStatusStore: kycStatusStore || null,
      identificationType: identificationType || 0,
    };
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem("user-data", jsonValue);
  } catch (e) {
    console.error("Error storing user data: ", e);
  }
};

export const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("user-data");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error reading user data: ", e);
  }
};

export const setUserDetails = async (data: any) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem("user-details", jsonValue);
  } catch (e) {
    console.error("Error storing user data: ", e);
  }
};

//profile pic
export const setProfilePicStore = async (profile_pic) => {
  try {
    await AsyncStorage.setItem("profile_pic", JSON.stringify(profile_pic));
  } catch (e) {
    console.error("Error storing profile_pic status: ", e);
  }
};

// Get profile_pic status (default to false if no data)
export const getProfilePicStore = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("profile_pic");
    return jsonValue != null ? JSON.parse(jsonValue) : false; // Default to false if no value
  } catch (e) {
    console.error("Error reading profile_pic status: ", e);
    return false; // Default to false on error
  }
};

export const getUserDeatils = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("user-details");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error reading user data: ", e);
  }
};
// Clear user data on logout
export const clearUserData = async () => {
  try {
    await AsyncStorage.clear(); // Clear all data from AsyncStorage
  } catch (e) {
    console.error("Error clearing all data: ", e);
  }
};


// mmkv storage

export const setLoggedMobile = ({ isMobile}) => {
  storage.set("logged_mobile", isMobile);
};

export const getLoggedMobile = () => {
  return storage.getNumber("logged_mobile");
};


export const setFullNameLocal = ({ first}) => {
  storage.set("full_name", first);
};

export const getFullNameLocal = () => {
  return storage.getString("full_name");
};


export const setFirstNameLocal = ({ first}) => {
  storage.set("first_name", first);
};

export const getFirstNameLocal = () => {
  return storage.getString("first_name");
};

export const setLastNameLocal = ({ last}) => {
  storage.set("last_name", last);
};

export const getLastNameLocal = () => {
  return storage.getString("last_name");
};

export const setEmailLocal = ({ email}) => {
  storage.set("email", email);
};

export const getEmailLocal = () => {
  return storage.getString("email");
};

export const setMobileLocal = ({ mobile}) => {
  storage.set("mobile", mobile);
};

export const getMobileLocal = () => {
  return storage.getString("mobile");
};



