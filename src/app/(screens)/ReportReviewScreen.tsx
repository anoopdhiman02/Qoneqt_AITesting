import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import ViewWrapper from "@/components/ViewWrapper";
import Button1 from "@/components/buttons/Button1";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import { useAppStore } from "@/zustand/zustandStore";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { onSubmitReport } from "@/redux/reducer/report/SubmitReport";
import { useReportStore } from "@/zustand/reportStore";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const SpamComp = ({ reportFor, reportDesc }) => (
  <View
    style={{
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#282b32",
      width: "100%",
      padding: 12,
      marginTop: 12,
    }}
  >
    <Text
      style={{
        fontSize: 14,
        lineHeight: 20,
        fontFamily: fontFamilies.regular,
        color: globalColors.neutralWhite,
      }}
    >
      {reportFor}
    </Text>
    <Text
      style={{
        fontSize: 12,
        lineHeight: 20,
        fontFamily: fontFamilies.regular,
        color: globalColors.neutral9,
        marginTop: 8,
      }}
    >
      {reportDesc}
    </Text>
  </View>
);

const ReportReviewScreen = () => {
  useScreenTracking("ReportReviewScreen");
  const { userId } = useAppStore();
  const { reportUserDetails } = useReportStore();
  const dispatch = useAppDispatch();
  const submitReportData = useAppSelector((state) => state?.submitReportData);

  const [submitApiCalled, setSubmitApiCalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState("");
  const [nameError, setNameError] = useState(false);

  const onEnterRemarkHandler = (text) => {
    setRemark(text);
  };

  const onSubmitReportHandler = () => {
    if (!remark.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);

    const payload = {
      user_id: userId,
      report_id: reportUserDetails?.reportId,
      raised_for: reportUserDetails?.reportFor,
      raised_type: reportUserDetails?.reportType,
      raised_against: reportUserDetails?.name,
      raised_by: userId,
      reason: remark,
    };

    dispatch(onSubmitReport(payload));
    setSubmitApiCalled(true);
    setLoading(true);
  };

  useEffect(() => {
    if (submitApiCalled) {
      if (submitReportData?.success) {
        showToast({ type: "success", text1: "Report submitted successfully" });
        router.push("/ReportStatusScreen");
      } else {
        showToast({
          type: "error",
          text1: submitReportData?.message || "something went wrong",
        });
      }
      setSubmitApiCalled(false);
      setLoading(false);
    }
  }, [submitReportData]);

  return (
    <ViewWrapper>
      <GoBackNavigation header="Report group" isDeepLink={true} />
      <View style={{ width: "90%" }}>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 21,
            fontFamily: fontFamilies.medium,
            color: globalColors.neutralWhite,
            marginTop: 20,
          }}
        >
          Review your report
        </Text>
        <SpamComp
          reportDesc={reportUserDetails?.reportDescription}
          reportFor={reportUserDetails?.reportFor}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 5,
            height: 50,
            marginTop: 20,
            borderColor: globalColors.neutral2,
            borderWidth: 1,
          }}
        >
          <TextInput
            placeholder="Add your remarks..."
            value={remark}
            onChangeText={onEnterRemarkHandler}
            placeholderTextColor={globalColors.neutral7}
            style={{
              fontSize: 14,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutralWhite,
              flex: 1,
              textAlignVertical: "center",
            }}
          />
        </View>
        {nameError && (
          <Text
            style={{
              color: globalColors.warning,
              marginTop: 8,
              fontSize: 14,
              fontFamily: fontFamilies.regular,
            }}
          >
            Please enter your remarks before submitting.
          </Text>
        )}
        <Text
          style={{
            color: globalColors.neutral4,
            marginTop: 20,
          }}
        >
          Note: You will be automatically removed from the group and the
          associated Sub-groups.
        </Text>
        <View style={{ marginTop: 20 }}>
          <Button1
            isLoading={loading}
            title="Submit"
            onPress={onSubmitReportHandler}
            containerStyle={{marginHorizontal: '2.5%'}}
          />
        </View>
      </View>
    </ViewWrapper>
  );
};

export default ReportReviewScreen;
