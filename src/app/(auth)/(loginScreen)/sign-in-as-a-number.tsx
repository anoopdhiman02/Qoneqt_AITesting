import React, { useEffect } from "react";
import {
  Alert,
  BackHandler,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import ViewWrapper from "../../../components/ViewWrapper";
import ScreenHeaderComponent from "../../../components/Header/ScreenHeaderComponent";
import MobileInput from "../../../components/element/MobileInput";
import TextInputComponent from "../../../components/element/TextInputComponent";
import Button1 from "../../../components/buttons/Button1";
import ButtonTwo from "../../../components/buttons/ButtonTwo";

import {
  DialPadIcon,
  GoogleIcon,
  LinkedinIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  SquareTickIcon,
} from "@/assets/DarkIcon";
import useLoginViewModel from "../../../viewModels/LoginViewModel";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import { useCheckVersionStore } from "@/zustand/checkVersionStore";
import KeyboardDismissWrapper from "@/components/element/KeyboardDismissWrapper";
import { useAppSelector } from "@/utils/Hooks";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const index = () => {
  const params = useLocalSearchParams();
  useScreenTracking("SignInAsANumber");
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
    onEnterReferralCodeHandler,
    referralCode,
    isEdit
  } = useLoginViewModel();

  const {
    linkedin,
  } = useCheckVersionStore();
const fetchLoginUser = useAppSelector((state) => state?.loginUserApi);
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

    return () => backHandler.remove();
  }, []);

  return (
    <KeyboardDismissWrapper>
      <ViewWrapper>
        <View style={{ width: "90%", marginTop: "5%" }}>
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
            lang="en"
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
              error={error.status}
            />
          ) : (
            <TextInputComponent
              header="Email"
              placeHolder="Enter Your Email"
              error={error}
              value={contact}
              onChangeValue={onEnterContact}
            />
          )}

          <TextInputComponent
            autoCapitalize="none"
            header="Referral code"
            placeHolder="Enter Referral code"
            defaultValue={params?.join_by}
            value={referralCode}
            onChangeText={(text) => {
              onEnterReferralCodeHandler(text);
            }}
            editable={isEdit}
          />

          <Button1
            title="Request OTP"
            onPress={() => onLoginHandler({ referValue: referralCode })}
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
                alignSelf: "stretch",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <LockIcon />
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 24,
                  fontFamily: fontFamilies.semiBold,
                  color: globalColors.neutral9,
                  textAlign: "center",
                  marginLeft: 4,
                }}
              >
                We ensure your data is securely encrypted with TLS
              </Text>
            </View>
            <TouchableOpacity
              onPress={onSelectAgreement}
              style={{
                alignSelf: "stretch",
                flexDirection: "row",
                alignItems: "flex-start",
                marginTop: 4,
              }}
            >
              {isAgree ? (
                <SquareTickIcon />
              ) : (
                <TouchableOpacity
                  onPress={onSelectAgreement}
                  style={{
                    width: 12,
                    height: 12,
                    borderWidth: 1,
                    borderColor: globalColors.neutralWhite,
                    margin: 5,
                    borderRadius: 1.5,
                  }}
                />
              )}
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 22,
                  fontFamily: fontFamilies.semiBold,
                  color: globalColors.neutral9,
                  marginLeft: 4,
                }}
              >
                By registering, I agree to{" "}
                <Text style={{ textDecorationLine: "underline" }}>
                  Qoneqt's Terms & Conditions
                </Text>{" "}
                and Privacy Policy
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

          {isMobile ? (
            <ButtonTwo
              leftIcon={<MailIcon />}
              label={
                isMobile ? "Sign in with email" : "Sign in with mobile number"
              }
              btnType="email"
              onPress={onPressChangeType}
            />
          ) : (
            <ButtonTwo
              leftIcon={<DialPadIcon style={{ top: 1 }} />}
              label={
                isMobile ? "Sign in with email" : "Sign in with mobile number"
              }
              btnType="email"
              onPress={onPressChangeType}
            />
          )}
        </View>
      </ViewWrapper>
    </KeyboardDismissWrapper>
  );
};

export default index;
