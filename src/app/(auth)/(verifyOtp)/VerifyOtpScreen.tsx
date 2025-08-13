import {
  Alert,
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import ViewWrapper from "../../../components/ViewWrapper";
import ScreenHeaderComponent from "../../../components/Header/ScreenHeaderComponent";
import Button1 from "../../../components/buttons/Button1";
import { EditIcon } from "@/assets/DarkIcon";
import useVerifyOtpViewModel from "./viewModel/VerifyOtpViewModel";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { useEffect, useState } from "react";
import Clipboard from "@react-native-clipboard/clipboard";
import GradientText from "@/components/element/GradientText";
import axios from "axios";
import { BASE_GO_URL } from "@/utils/constants";
import TextInputComponent from "@/components/element/TextInputComponent";
import { showToast } from "@/components/atom/ToastMessageComponent";

import { getLoggedMobile } from "@/localDB/LocalStroage";
import KeyboardDismissWrapper from "@/components/element/KeyboardDismissWrapper";
import axiosInstance from "@/utils/axiosInstance";
import { VerifyOtpApi } from "@/redux/reducer/login/VerifyOtpApi";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { useAppStore } from "@/zustand/zustandStore";
import { updateIsloaded } from "@/redux/slice/login/VerifyOtpSlice";
import useDeviceId from "@/app/hooks/useDeviceId";
import { ENDPOINTS } from "@/utils/endPoints";
import { logEvent, useScreenTracking } from "@/customHooks/useAnalytics";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';

const VerifyOtpScreen = () => {
  useScreenTracking("VerifyOtpScreen");
  const params = useLocalSearchParams();
  const { countryCode, contact, isMobile, isOldUser }: any = params;
  const { userFromType } = useAppStore();
  const {
    onEditHandler,
    onChangeOtpHandler,
    otp,
    handleSuccessfulVerification,
    handleFailedVerification,
  } = useVerifyOtpViewModel();
  const verifyOtpData = useAppSelector((state) => state.verifyOtpApi);
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstName, setFname] = useState("");
  const [lastName, setLname] = useState("");
  const [errors, setErrors] = useState({ firstName: "", lastName: "" });
  const dispatch = useAppDispatch();
  // const { OtpModule } = NativeModules;

  // const eventEmitter = new NativeEventEmitter(OtpModule);
  const isLoginMobile = getLoggedMobile();

//   OtpModule.startSmsRetriever((err, success) => {
//     if (err) console.log("Error starting retriever:", err);
//     else console.log(success);
//   });
  
//   DeviceEventEmitter.addListener('otpReceived', (message) => {
//     console.log("OTP Received:", message);
//   });


// eventEmitter.addListener('otpReceived', (message) => {
//   console.log("OTP Received>>:", message);
// });

  useEffect(() => {
    // Update axiosInstance with dispatch
    axiosInstance.setDispatch(dispatch);
  }, [dispatch]);

  const validation = () => {
    if(isOldUser == "false"){
      if (!firstName) {
        showToast({
          type: "error",
          text1: "Please Enter First Name",
        });
        return false;
      }
      if (!lastName) {
        showToast({
          type: "error",
          text1: "Please Enter Last Name",
        });
        return false;
      }
      return true;
    }
    
    return true;
  };

  useEffect(() => {
    const fetchClipboardContent = async () => {
      const clipboardContent: any = await Clipboard.getString();
      if (clipboardContent.length === 6 && !isNaN(clipboardContent)) {
        onChangeOtpHandler(clipboardContent);
        Alert.alert(
          "OTP Detected",
          `Pasted from clipboard: ${clipboardContent}`
        );
      }
    };

    fetchClipboardContent();
  }, []);


  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setIsTimerActive(false); // Stop the timer when it reaches 0
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const sendOtp = async () => {
    setIsTimerActive(true); // Start the timer when OTP is sent
    setTimer(30);

    let mobileData = {
      contact: `${countryCode}${contact}`,
      fromApp:1
    };

    let emailData = {
      contact: contact,
      fromApp:1
    };

    try {
      logEvent("resend_otp", {
        contact: contact,
      });
      const response = await axios.post(
        `${BASE_GO_URL}${ENDPOINTS.Send_OTP}`,
        isLoginMobile === 0 ? mobileData : emailData
      );
      // return response.data;
    } catch (error) {
      // console.error("Error sending OTP:", error);
      Alert.alert("", error.response.data.message || "Something went wrong. Please try again.", [
        {text: "OK", onPress: () => {}}
      ])
      // return error;
    }
  };

  useEffect(() => {
    if (otp.length == 5) {
      otpHandler();
    }
  }, [otp]);

  const otpHandler = async () => {
    try {
      if (!validation()) return;
    const deviceInfo = await useDeviceId();
    dispatch(updateIsloaded(true));
    logEvent("verify_otp", {
      contact: contact,
    });
     var otpData: any = await dispatch(
        VerifyOtpApi({
          contact: contact,
          ccode: countryCode,
          otp: otp,
          isMobile: isMobile,
          loginType: isOldUser,
          fname: firstName,
          lname: lastName,
          device_id: deviceInfo,
        })
      );
      if (otpData?.payload?.success) {
        dispatch(updateIsloaded(false));
        handleSuccessfulVerification(otpData?.payload,isOldUser );
      } else {
        dispatch(updateIsloaded(false));
        handleFailedVerification(otpData?.payload?.message || otpData?.message);
      }
    } catch (error) {
      dispatch(updateIsloaded(false));
      handleFailedVerification(error?.message || error?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const onChangeFirstName = (val) => {
    setFname(val);
  };

  const onChangeLastName = (val) => {
    setLname(val);
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      // sendOtp();
    }
    return () => {
      isMounted = false;
    };
  }, []);


   const CELL_COUNT = 5;
    const ref = useBlurOnFulfill({ value: otp, cellCount: 5 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value: otp,
      setValue: onChangeOtpHandler,
    });
  return (
    <ViewWrapper>
      <KeyboardDismissWrapper>
        <View
          style={{
            width: "90%",
            marginTop: "5%",
          }}
        >
          <ScreenHeaderComponent
            header="OTP verification code"
            title={`We have sent you a verification code on the given ${
              isMobile == "0" ? "mobile number" : "email address"
            }`}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: "2%",
              width: "80%",
            }}
          >
            <View style={{ flex: 1, marginRight: 4 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  lineHeight: 18,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutral8,
                }}
              >
                OTP Sent to {contact ? contact : "mobile number"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onEditHandler}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <GradientText
                  style={{
                    fontSize: 16,
                    lineHeight: 18,
                    fontFamily: fontFamilies.bold,
                    marginRight: 3,
                  }}
                >
                  {"Edit"}
                </GradientText>
                <EditIcon style={{ alignSelf: "center", bottom: "5%" }} />
              </View>
            </TouchableOpacity>
          </View>

          {isOldUser === "false" ? (
            <View>
              <View style={{ width: "90%" }}>
                <TextInputComponent
                  header="First name"
                  placeHolder="Enter first name"
                  onChangeText={onChangeFirstName}
                  value={firstName}
                />

                {errors.firstName && (
                  <Text
                    style={{
                      color: globalColors.warning,
                      fontSize: 12,
                      fontFamily: fontFamilies.regular,
                      marginTop: 4,
                    }}
                  >
                    {errors.firstName}
                  </Text>
                )}
              </View>
              <View style={{ width: "90%" }}>
                <TextInputComponent
                  header="Last name"
                  placeHolder="Enter last name"
                  onChangeText={onChangeLastName}
                  value={lastName}
                />
                {errors.lastName && (
                  <Text
                    style={{
                      color: globalColors.warning,
                      fontSize: 12,
                      fontFamily: fontFamilies.regular,
                      marginTop: 4,
                    }}
                  >
                    {errors.lastName}
                  </Text>
                )}
              </View>
            </View>
          ) : null}

          <CodeField
          {...props}
                  ref={ref}
                  value={otp}
                  onChangeText={onChangeOtpHandler}
                  cellCount={5}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoFocus={Platform?.OS === "ios" ? true : false}
                  renderCell={({index, symbol, isFocused}) => (
                    <Text
                      key={index}
                      style={[styles.cell, isFocused && styles.focusCell]}
                      onLayout={getCellOnLayoutHandler(index)}>
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                  )}
                />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: "5%",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutral8,
                lineHeight: 18,
              }}
            >
              Didn’t receive the OTP ?{"  "}
            </Text>

            <TouchableOpacity onPress={sendOtp} disabled={isTimerActive}>
              {/* <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
                color: globalColors.darkOrchid,
              }}
            > */}
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 18,
                  fontFamily: fontFamilies.bold,
                  color: globalColors.neutral10,
                }}
              >
                {isTimerActive ? `Resend (${timer})` : "Resend"}
              </Text>
              {/* </GradientText> */}
            </TouchableOpacity>
          </View>

          <Button1
            title="Verify OTP"
            isLoading={verifyOtpData.isLoaded}
            onPress={() => {
              otpHandler();
            }}
          />
        </View>
      </KeyboardDismissWrapper>
    </ViewWrapper>
  );
};
export default VerifyOtpScreen;

const styles = StyleSheet.create({
  underlineStyleBase: {
    borderRadius: 8,
    backgroundColor: globalColors.neutral2,
    borderStyle: "solid",
    borderColor: globalColors.neutral8,
    borderWidth: 0.8,
    width: 50,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    fontSize: 16,
    fontFamily: fontFamilies?.extraBold,
  },

  underlineStyleHighLighted: {
    borderColor: globalColors.darkOrchidTint80,
    borderWidth: 1.8,
    backgroundColor: globalColors.neutral5,
  },
  codeFieldRoot: {marginTop: 20},
    cell: {
      borderWidth: 0.8,
      width: 50,
      height: 50,
      // lineHeight: 38,
      borderColor: globalColors.darkOrchidTint80,
      textAlign: 'center',
      backgroundColor: globalColors.neutral2,
      borderRadius: 8,
      borderStyle: "solid",
      fontSize: 16,
      fontFamily: fontFamilies?.extraBold,
      padding: 12,
      color: globalColors.neutralWhite,
      fontWeight: "bold",
    },
    focusCell: {
      borderColor: globalColors.neutral8,
      borderRadius: 8,
      backgroundColor: globalColors.neutral5,
      borderStyle: "solid",
      borderWidth: 2,
      fontSize: 16,
      fontFamily: fontFamilies?.extraBold,
      padding: 12,
      color: globalColors.neutralWhite,
      fontWeight: "bold",
      overflow: "hidden",
    },
});
