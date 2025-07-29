import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { VerifyOtpApi } from "@/redux/reducer/login/VerifyOtpApi";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { useAppStore } from "@/zustand/zustandStore";
import {
  setEmailLocal,
  setFullNameLocal,
  setMobileLocal,
  setProfilePicStore,
  setUserDetails,
  storeIsLoggedIn,
  storeUserData,
  storeUserKycStatus,
} from "@/localDB/LocalStroage";
import { setTokens, setUserInfoValue } from "@/localDB/TokenManager";
import BottomSheet from "@gorhom/bottom-sheet";
import { onChangeKycContact } from "@/redux/reducer/kyc/ChangeKycContact";
import { setAccessToken } from "@/redux/slice/login/LoginUserSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeDate } from "@/utils/storeCureenData";
import { setPostLocalData } from "@/redux/slice/home/HomePostSlice";

export default function useVerifyOtpViewModel() {
  const { setUserId, setUserInfo, onSetUserLoginType, userId, userFromType } =
    useAppStore();
  const dispatch = useAppDispatch();
  const verifyOtpData: any = useAppSelector((state) => state.verifyOtpApi);
  const changeKycContactResponse = useAppSelector(
    (state) => state.changeKycContactData
  );
  const changeContactRef = useRef<BottomSheet>(null);
  const [otp, setOtp] = useState('');
  const [verifyUserCalled, setVerifyUserCalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isKycValue, setIsKyc] = useState(false);
  const [newContact, setNewContact] = useState("");
  const [contactCalled, setContactCalled] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(intervalId);
          setShowResend(true);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  const handleSuccessfulVerification = async (data: any,isOldUser) => {
    if (isKycValue) {
      setUserInfoValue(verifyOtpData?.data || verifyOtpData);
      setUserId(verifyOtpData?.data?.id);
      await storeUserData({
        userId: verifyOtpData?.data?.id,
        isLoggedIn: true,
        kycStatusStore: verifyOtpData?.data?.kyc_status,
        identificationType: verifyOtpData?.data?.join_type,
      });
      await storeUserKycStatus(verifyOtpData?.data?.kyc_status);
      await setProfilePicStore(verifyOtpData?.data?.profile_pic);
      await setUserDetails(verifyOtpData?.data);
      navigateBasedOnKycStatus();
      setFullNameLocal({ first: verifyOtpData?.data?.full_name });
      setEmailLocal({ email: verifyOtpData?.data?.email });
      setMobileLocal({ mobile: verifyOtpData?.data?.phone });
      resetState();
    } else {
      updateUserData(data,isOldUser);
    }
  };

  const updateUserData = async (u_data: any,isOldUser) => {
    try {
      const { accessToken,refreshToken, data } = u_data || {};
      if (!accessToken || !data) return;
      
      // router.replace("/SelectPreferences");
      setUserId(data?.id || "");
      AsyncStorage.setItem("acc_token", accessToken || "");
      const route = isOldUser == "false"
? "/SelectPreferences"
: "/DashboardScreen"
router.replace({pathname: route, params: {user_id: data?.id.toString()}});
      // Parallel async operations
await Promise.all([
  // Store tokens in AsyncStorage
  AsyncStorage.multiSet([
    ["ref_token", refreshToken || ""],
    ["user_id", data?.id.toString()],
    ["user_login_type", data?.join_type || ""],
    ["isNewUser", isOldUser.toString()],
  ]),

  // Set access/refresh tokens in Zustand or local state
  (async () => {
    setTokens({
      accessToken: accessToken || "",
      refreshToken: refreshToken || "",
    });
  })(),

  // Set user info in various stores (some of these are likely sync)
  (async () => {
    setUserInfo(data);
    
    dispatch(setAccessToken(accessToken || ""));
    setUserInfoValue(data);
    setProfilePicStore(data?.profile_pic || "");
    setUserDetails(data);
    setEmailLocal({ email: data?.email || "" });
  })(),

  // Store user data in local store / Zustand
  storeUserData({
    userId: data?.id || "",
    isLoggedIn: true,
    kycStatusStore: data?.kyc_status || 0,
    identificationType: data?.join_type || '',
  }),

  // Other user-specific info
  (async () => {
    onSetUserLoginType(data?.join_type|| '');
    storeUserKycStatus(data?.kyc_status || 0);
    storeIsLoggedIn(true);
  })(),
]);

    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      resetState();
    }
  };

  const navigateBasedOnKycStatus = () => {
    const route = !verifyOtpData?.data?.fav_categories?.category_ids?.length
      ? "/SelectPreferences"
      : "/DashboardScreen";
    router.replace(route);
  };

  const handleFailedVerification = (message: string) => {
    showToast({ type: "error", text1: `${message}` });
    resetState();
  };

  const resetState = () => {
    setVerifyUserCalled(false);
    setLoading(false);
    setIsKyc(false);
  };

  const onVerifyOtpHandler = ({
    contact,
    ccode,
    isMobile,
    loginType,
    fname,
    lname,
    isKyc,
  }) => {
    if (otp.length !== 5) {
      showToast({ type: "error", text1: "Enter 5-digit OTP" });
      return;
    }
    setIsKyc(isKyc);
    setVerifyUserCalled(true);
    setLoading(true);
    storeDate();

    dispatch(
      VerifyOtpApi({
        contact,
        otp,
        isMobile,
        ccode,
        loginType,
        identityType: userFromType === "event" ? 2 : 0,
        fname,
        lname,
      })
    );
  };

  const onSubmitContactHandler = async ({ isMobile }) => {
    if (newContact.length > 8) {
      setContactLoading(true);
      var changeContactResponse: any = await dispatch(
        onChangeKycContact({
          userId: userId,
          contact: newContact,
          isMobile: isMobile,
        })
      );
      setContactLoading(false);
      if(changeContactResponse?.payload?.success){
        showToast({ text1: changeContactResponse?.payload?.message, type: "success" });
      }
      else{
        showToast({ text1: changeContactResponse?.payload?.message, type: "error" });
      }
    } else {
      showToast({ text1: "Enter valid contact", type: "error" });
    }
  };


  return {
    otp,
    onVerifyOtpHandler,
    onResendHandler: () => console.log("resend"),
    onEditHandler: () => router.back(),
    onChangeOtpHandler: (code) => setOtp(code),
    loading,
    showResend,
    handleSuccessfulVerification,
    countdown,
    onPressKycContact: () => changeContactRef.current?.expand(),
    changeContactRef,
    onEnterNewContact: setNewContact,
    newContact,
    handleFailedVerification,
    resetState,
    onSubmitContactHandler,
    onCancleKycContact: () => changeContactRef.current?.close(),
    contactLoading,
  };
}
