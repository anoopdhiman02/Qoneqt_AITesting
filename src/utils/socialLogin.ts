import { appleAuth } from "@invertase/react-native-apple-authentication";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";

// Constants moved outside functions to prevent recreation
const GOOGLE_CONFIG = {
  offlineAccess: true,
  webClientId: "9278642222-vg3dbt39p1osk5f8f3qnueusviidu3qm.apps.googleusercontent.com",
  iosClientId: "9278642222-irdmcm22uif6m1qarehursn0epnhopkp.apps.googleusercontent.com",
};

const APPLE_AUTH_CONFIG = {
  clientId: "com.qoneqt.qoneqt.web",
  redirectUri: "https://qoneqt.com/api/appleService",
  responseType: "id_token",
  scope: "name email",
};

// Error types for better error handling
const GOOGLE_ERROR_TYPES = {
  SIGN_IN_CANCELLED: statusCodes.SIGN_IN_CANCELLED,
  IN_PROGRESS: statusCodes.IN_PROGRESS,
  PLAY_SERVICES_NOT_AVAILABLE: statusCodes.PLAY_SERVICES_NOT_AVAILABLE,
};

// Cache configuration status to avoid repeated calls
let isGoogleConfigured = false;

// ********************************* GOOGLE LOGIN ******************************

/**
 * Configure Google Sign-In (call once at app startup)
 * @returns {Promise<void>}
 */
export const googleConfiguration = async () => {
  if (isGoogleConfigured) return;
  
  try {
    await GoogleSignin.configure(GOOGLE_CONFIG);
    isGoogleConfigured = true;
  } catch (error) {
    console.error("Google configuration failed:", error);
    throw error;
  }
};

/**
 * Handle Google Sign-In with improved error handling and performance
 * @param {Function} callback - Callback function to handle result
 * @returns {Promise<void>}
 */
export const googleLogin = async (callback) => {
  if (!callback || typeof callback !== 'function') {
    console.error("Callback function is required for googleLogin");
    return;
  }

  try {
    // Ensure Google is configured
    if (!isGoogleConfigured) {
      await googleConfiguration();
    }

    // Check if user is already signed in
    const currentUser = await GoogleSignin.getCurrentUser();
  if (currentUser) {
    await GoogleSignin.signOut();
  }

    // Verify Play Services availability (Android)
    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices();
    }

    const userInfo: any = await GoogleSignin.signIn();
    
    // Normalize user data structure
    const userData = userInfo?.user || userInfo?.data?.user || userInfo;
    
    if (!userData) {
      callback({ error: "No user data received" });
      return;
    }

    callback({ data: userData });

  } catch (error) {
    console.error("Google login error:", error);
    
    // Handle specific error types
    const errorMessage = handleGoogleError(error);
    callback({ error: errorMessage });
  }
};

/**
 * Handle Google-specific errors with appropriate messages
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
const handleGoogleError = (error) => {
  if (!error?.code) {
    return "Network Error";
  }

  switch (error.code) {
    case GOOGLE_ERROR_TYPES.SIGN_IN_CANCELLED:
      console.log("Google Sign-In cancelled by user");
      return "Sign-in cancelled";
      
    case GOOGLE_ERROR_TYPES.IN_PROGRESS:
      console.log("Google Sign-In already in progress");
      return "Sign-in already in progress";
      
    case GOOGLE_ERROR_TYPES.PLAY_SERVICES_NOT_AVAILABLE:
      console.log("Google Play Services not available");
      return "Google Play Services unavailable";
      
    default:
      console.log("Unknown Google error:", error);
      return "Network Error";
  }
};

/**
 * Sign out from Google (utility function)
 * @returns {Promise<void>}
 */
export const googleSignOut = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error("Google sign out error:", error);
  }
};

// ********************************* APPLE LOGIN ******************************

/**
 * Handle Apple Sign-In with improved error handling
 * @param {Function} callback - Callback function to handle result
 * @returns {Promise<void>}
 */
export const appleLogin = async (callback) => {
  if (!callback || typeof callback !== 'function') {
    console.error("Callback function is required for appleLogin");
    return;
  }

  // Check if Apple Authentication is available
  if (Platform.OS === 'ios') {
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      callback({ error: "Apple Sign-In not available on this device" });
      return;
    }
  }

  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Validate response
    if (!appleAuthRequestResponse.identityToken) {
      callback({ error: "Apple Sign-In failed - no identity token returned" });
      return;
    }

    callback({ data: appleAuthRequestResponse });

  } catch (error) {
    console.error("Apple login error:", error);
    
    const errorMessage = handleAppleError(error);
    callback({ error: errorMessage });
  }
};

/**
 * Handle Apple-specific errors
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
const handleAppleError = (error) => {
  // Apple error codes mapping
  const APPLE_ERROR_CODES = {
    1000: "Sign-in cancelled by user",
    1001: "Apple Sign-In failed",
    1002: "Invalid response from Apple",
    1003: "Not handled by Apple",
    1004: "Apple Sign-In failed",
  };

  if (error?.code && APPLE_ERROR_CODES[error.code]) {
    return APPLE_ERROR_CODES[error.code];
  }

  return "Apple Sign-In failed";
};

/**
 * Revoke Apple Sign-In token
 * @returns {Promise<string>} - Authorization code for revocation
 */
export const revokeSignInWithAppleToken = async () => {
  try {
    const { authorizationCode } = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.REFRESH,
    });

    if (!authorizationCode) {
      throw new Error("Apple Revocation failed - no authorizationCode returned");
    }

    return authorizationCode;
  } catch (error) {
    console.error("Apple token revocation error:", error);
    throw error;
  }
};

/**
 * Web-based Apple Sign-In (currently commented out in original)
 * @returns {Promise<void>}
 */
export const signInWithApple = async () => {
  try {
    const authUrl = `https://appleid.apple.com/auth/authorize?client_id=${APPLE_AUTH_CONFIG.clientId}&redirect_uri=${APPLE_AUTH_CONFIG.redirectUri}&response_type=${APPLE_AUTH_CONFIG.responseType}&scope=${APPLE_AUTH_CONFIG.scope}`;
    
    const result = await AuthSession.startAsync({ authUrl });
    
    if (result.type === "success") {
      console.log("Apple OAuth Success:", result);
      return result;
    } else {
      console.log("Apple OAuth Canceled or failed:", result);
      throw new Error("Apple OAuth cancelled or failed");
    }
  } catch (error) {
    console.error("Apple OAuth Error:", error);
    throw error;
  }
};

// ********************************* UTILITY FUNCTIONS ******************************

/**
 * Check if user is signed in to Google
 * @returns {Promise<boolean>}
 */
export const isGoogleSignedIn = async () => {
  try {
    return await GoogleSignin.isSignedIn();
  } catch (error) {
    console.error("Error checking Google sign-in status:", error);
    return false;
  }
};

/**
 * Get current Google user info
 * @returns {Promise<object|null>}
 */
export const getCurrentGoogleUser = async () => {
  try {
    const userInfo = await GoogleSignin.getCurrentUser();
    return userInfo?.user || userInfo?.data?.user || userInfo;
  } catch (error) {
    console.error("Error getting current Google user:", error);
    return null;
  }
};

/**
 * Initialize social login configurations (call at app startup)
 * @returns {Promise<void>}
 */
export const initializeSocialLogin = async () => {
  try {
    await googleConfiguration();
    console.log("Social login initialization completed");
  } catch (error) {
    console.error("Social login initialization failed:", error);
  }
};

// Export constants for external use
export { GOOGLE_CONFIG, APPLE_AUTH_CONFIG };