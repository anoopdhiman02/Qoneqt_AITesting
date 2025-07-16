import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ViewWrapper from "../../components/ViewWrapper";
import GoBackNavigation from "../../components/Header/GoBackNavigation";
import KycStatusBar from "../../components/element/KycStatusBar";
import BasicDetailForm from "./BasicDetailForm";
import { useAppStore } from "../../zustand/zustandStore";
import FaceVerification from "./FaceVerification";
import { fontFamilies } from "../../assets/fonts";
import { router, useLocalSearchParams } from "expo-router";
import UploadDocumentOne from "./UploadDocumentOne";
import { globalColors } from "@/assets/GlobalColors";
import PanUpload from "./PanUpload";
import KeyboardDismissWrapper from "@/components/element/KeyboardDismissWrapper";
import { StepEventData, StepNormalData } from "@/utils/defaultDb";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const KycOnboardHoc = () => {
  useScreenTracking("KycOnboardHoc");
  const params = useLocalSearchParams();
  const { userFromType } = useAppStore();
  const step = Number(params?.kycStepData || 0);

  let stepData = userFromType == "event" ? StepEventData : StepNormalData;
  const currentStepData = stepData.find((item) => item.id === step);
  const renderStepComponent = () => {
    console.log("step", step);
    switch (step) {
      case 0:
        return (
          <BasicDetailForm
            fName={params?.first_name || ""}
            lName={params?.last_name || ""}
            email={params?.email || ""}
            type={Number(params?.type || 0)}
          />
        );
      case 1:
        return <FaceVerification />;
      case 2:
        return <UploadDocumentOne />;
      case 5:
        return <PanUpload />;
      case 6:
        return <PanUpload />;
      default:
        return (
          <BasicDetailForm
            fName={params?.first_name || ""}
            lName={params?.last_name || ""}
            email={params?.email || ""}
            type={Number(params?.type || 0)}
          />
        );
    }
  };

  const backPress = () => {
    if(params?.isBasicDetail == "true"){
      router.replace("/DashboardScreen");
    }else{
      router.back();
    }
  };


  return (
    <ViewWrapper>
      <GoBackNavigation isBack={true} backPress={backPress} isHome isDeepLink={true} />
      <KeyboardDismissWrapper>
        <View style={styles.container}>
          {/* 2 */}
          <View style={styles.subContainer}>
            <Text style={styles.titleText}>{currentStepData?.title}</Text>
            <KycStatusBar
              //@ts-ignore
              data={stepData}
              completeStep={step}
            />
          </View>
          {renderStepComponent()}
        </View>
      </KeyboardDismissWrapper>
    </ViewWrapper>
  );
};

export default KycOnboardHoc;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    alignItems: "center",
  },
  subContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    alignSelf: "center",
    marginTop: "3%",
    width: "90%",
    marginBottom: "5%",
  },
  titleText: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
  },
});
