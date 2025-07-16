import {
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import ViewWrapper from "../../../components/ViewWrapper";
import ScreenHeaderComponent from "../../../components/Header/ScreenHeaderComponent";
import Button1 from "../../../components/buttons/Button1";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { EditIcon } from "@/assets/DarkIcon";
import useVerifyOtpViewModel from "./viewModel/VerifyOtpViewModel";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { useEffect, useRef, useState } from "react";
import Clipboard from "@react-native-clipboard/clipboard";
import GradientText from "@/components/element/GradientText";
import { showToast } from "@/components/atom/ToastMessageComponent";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import { getLoggedMobile } from "@/localDB/LocalStroage";
import KeyboardDismissWrapper from "@/components/element/KeyboardDismissWrapper";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useAppStore } from "@/zustand/zustandStore";
import {
  onKycChangeContact,
  onKycOtpVerify,
  onKycSendOtp,
} from "@/redux/reducer/kyc/kycDetails";
import { useAppSelector } from "@/utils/Hooks";
import {
  clearAllValues,
  setKycLoading,
} from "@/redux/slice/kyc/kycDetailsSlice";
import { fetchMyProfileDetails } from "@/redux/reducer/Profile/FetchProfileDetailsApi";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const VerifyKycOtpScreen = () => {
  useScreenTracking("VerifyKycOtpScreen");
  const params = useLocalSearchParams();
  const { contact, isMobile } = params;
  const [otp, setOtp] = useState([]);
  const { changeContactRef, onEnterNewContact, newContact, contactLoading } =
    useVerifyOtpViewModel();
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const { userId } = useAppStore();
  const dispatch = useDispatch();
  const kycDetailsResponse = useAppSelector(
    (state) => state.kycDetailsResponse
  );
  const userDetailsData = useSelector(
    (state: any) => state.myProfileData,
    shallowEqual
  );
  const isLoginMobile = getLoggedMobile();
  const contactData =
    isLoginMobile === 0
      ? userDetailsData?.data?.kyc_details?.temp_email
      : userDetailsData?.data?.kyc_details?.phone;
  useEffect(() => {
    const fetchClipboardContent = async () => {
      const clipboardContent: any = await Clipboard.getString();
      if (clipboardContent.length === 6 && !isNaN(clipboardContent)) {
        setOtp(clipboardContent);
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
    setIsTimerActive(true);
    setTimer(90);
    dispatch(
      //@ts-ignore
      onKycSendOtp({
        userId: userId,
        contact: newContact || contact || contactData,
      })
    );
  };

  const updateContact = async () => {
    changeContactRef.current.close();
   
    var changeContactResult: any = await dispatch(
      //@ts-ignore
      onKycChangeContact({ userId: userId, contact: newContact })
    );
    if (changeContactResult?.payload?.success) {
      dispatch(
        //@ts-ignore
        onKycSendOtp({ userId: userId, contact: newContact || contactData })
      );
      dispatch(clearAllValues(""));
    } else {
      showToast({
        type: "error",
        text1: changeContactResult?.payload?.message || "Something went wrong",
      });
    }
  };

  const VerifyKycOtp = async () => {
    if (otp.length !== 5) {
      showToast({ type: "error", text1: "Enter 5-digit OTP" });
      return;
    }
    dispatch(setKycLoading(true));
    var result: any = await dispatch(
      //@ts-ignore
      onKycOtpVerify({ otp: otp, userId: userId })
    );
    if (result?.payload?.success) {
      Alert.alert(
        "Kyc Submitted Successfully",
        "Thank you for submitting your KYC details. Our team will review and approve your document within 72 hours (3 business days). You will receive a notification once the verification process is completed.",
        [
          {
            text: "Ok",
            style: "default",
            onPress: () => {
              dispatch(
                //@ts-ignore
                fetchMyProfileDetails({
                  userId: userId,
                })
              );
              router.replace("/DashboardScreen");
            },
          },
        ]
      );
    } else {
      showToast({
        type: "error",
        text1: result?.payload?.message || "Something went wrong",
      });
    }
  };

  const onCodeChanged = (code) => {
    setOtp(code);
  };

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
              isMobile === "0" ? "mobile number" : "email address"
            }`}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: "5%",
              width: "80%",
            }}
          >
            <View style={{ flex: 1, marginRight: 4 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15.5,
                  lineHeight: 18,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutral8,
                }}
              >
                OTP Sent to {contact ? newContact || contact : "mobile number"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                //@ts-ignore
                onEnterNewContact(newContact || contact);
                Keyboard.dismiss(); // Close the keyboard
                changeContactRef.current.expand();
              }}
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

          <OTPInputView
            style={{ width: "100%", height: 100 }}
            pinCount={5}
            editable={true}
            onCodeChanged={(code: any) => {
              onCodeChanged(code);
            }}
            autoFocusOnLoad={Platform?.OS === "ios" ? true : false} //ios true
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(code) => {}}
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
                fontSize: 14,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutral8,
                lineHeight: 18,
              }}
            >
              Didn’t receive the OTP ?{"  "}
            </Text>

            <TouchableOpacity onPress={sendOtp} disabled={isTimerActive}>
              <GradientText
                style={{
                  fontFamily: fontFamilies.bold,
                  fontSize: 17,
                  color: globalColors.darkOrchid,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 21,
                    fontFamily: fontFamilies.bold,
                    color: globalColors.neutralWhite,
                  }}
                >
                  {isTimerActive ? `Resend (${timer})` : "Resend"}
                </Text>
              </GradientText>
            </TouchableOpacity>
          </View>

          <Button1
            title="Verify OTP"
            isLoading={kycDetailsResponse.isLoaded}
            onPress={() => {
              VerifyKycOtp();
            }}
          />
        </View>
      </KeyboardDismissWrapper>
      <BottomSheetWrap
        snapPoints={["20%", "60%"]}
        bottomSheetRef={changeContactRef}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 20,
              textAlign: "center",
              marginBottom: "5%",
            }}
          >
            Update {isLoginMobile === 1 ? "Mobile" : "Email"}
          </Text>

          <View
            style={{
              padding: "3%",
              borderRadius: 10,
              backgroundColor: globalColors.slateBlueShade20,
              marginBottom: "5%",
              width: "100%",
            }}
          >
            <TextInput
              placeholder={isLoginMobile === 1 ? "Mobile" : "Email"}
              value={newContact}
              onChangeText={(text) => onEnterNewContact(text)}
              placeholderTextColor={globalColors.neutral7}
              style={{
                fontSize: 14,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
              }}
            />
          </View>

          <Button1
            isLoading={contactLoading}
            title="Update"
            onPress={() => {
              updateContact();
            }}
          />
          <TouchableOpacity onPress={() => changeContactRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
                color: globalColors.darkOrchid,
                marginTop: "2%",
              }}
            >
              <Text style={{ color: globalColors.neutralWhite, fontSize: 17 }}>
                Cancel
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>
    </ViewWrapper>
  );
};
export default VerifyKycOtpScreen;

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
});
