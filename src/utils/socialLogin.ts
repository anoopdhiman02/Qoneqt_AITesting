import { appleAuth } from "@invertase/react-native-apple-authentication";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";

const appleAuthConfig = {
  clientId: "com.qoneqt.qoneqt.web", // Replace with your Apple Service ID
  redirectUri: "https://qoneqt.com/api/appleService", // Replace with your Firebase URL
  responseType: "id_token",
  scope: "name email",
};

// ********************************* GOOGLE LOGIN ******************************
export const googleConfiguration = () => {
  GoogleSignin.configure({
    offlineAccess: true,
    webClientId:
      "9278642222-vg3dbt39p1osk5f8f3qnueusviidu3qm.apps.googleusercontent.com",
    iosClientId:
      "9278642222-irdmcm22uif6m1qarehursn0epnhopkp.apps.googleusercontent.com",
  });
};

export const googleLogin = async (callback: any) => {
  // If user already login with then first logout the user.
  await GoogleSignin.signOut();

  try {
    await GoogleSignin.hasPlayServices();
    const userInfo: any = await GoogleSignin.signIn();

    callback({data:userInfo?.user || userInfo?.data?.user});
  } catch (error: any) {
    callback({error:"Network Error"})
    console.log("google error", error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log("google error SIGN_IN_CANCELLED", JSON.stringify(error));
      //reject(error);
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log("google error IN_PROGRESS", JSON.stringify(error));
      // reject(error);
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log(
        "google error PLAY_SERVICES_NOT_AVAILABLE",
        JSON.stringify(error)
      );
      // reject(error);
      // play services not available or outdated
    } else {
      console.log("google error", JSON.stringify(error));
      // reject(error);
      // some other error happened
    }
  }
};
// ********************************* APPLE LOGIN ******************************

export const appleLogin = async (callback: any) => {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL],
  });

  // Ensure Apple returned a user identityToken
  if (!appleAuthRequestResponse.identityToken) {
    throw new Error("Apple Sign-In failed - no identify token returned");
  }

  // Create a Firebase credential from the response
  const { identityToken, nonce } = appleAuthRequestResponse;

  callback(appleAuthRequestResponse);
  // Sign the user in with the credential
};

export const revokeSignInWithAppleToken = async () => {
  // Get an authorizationCode from Apple
  const { authorizationCode } = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.REFRESH,
  });

  // Ensure Apple returned an authorizationCode
  if (!authorizationCode) {
    throw new Error("Apple Revocation failed - no authorizationCode returned");
  }

  // Revoke the token
  return authorizationCode;
};

export const signInWithApple = async () => {
  // try {
  //   const authUrl = `https://appleid.apple.com/auth/authorize?client_id=${appleAuthConfig.clientId}&redirect_uri=${appleAuthConfig.redirectUri}&response_type=${appleAuthConfig.responseType}&scope=${appleAuthConfig.scope}`;
  //   const result = await AuthSession.startAsync({ authUrl });
  //   if (result.type === "success") {
  //     console.log("Apple OAuth Success:", result);
  //   } else {
  //     console.log("Apple OAuth Canceled:", result);
  //   }
  // } catch (error) {
  //   console.error("Apple OAuth Error:", error);
  // }
};
