import {
  View,
  Text,
  BackHandler,
  TouchableOpacity,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useAppStore } from "@/zustand/zustandStore";
import useKycOnboardViewModel from "./viewModel/KycOnboardViewModel";
import ViewWrapper from "@/components/ViewWrapper";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { DocumentIcon, InfoIcon } from "@/assets/DarkIcon";
import { showToast } from "@/components/atom/ToastMessageComponent";
import SocialButton from "@/components/buttons/SocialButton";
import { appleLogin, googleLogin, signInWithApple } from "@/utils/socialLogin";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import LottieView from "lottie-react-native";
import { useScreenTracking } from "@/customHooks/useAnalytics";

WebBrowser.maybeCompleteAuthSession();

// Apple OAuth configuration
const appleAuthConfig = {
  clientId: "com.qoneqt.qoneqt.web", // Replace with your Apple Service ID
  //@ts-ignore
  redirectUri: makeRedirectUri({ useProxy: true }), // Handles redirect URI dynamically
  responseType: "id_token",
  scopes: ["name", "email"],
  responseMode: "form_post",
  state: "random_state_string",
};
const SelectSocialkyc = () => {
  useScreenTracking("SelectSocialkyc");
  const [isLoading, setLoading] = useState<boolean>(false);
  const { userFromType, onSetUserFromType } = useAppStore();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: appleAuthConfig.clientId,
      redirectUri: appleAuthConfig.redirectUri,
      responseType: appleAuthConfig.responseType,
      scopes: appleAuthConfig.scopes,
      state: appleAuthConfig.state,
    },
    { authorizationEndpoint: "https://appleid.apple.com/auth/authorize" }
  );

  const {
    onPressVerifyDocument,
  } = useKycOnboardViewModel();

  useEffect(() => {
    // Handle back button press
    const backAction = () => {
      router.replace("/DashboardScreen"); // Navigate back to the previous screen
      return true; // Prevent default behavior (exit app)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Cleanup the event listener on component unmount
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      console.log("Apple OAuth Success:", response);
      // Handle token exchange and user authentication
    }
  }, [response]);

  const googleVerify = () => {
    setLoading(true);
    try {
      googleLogin((data) => {
        setLoading(false);
        if (!data.data) {
          setTimeout(() => {
            showToast({ text1: "Network Error", type: "error" });
          }, 500);
        } else {
            navigatekyc({
              first_name: data?.data?.givenName,
              last_name: data?.data?.familyName,
              email: data?.data?.email,
              type: 4,
            });
        }
      });
    } catch (error) {
      console.log("error>>", error);
      setLoading(false);
    }
  };

  const appleVerify = async () => {
    if (Platform.OS == "ios") {
      appleLogin((data) => {
      });
    } else {
      // Use OAuth flow for Android
      if (request) {
        await promptAsync();
      } else {
        console.log("Auth request not available");
      }
    }
  };

  const navigatekyc = ({ first_name, last_name, email, type }) => {
    router.push({
      pathname: "/KycOnboardHoc",
      params: {
        kycStepData: 0,
        first_name: first_name,
        last_name: last_name,
        email: email,
        type: type,
      },
    });
    onSetUserFromType("google");
  };

  const backPress = () => {
    router.back();
  };

  return (
    <ViewWrapper>
      <GoBackNavigation isBack={true} backPress={backPress} isHome header="Verification using Email" isDeepLink={true} />
      <View
        style={{
          marginTop: "5%",
          paddingHorizontal: "5%",
        }}
      >
        <View style={{ paddingVertical: "15%" }}>
          <LottieView
            style={{
              width: 100,
              height: 100,
              alignSelf: "center",
            }}
            source={require("../../assets/lottie/VerifyEmail.json")}
            autoPlay
            loop
          />
        </View>

        {/* Why is this needed? */}
        <View style={{ marginTop: "2%" }}>
          <SocialButton
            title="Verify with Google"
            onPress={() => googleVerify()}
          />
        </View>

        {/* <SocialButton type="apple" title="Apple kyc" onPress={appleVerify} /> */}

        <TouchableOpacity
          style={{ marginTop: "7%", alignItems: "center" }}
          onPress={() => {
            onSetUserFromType("manual");
            onPressVerifyDocument();}}
        >
          <Text
            style={{
              color: globalColors.slateBlueTint80,
              textDecorationLine: "underline",
              fontSize: 18,
              // lineHeight: 14,
              fontFamily: fontFamilies.regular,
              marginLeft: 4,
            }}
          >
            Verify user Manually
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: "10%",
            right: "2%",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              showToast({
                type: "info",
                text2:
                  "Verify your identity by providing a few details about yourself",
                text1: "Verify your identity",
              })
            }
          >
            <InfoIcon />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral7,
              marginLeft: 4,
            }}
          >
            Why is this needed?
          </Text>
        </View>
      </View>

      <View
        // disabled
        // onPress={() => onPressVerifyDocument()}
        style={{
          borderRadius: 8,
          borderColor: globalColors.neutral4,
          borderWidth: 0.7,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "5%",
          marginTop: "2%",
          width: "90%",
        }}
      >
        <DocumentIcon style={{ bottom: "12%", left: "8%" }} />
        <View style={{ width: "100%", left: "20%" }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: fontFamilies.semiBold,
              color: globalColors.neutralWhite,
            }}
          >
            Verify
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral7,
              marginTop: "3%",
              lineHeight: 20,
              right: "5%",
            }}
          >
            Please enter your details based on your ID and upload a photo for
            face verification to complete the process.
          </Text>
        </View>
      </View>
      <Modal visible={isLoading} transparent={true}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            size={"small"}
            color={globalColors?.darkOrchidShade20}
          />
        </View>
      </Modal>
    </ViewWrapper>
  );
};

export default SelectSocialkyc;
