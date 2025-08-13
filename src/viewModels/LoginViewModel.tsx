import { Alert, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useAppDispatch } from "@/utils/Hooks";
import { LoginUserApi } from "@/redux/reducer/login/LoginUser";
import {
  getVersion,
  getSystemName,
  getSystemVersion,
} from "react-native-device-info";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { useAppStore } from "@/zustand/zustandStore";
import { BASE_GO_URL } from "@/utils/constants";
import {
  setLoggedMobile,
} from "@/localDB/LocalStroage";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { getPrefsValue, setPrefsValue } from "@/utils/storage";
import messaging from "@react-native-firebase/messaging";
import { setLoginLoader } from "@/redux/slice/login/LoginUserSlice";
import axios from "axios";
import { ENDPOINTS } from "@/utils/endPoints";
import { logEvent } from "@/customHooks/useAnalytics";

const useLoginViewModel = () => {
  const { setIsNewUser } = useAppStore();
  const dispatch = useAppDispatch();
  const { getReferralCode, fcmTokenStore } = useAppStore();

  // State
  const [isMobile, setIsMobile] = useState(true);
  const [contact, setContact] = useState("");
  const [referralCode, setReferralCode] = useState(getReferralCode || "");
  const [isAgree, setIsAgree] = useState(true);
  const [error, setError] = useState({ status: false, message: "", type: 0 });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isEdit, setEdit] = useState(true);
  const [countryCode, setCountryCode] = useState({
    code: "IN",
    dial_code: "+91",
    flag: "🇮🇳",
  });

  // Handler to update contact and clear error on typing
  const onEnterContact = ({ nativeEvent: { text } }) => {
    setContact(text);
    setError({ status: false, message: "", type: error.type });
  };

  const onPressCountry = () => setShow(true);

  const onSelectCountryCode = (item) => {
    const { code, dial_code, flag } = item;
    setCountryCode({ code, dial_code, flag });
    setShow(false);
  };

  const onPressChangeType = () => {
    setIsMobile(!isMobile);
    setContact("");
  };

  const onSelectAgreement = () => setIsAgree(!isAgree);

  const onEnterReferralCodeHandler = (text) => setReferralCode(text);

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const urlData = new URL(url);
        const referralCod = urlData.searchParams.get("join_by");
      if (referralCode == "" && referralCod) {
        setReferralCode(referralCod);
        setEdit(false);
      }
    };

    // Add event listener for deep links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check for any deep link URL when the app starts
    const initialUrl = Linking.getInitialURL();
    initialUrl.then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  //Dynamic Link
  useEffect(() => {
    const handleDeepLink = async (url) => {
      const urlData = new URL(url);
        const referralCod = urlData.searchParams.get("join_by");
      if (referralCode == "" && referralCod) {
        setReferralCode(referralCod);
        setEdit(false);
      }
    };

    const unsubscribe = dynamicLinks().onLink(handleDeepLink);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    var referCode = getPrefsValue("referral_code");
    if (referralCode == "" && referCode !== "") {
      setReferralCode(referCode);
      setEdit(false);
    }
    return () => {
      setPrefsValue("referral_code", "");
    };
  }, []);


  const LoginValidation = () => {
    if (isMobile) {
      if (!contact || contact.length < 10) {
        setError({
          status: true,
          message:
            "Sorry, It is an invalid mobile number. Please enter the correct mobile number to continue.",
          type: 0,
        });
        return false;
      }
    } else {
      if (!contact) {
        setError({
          status: true,
          message:
            "Sorry, It is an invalid email format. Please enter a valid email Id to continue.",
          type: 1,
        });
        return false;
      }
    }

    if (!isAgree) {
      showToast({
        type: "error",
        text1: "Please read Qoneqt Terms & conditions and Privacy Policies.",
      });
      return false;
    }

    return true;
  };

  const sendOtpHandler = async (contact) => {
    try{
      const response = await axios.post(
        `${BASE_GO_URL}${ENDPOINTS.Send_OTP}`,
        {
          contact: contact,
          fromApp:1
        }
      );
      return response?.data;
    }
    catch(error){
      console.log("error>>", JSON.stringify(error));
      return {message: error.response.data.message || "Something went wrong. Please try again.", status: error.status};
    }
  }

  const onLoginHandler = async ({ referValue }) => {
    if (LoginValidation()) {
      try{
      setLoggedMobile({ isMobile: isMobile ? 0 : 1 });
      const token = await messaging().getToken();
      dispatch(setLoginLoader(true))
      setLoading(true);
      logEvent("login_user", {
        contact: contact,
      })
     var loginData = await dispatch(
        LoginUserApi({
          contact: contact,
          ccode: countryCode?.dial_code,
          isMobile: isMobile,
          referralCode: referValue,
          os: getSystemName(),
          os_version: getSystemVersion(),
          app_version: getVersion(),
          fcmToken: token || fcmTokenStore,
        })
      )
      if(loginData?.payload?.success){
        dispatch(setLoginLoader(false))
      setLoading(false);
        setIsNewUser(!loginData?.payload?.login);
        logEvent("login_user_otp", {
          contact: contact,
        })
        const response = await sendOtpHandler(contact);
        if(response?.success){
          router.push({
            pathname: "/VerifyOtpScreen",
            params: {
              contact,
              countryCode: countryCode.dial_code,
              userId: loginData?.payload?.data?.id,
              isMobile: isMobile ? 0 : 1,
              isOldUser: loginData?.payload?.login,
              login_type: 0,
            },
          });
        }
        else{
          Alert.alert("", response?.message, [
            {text: "OK", onPress: () => {}}
          ])
        }
      }
      else {
        dispatch(setLoginLoader(false))
        setLoading(false);
        if(loginData?.payload?.status == 429){
          Alert.alert("", loginData?.payload?.message, [
            {text: "OK", onPress: () => {}}
          ])
          
        }
        else{
          console.log("loginData", loginData?.payload);
          showToast({
            type: "error",
            text1: loginData?.payload?.message || "something went wrong",
          });
        }
        
      }
    }
    catch(error){
      dispatch(setLoginLoader(false))
        setLoading(false);
      console.log("error>>", JSON.stringify(error));
    }
      
    }
  };

  return {
    show,
    countryCode,
    onPressCountry,
    onSelectCountryCode,
    contact,
    onEnterContact,
    isMobile,
    onLoginHandler,
    loading,
    error,
    onPressChangeType,
    onSelectAgreement,
    isAgree,
    onEnterReferralCodeHandler,
    referralCode,
    isEdit
  };
};

export default useLoginViewModel;

