import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Linking,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";
import { useLocalSearchParams } from "expo-router";

import ViewWrapper from "../../../components/ViewWrapper";
import ScreenHeaderComponent from "../../../components/Header/ScreenHeaderComponent";
import MobileInput from "../../../components/element/MobileInput";
import TextInputComponent from "../../../components/element/TextInputComponent";
import Button1 from "../../../components/buttons/Button1";
import ButtonTwo from "../../../components/buttons/ButtonTwo";

import {
  DialPadIcon,
  LockIcon,
  MailIcon,
  SquareTickIcon,
} from "@/assets/DarkIcon";
import useLoginViewModel from "../../../viewModels/LoginViewModel";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import KeyboardDismissWrapper from "@/components/element/KeyboardDismissWrapper";
import { setPrefsValue } from "@/utils/storage";
import { useAppSelector } from "@/utils/Hooks";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import useNetworkStatus from "@/app/hooks/useNetworkStatus";

const LoginScreen = () => {
  useScreenTracking("LoginScreen");
  const params = useLocalSearchParams();
  const isConnect = useNetworkStatus();
  

  const {
    show,
    countryCode,
    onPressCountry,
    onSelectCountryCode,
    contact,
    onEnterContact,
    error,
    isMobile,
    onLoginHandler,
    loading,
    onPressChangeType,
    onSelectAgreement,
    isAgree,
  } = useLoginViewModel();
  const fetchLoginUser = useAppSelector((state) => state?.loginUserApi);

  const [newCode, setNewCode] = useState("");
  const [isEdit, setEdit] = useState(true);
  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
    };
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    // Custom back button behavior
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        { text: "Cancel", style: "cancel" },
        { text: "Exit", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      setPrefsValue("referral_code", "");
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (params?.referCode?.length > 0) {
      setNewCode(params?.referCode?.toString());
      setEdit(false);
    }
  }, []);

  const onEnterReferralCodeHandler = (text) => setNewCode(text);


  return (
    <KeyboardDismissWrapper>
      <ViewWrapper>
        <View style={{ width: "90%", marginTop: "5%" }}>
          <ScrollView>
            {isMobile ? (
              <ScreenHeaderComponent
                header="Let's get started"
                title="Register or login with mobile number"
              />
            ) : (
              <ScreenHeaderComponent
                header="Let's get started"
                title="Register or login with Email"
              />
            )}
            <View style={{ marginTop: "10%" }}>
              <CountryPicker
                enableModalAvoiding={true}
                show={show}
                pickerButtonOnPress={onSelectCountryCode}
                popularCountries={["IN"]}
                style={{
                  modal: {
                    position: "absolute",
                    top: 0,
                    marginTop: "15%",
                  },
                }}
              />
            </View>

            {isMobile ? (
              <MobileInput
                value={contact}
                onChangeValue={onEnterContact}
                onPressCountry={onPressCountry}
                countryCode={countryCode}
                error={error?.status}
              />
            ) : (
              <TextInputComponent
                header="Email"
                placeHolder="Enter Your Email"
                keyboardType={"email-address"}
                error={error}
                value={contact}
                onChangeValue={onEnterContact}
                autoCapitalize={"none"}
              />
            )}

            <TextInputComponent
              autoCapitalize="none"
              header="Referral code (Optional)"
              placeHolder="Enter Referral"
              defaultValue={newCode}
              value={newCode}
              onChangeText={(text) => {
                onEnterReferralCodeHandler(text);
              }}
              editable={isEdit}
            />

            <Button1
              title="Request OTP"
              onPress={() => onLoginHandler({ referValue: newCode })}
              isLoading={fetchLoginUser.isLoaded}
            />

            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                marginTop: "5%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "stretch",
                  marginBottom: 10,
                }}
              >
                <LockIcon />
                <Text
                  style={{
                    fontSize: 13,
                    lineHeight: 20,
                    fontFamily: fontFamilies.semiBold,
                    color: globalColors.neutral9,
                    marginLeft: 4,
                  }}
                >
                  We ensure your data is securely encrypted with TLS.
                </Text>
              </View>

              <TouchableOpacity
                onPress={onSelectAgreement}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                {isAgree ? (
                  <SquareTickIcon />
                ) : (
                  <TouchableOpacity
                    onPress={onSelectAgreement}
                    style={{
                      width: 16,
                      height: 16,
                      borderWidth: 1.5,
                      borderColor: globalColors.neutralWhite,
                      borderRadius: 4,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 4,
                    }}
                  />
                )}
                <Text
                  style={{
                    fontSize: 13,
                    lineHeight: 20,
                    fontFamily: fontFamilies.semiBold,
                    color: globalColors.neutral9,
                    marginLeft: 5,
                    flex: 1,
                  }}
                >
                  By registering, I agree to{" "}
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      fontSize: 13,
                      fontFamily: fontFamilies.semiBold,
                      color: globalColors.darkOrchid,
                    }}
                    onPress={() =>
                      Linking.openURL("https://qoneqt.com/terms-of-service")
                    }
                  >
                    Qoneqt's Terms & Conditions
                  </Text>{" "}
                  and Privacy Policy.
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                backgroundColor: globalColors.neutral5,
                height: 1,
                marginVertical: "3.5%",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 18,
                  fontFamily: fontFamilies.bold,
                  color: globalColors.neutralWhite,
                  marginLeft: 16,
                  position: "absolute",
                  alignSelf: "center",
                  bottom: -8,
                  backgroundColor: globalColors.neutral1,
                  width: "10%",
                  textAlign: "center",
                }}
              >
                or
              </Text>
            </View>
            <ButtonTwo
              leftIcon={
                isMobile ? <MailIcon /> : <DialPadIcon style={{ top: 1 }} />
              }
              label={
                isMobile ? "Sign in with email" : "Sign in with mobile number"
              }
              btnType="email"
              onPress={onPressChangeType}
              containerStyle={{ marginBottom: 10, marginLeft: 0 }}
            />
          </ScrollView>
        </View>
      </ViewWrapper>
    </KeyboardDismissWrapper>
  );
};

export default LoginScreen;
