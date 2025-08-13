import {
  View,
  Text,
  BackHandler,
  TouchableOpacity,
  Platform,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { router } from "expo-router";
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

// Move config outside component to prevent recreation
const appleAuthConfig = {
  clientId: "com.qoneqt.qoneqt.web",
  redirectUri: makeRedirectUri({ useProxy: true }),
  responseType: "id_token",
  scopes: ["name", "email"],
  responseMode: "form_post",
  state: "random_state_string",
};

const authorizationEndpoint = { 
  authorizationEndpoint: "https://appleid.apple.com/auth/authorize" 
};

const SelectSocialkyc = () => {
  useScreenTracking("SelectSocialkyc");
  const [isLoading, setLoading] = useState(false);
  const { userFromType, onSetUserFromType } = useAppStore();

  const [request, response, promptAsync] = useAuthRequest(
    appleAuthConfig,
    authorizationEndpoint
  );

  const { onPressVerifyDocument } = useKycOnboardViewModel();

  // Memoize navigation function to prevent recreating on each render
  const navigatekyc = useCallback(({ first_name, last_name, email, type }) => {
    router.push({
      pathname: "/KycOnboardHoc",
      params: {
        kycStepData: 0,
        first_name,
        last_name,
        email,
        type,
      },
    });
    onSetUserFromType("google");
  }, [onSetUserFromType]);

  // Memoize back handler to prevent recreation
  const backAction = useCallback(() => {
    router.replace("/DashboardScreen");
    return true;
  }, []);

  const backPress = useCallback(() => {
    router.back();
  }, []);

  // Optimize Google verification with useCallback
  const googleVerify = useCallback(() => {
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
  }, [navigatekyc]);

  // Optimize Apple verification with useCallback
  const appleVerify = useCallback(async () => {
    if (Platform.OS === "ios") {
      appleLogin((data) => {
        // Handle Apple login data
      });
    } else {
      if (request) {
        await promptAsync();
      } else {
        console.log("Auth request not available");
      }
    }
  }, [request, promptAsync]);

  // Optimize manual verification handler
  const handleManualVerification = useCallback(() => {
    onSetUserFromType("manual");
    onPressVerifyDocument();
  }, [onSetUserFromType, onPressVerifyDocument]);

  // Optimize info press handler
  const handleInfoPress = useCallback(() => {
    showToast({
      type: "info",
      text2: "Verify your identity by providing a few details about yourself",
      text1: "Verify your identity",
    });
  }, []);

  // Set up back handler effect
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [backAction]);

  // Handle Apple OAuth response
  useEffect(() => {
    if (response?.type === "success") {
      console.log("Apple OAuth Success:", response);
      // Handle token exchange and user authentication
    }
  }, [response]);

  // Memoize styles to prevent recreation
  const styles = useMemo(() => createStyles(), []);

  return (
    <ViewWrapper>
      <GoBackNavigation 
        isBack={true} 
        backPress={backPress} 
        isHome 
        header="Verification using Email" 
        isDeepLink={true} 
      />
      
      <View style={styles.container}>
        <View style={styles.lottieContainer}>
          <LottieView
            style={styles.lottieView}
            source={require("../../assets/lottie/VerifyEmail.json")}
            autoPlay
            loop
          />
        </View>

        <View style={styles.googleButtonContainer}>
          <SocialButton
            title="Verify with Google"
            onPress={googleVerify}
          />
        </View>

        <TouchableOpacity
          style={styles.manualVerifyContainer}
          onPress={handleManualVerification}
        >
          <Text style={styles.manualVerifyText}>
            Verify user Manually
          </Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <TouchableOpacity onPress={handleInfoPress}>
            <InfoIcon />
          </TouchableOpacity>
          <Text style={styles.infoText}>
            Why is this needed?
          </Text>
        </View>
      </View>

      <View style={styles.verifyCard}>
        <DocumentIcon style={styles.documentIcon} />
        <View style={styles.verifyTextContainer}>
          <Text style={styles.verifyTitle}>
            Verify
          </Text>
          <Text style={styles.verifyDescription}>
            Please enter your details based on your ID and upload a photo for
            face verification to complete the process.
          </Text>
        </View>
      </View>

      <Modal visible={isLoading} transparent={true}>
        <View style={styles.modalContainer}>
          <ActivityIndicator
            size="small"
            color={globalColors?.darkOrchidShade20}
          />
        </View>
      </Modal>
    </ViewWrapper>
  );
};

// Move styles outside component and memoize creation
const createStyles = () => StyleSheet.create({
  container: {
    marginTop: "5%",
    paddingHorizontal: "5%",
  },
  lottieContainer: {
    paddingVertical: "15%",
  },
  lottieView: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  googleButtonContainer: {
    marginTop: "2%",
  },
  manualVerifyContainer: {
    marginTop: "7%",
    alignItems: "center",
  },
  manualVerifyText: {
    color: globalColors.slateBlueTint80,
    textDecorationLine: "underline",
    fontSize: 18,
    fontFamily: fontFamilies.regular,
    marginLeft: 4,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "10%",
    right: "2%",
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral7,
    marginLeft: 4,
  },
  verifyCard: {
    borderRadius: 8,
    borderColor: globalColors.neutral4,
    borderWidth: 0.7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: "5%",
    marginTop: "2%",
    width: "90%",
  },
  documentIcon: {
    bottom: "12%",
    left: "8%",
  },
  verifyTextContainer: {
    width: "100%",
    left: "20%",
  },
  verifyTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutralWhite,
  },
  verifyDescription: {
    fontSize: 15,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral7,
    marginTop: "3%",
    lineHeight: 20,
    right: "5%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(SelectSocialkyc);