import * as React from "react";
import { Image } from "expo-image";
import { ScrollView, Text, TouchableOpacity, View, Modal } from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import Button1 from "../../components/buttons/Button1";
import { router } from "expo-router";
import {
  AboutUsIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ContactUsIcon,
  DarkModeIcon,
  DeleteAccountIcon,
  EmailTemplateIcon,
  NotificationIcon,
  PrivacyPolicyIcon,
  ReferAndEarnNewIcon,
  SupportFAQIcon,
  TermsAndConditionsIcon,
  TransactionIcon,
} from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import LottieView from "lottie-react-native";
import { clearUserData, getLoggedMobile, storeUserKycStatus } from "@/localDB/LocalStroage";
import { LinearGradient } from "expo-linear-gradient";
import {
  LogoutRequestPayload,
  OnLogoutReq,
} from "@/redux/reducer/login/LogoutReq";
import { useAppDispatch } from "@/utils/Hooks";
import { useAppStore } from "@/zustand/zustandStore";
import { useAppSelector } from "@/utils/Hooks";
import { useEffect, useState, useMemo, useCallback } from "react";
import DynamicContentModal from "@/components/modal/DynamicContentModal";
import { getRefreshToken } from "@/localDB/TokenManager";
import { shallowEqual, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onUnDeleteAccount } from "@/redux/reducer/Profile/setting/DeleteAccount";
import { updateProfileData } from "@/redux/slice/profile/ProfileMyDetailsSlice";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const settingsOptions = [
  {
    icon: <ContactUsIcon />,
    label: "Contact Us",
    screen: "ContactUs",
  },
  {
    icon: <TermsAndConditionsIcon />,
    label: "Terms & Conditions",
    screen: "TermCondition",
  },
  {
    icon: <PrivacyPolicyIcon />,
    label: "Privacy Policy",
    screen: "PrivacyPolicyScreen",
  },
  {
    icon: <SupportFAQIcon />,
    label: "Support & FAQ",
    screen: "SupportFAQ",
  },
  {
    icon: <TransactionIcon />,
    label: "Transactions",
    screen: "transaction",
  },
  {
    icon: <DeleteAccountIcon />,
    label: "Delete Account",
    screen: "DeleteAccount",
  },
];

// Memoized Setting Item Component for better performance
const SettingItem = React.memo(({ option, index, onPress, isDeleteAccount, myProfileData }: any) => {
  return (
    <React.Fragment>
      {index > 0 && (
        <View
          style={{
            alignSelf: "stretch",
            borderStyle: "solid",
            borderColor: globalColors.neutral4,
            borderTopWidth: 0.5,
            height: 1,
            marginTop: 16,
          }}
        />
      )}
      <TouchableOpacity
        onPress={() => onPress(option.screen)}
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {React.isValidElement(option.icon) ? (
            option.icon
          ) : (
            <Image
              style={{
                width: 16,
                height: 16,
                overflow: "hidden",
              }}
              contentFit="cover"
              source={option.icon}
            />
          )}
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutralWhite,
              marginLeft: 8,
            }}
          >
            {isDeleteAccount 
              ? (myProfileData?.data?.del_status == 1 ? "UnDelete Account" : "Delete Account")
              : option.label
            }
          </Text>
        </View>
        <ArrowRightIcon />
      </TouchableOpacity>
    </React.Fragment>
  );
});

const SettingScreen = () => {
  useScreenTracking("SettingScreen");
  const { userId, onSetUserFromType, setIsVerified, onSetShowKycModalStore } = useAppStore();
  const refreshToken = getRefreshToken();

  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [status, setStatus] = useState(null);
  
  // Loading states for different actions
  const [loadingStates, setLoadingStates] = useState({
    logout: false,
    deleteAccount: false,
    navigation: false,
    kyc: false
  });

  const isLoginMobile = getLoggedMobile();

  const dynamiContentStatus: any = useAppSelector(
    (state) => state?.dynamicContentStatusSlice
  );
  
  const myProfileData = useSelector(
    (state: any) => state.myProfileData,
    shallowEqual
  );

  // Memoized values for better performance
  const currencyRate = useMemo(() => {
    return myProfileData?.data?.currencyRate || "83";
  }, [myProfileData?.data?.currencyRate]);

  const isAccountDeleted = useMemo(() => {
    return myProfileData?.data?.del_status == 1;
  }, [myProfileData?.data?.del_status]);

  const shouldShowKycModal = useMemo(() => {
    return dynamiContentStatus?.data?.status === 1;
  }, [dynamiContentStatus?.data?.status]);

  // Set loading state helper
  const setLoadingState = useCallback((key: string, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    if (
      dynamiContentStatus &&
      dynamiContentStatus?.data &&
      dynamiContentStatus?.data?.status
    ) {
      setStatus(dynamiContentStatus?.data?.status);
    }
  }, [dynamiContentStatus]);

  // Debounced navigation function to prevent multiple clicks
  const navigateToScreen = useCallback(async (screen: string) => {
    if (loadingStates.navigation || loadingStates.deleteAccount) return;

    if (screen) {
      if (screen == "DeleteAccount" && isAccountDeleted) {
        setLoadingState('deleteAccount', true);
        try {
          var unDeleteAccount: any = await dispatch(onUnDeleteAccount({ userId: userId }));
          if (unDeleteAccount?.payload?.success) {
            dispatch(updateProfileData({ data: { ...myProfileData?.data, del_status: 0 } }));
            showToast({ text1: unDeleteAccount?.payload?.message, type: "success" });
            router.back();
            return;
          } else {
            showToast({ text1: unDeleteAccount?.payload?.message, type: "error" });
            return;
          }
        } catch (error) {
          console.error("Delete account error:", error);
          showToast({ text1: "Something went wrong", type: "error" });
        } finally {
          setLoadingState('deleteAccount', false);
        }
      } else {
        setLoadingState('navigation', true);
        try {
          router.push(screen as any);
        } finally {
          // Reset navigation loading after a short delay
          setTimeout(() => setLoadingState('navigation', false), 500);
        }
      }
    }
  }, [
    loadingStates.navigation, 
    loadingStates.deleteAccount, 
    isAccountDeleted, 
    dispatch, 
    userId, 
    myProfileData?.data, 
    setLoadingState
  ]);

  const onPressLogoutHandler = useCallback(() => {
    if (loadingStates.logout) return;
    setModalVisible(true);
  }, [loadingStates.logout]);

  const confirmLogout = useCallback(async () => {
    if (loadingStates.logout) return;
    
    setLoadingState('logout', true);
    try {
      setModalVisible(false);
      await clearUserData();
      var ref_token = await AsyncStorage.getItem("ref_token");
      dispatch(OnLogoutReq({ user_id: userId, token: ref_token || refreshToken }));
      dispatch({ type: 'LOGOUT' });
      router.dismissAll();
      router.replace("/LoginScreen");
    } catch (error) {
      console.error("Logout error:", error);
      showToast({ text1: "Logout failed", type: "error" });
    } finally {
      setLoadingState('logout', false);
    }
  }, [loadingStates.logout, dispatch, userId, refreshToken, setLoadingState]);

  const onKycPress = useCallback(async () => {
    if (loadingStates.kyc) return;
    
    setLoadingState('kyc', true);
    try {
      const kycData = myProfileData?.data?.kyc_details || {};
      const type = myProfileData?.data?.type || 0;
      const contact = isLoginMobile === 0 ? kycData.temp_email : kycData.phone;
      const kycStatus = myProfileData?.data?.kyc_status;
      const stepStatus = Number(myProfileData?.data?.kyc_details?.id_verification_status);
      const stepType = myProfileData?.data?.kyc_details?.identification_type;
      
      const handleKycCompletion = async (path, params = {}) => {
        onSetShowKycModalStore(false);
        await storeUserKycStatus(1);
        setIsVerified(1);
        router.push({ pathname: path, params });
      };
      
      onSetUserFromType(stepType === "google_auth" ? "google" : stepType);
      
      if (myProfileData?.data?.kyc_details?.id) {
        switch (kycStatus) {
          case 0: // Need OTP Verification
            onSetUserFromType(stepType === "google_auth" ? "google" : stepType);
            if (stepStatus === 1 || stepStatus === 2) {
              router.push({
                pathname: "/KycOnboardHoc",
                params: { kycStepData: stepStatus },
              });
            } else {
              console.log("contact", userId, contact, stepStatus);
              //@ts-ignore
              dispatch(onKycSendOtp({ userId, contact }));
            }
            break;

          case 6: // Onboarding
            router.push("/KycOnboardHoc");
            break;

          case 2: // Pending
            await handleKycCompletion("/SuccessfullVerificationModal", {
              status: "pending",
            });
            break;

          case -1: // Declined
            router.push({
              pathname: "/SuccessfullVerificationModal",
              params: { status: "declined" },
            });
            break;

          case 3: // Rejected
            router.push({
              pathname: "/SuccessfullVerificationModal",
              params: { status: "reject" },
            });
            break;

          case 5: // PAN Pending
            await handleKycCompletion("/SuccessfullVerificationModal", {
              status: "panPending",
            });
            break;

          case 1: // Verified
            await handleKycCompletion("/DashboardScreen");
            break;

          case 4: // Selfie / Additional Step
            await handleKycCompletion("/KycOnboardHoc", {
              kycStepData: myProfileData?.data?.kyc_details?.ask_profile ? 6 : 5,
              type,
            });
            break;
          default:
            router.replace("/DashboardScreen");
        }
      } else {
        // Fallback if not successful → Step-based handling
        let kycStepData = 0;
        if (stepStatus === 1) {
          kycStepData = 1;
        } else if (stepStatus === 2) {
          kycStepData = stepType === "event" ? 3 : 2;
        }

        const stepParams = { kycStepData, type };
        const path = isLoginMobile === 0 ? "/SelectSocialkyc" : "/KycOnboardHoc";
        console.log("stepParams", stepParams);
        router.push({ pathname: path, params: stepParams });
      }
    } catch (error) {
      console.error("KYC error:", error);
      showToast({ text1: "KYC process failed", type: "error" });
    } finally {
      setLoadingState('kyc', false);
    }
  }, [
    loadingStates.kyc,
    myProfileData?.data,
    isLoginMobile,
    onSetUserFromType,
    onSetShowKycModalStore,
    setIsVerified,
    userId,
    dispatch,
    setLoadingState
  ]);

  const onReferralPress = useCallback(() => {
    if (loadingStates.navigation) return;
    router.push("/refer-and-earn");
  }, [loadingStates.navigation]);

  return (
    <ViewWrapper>
      <GoBackNavigation header="Settings" isDeepLink={true} />

      <ScrollView 
        style={{ width: "90%" }} 
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
      >
        {/* Referral content */}
        <LinearGradient
          colors={globalColors.cardBg1}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            padding: 16,
            borderRadius: 12,
            marginTop: "5%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {/* Header Text */}
          <Text
            style={{
              fontSize: 22,
              lineHeight: 28,
              fontFamily: fontFamilies.bold,
              color: "#fff",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Refer friends and earn!
          </Text>

          {/* Description Text */}
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              fontFamily: fontFamilies.regular,
              color: "#f5f5f5",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            For every referral, you and your{"\n"}friends get{" "}
            <Text
              style={{
                fontFamily: fontFamilies.semiBold,
                color: "#fff",
              }}
            >
              ₹{currencyRate}
            </Text>
          </Text>

          {/* Referral Button */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              backgroundColor: "#ffffff30",
              borderRadius: 8,
              paddingHorizontal: 16,
              opacity: loadingStates.navigation ? 0.6 : 1,
            }}
            onPress={onReferralPress}
            disabled={loadingStates.navigation}
          >
            <LottieView
              style={{
                width: 30,
                height: 30,
                marginRight: 12,
              }}
              source={require("../../assets/lottie/animation.json")}
              autoPlay
              loop
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: fontFamilies.semiBold,
                color: "#fff",
              }}
            >
              {loadingStates.navigation ? "Loading..." : "Share Referral"}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Settings List */}
        <View
          style={{
            borderRadius: 8,
            backgroundColor: globalColors.neutral2,
            borderColor: "#282b32",
            borderWidth: 1,
            width: "100%",
            padding: "4%",
            marginTop: "5%",
          }}
        >
          {settingsOptions.map((option: any, index) => (
            <SettingItem
              key={option.screen}
              option={option}
              index={index}
              onPress={navigateToScreen}
              isDeleteAccount={option.label === "Delete Account"}
              myProfileData={myProfileData}
            />
          ))}
        </View>

        <Button1
          isLoading={loadingStates.logout}
          title={loadingStates.logout ? "Logging out..." : "Logout"}
          onPress={onPressLogoutHandler}
          disabled={loadingStates.logout}
        />

        {shouldShowKycModal && (
          <DynamicContentModal 
            onPressModal={() => {}} 
            onPress={onKycPress}
            loading={loadingStates.kyc}
          />
        )}

        {/* Custom Logout Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => !loadingStates.logout && setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: globalColors.neutral2,
                borderRadius: 10,
                padding: 20,
                alignItems: "center",
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: fontFamilies.bold,
                  color: globalColors.neutralWhite,
                  marginBottom: 10,
                }}
              >
                Confirm Logout
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                Are you sure you want to logout?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                    minWidth: 100,
                    alignItems: "center",
                    backgroundColor: globalColors.neutral4,
                    opacity: loadingStates.logout ? 0.6 : 1,
                  }}
                  onPress={() => !loadingStates.logout && setModalVisible(false)}
                  disabled={loadingStates.logout}
                >
                  <Text
                    style={{
                      color: globalColors.neutralWhite,
                      fontFamily: fontFamilies.medium,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                    minWidth: 100,
                    alignItems: "center",
                    backgroundColor: globalColors.neutral4,
                    opacity: loadingStates.logout ? 0.6 : 1,
                  }}
                  onPress={confirmLogout}
                  disabled={loadingStates.logout}
                >
                  <Text
                    style={{
                      color: globalColors.neutralWhite,
                      fontFamily: fontFamilies.medium,
                    }}
                  >
                    {loadingStates.logout ? "Logging out..." : "Logout"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ViewWrapper>
  );
};

export default SettingScreen;