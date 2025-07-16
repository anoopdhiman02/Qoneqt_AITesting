import { BackHandler, Text, TouchableOpacity, View } from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import { router, useLocalSearchParams } from "expo-router";
import { DocumentIcon, InfoIcon, LinkedinIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import useKycOnboardViewModel from "./viewModel/KycOnboardViewModel";
import { useEffect, useState } from "react";
import { showToast } from "@/components/atom/ToastMessageComponent";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import { useAppStore } from "@/zustand/zustandStore";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const SelectVerificationScreen = () => {
  useScreenTracking("SelectVerificationScreen");
  const param = useLocalSearchParams();
  const { userFromType } = useAppStore();

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

  return (
    <ViewWrapper>
      <GoBackNavigation  isHome isDeepLink={true} />
      <View
        style={{
          marginTop: "5%",
          paddingHorizontal: "5%",
        }}
      >
        {/* Verify Account */}
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontFamily: fontFamilies.semiBold,
              color: globalColors.neutralWhite,
              textAlign: "center",
            }}
          >
            Verify your Account
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral7,
              textAlign: "center",
              marginTop: "2%",
            }}
          >
            Get a verified mark and claim up to ₹83
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onPressVerifyDocument()}
          style={{
            borderRadius: 8,
            borderColor: globalColors.neutral9,
            borderWidth: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: "5%",
            marginTop: "6%",
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
              {userFromType === "event" ? "Verify" : "Verify"}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutral7,
                marginTop: "3%",
                lineHeight: 20,
              }}
            >
              Please enter your details based on your ID and upload a photo for
              face verification to complete the process.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Why is this needed? */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: "5%",
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
              fontSize: 14,
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
    </ViewWrapper>
  );
};

export default SelectVerificationScreen;
