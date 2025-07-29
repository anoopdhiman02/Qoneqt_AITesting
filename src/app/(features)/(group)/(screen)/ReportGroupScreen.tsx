import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { CheckCircleIcon, InfoIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import ViewWrapper from "@/components/ViewWrapper";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import Button1 from "@/components/buttons/Button1";
import { useReportStore } from "@/zustand/reportStore";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const ReportGroupScreen = () => {
  useScreenTracking("ReportGroupScreen");
  const { reportUserDetails, setReportUserDetails } = useReportStore();
  const [selectedOption, setSelectedOption] = useState({
    id: 0,
    title: "Spam",
    description:
      "Financial scams, posting malicious links, misusing hashtags, fake engagements",
  });

  const reportOptions = [
    {
      id: 0,
      title: "Spam",
      description:
        "Financial scams, posting malicious links, misusing hashtags, fake engagements",
    },
    {
      id: 1,
      title: "Threat",
      description:
        "Slurs, racist stereotypes, dehumanization, violent threats, wish of harm, or glorification of violence",
    },
    {
      id: 2,
      title: "Harassment",
      description:
        "Insults, unwanted sexual content, targeted harassment, and inciting harassment",
    },
    {
      id: 3,
      title: "Sexual Content or Nudity",
      description:
        "Explicit or suggestive content that violates child safety guidelines, including nudity and sexual activities",
    },
    {
      id: 4,
      title: "Child Exploitation or Abuse",
      description:
        "Content involving minors, including inappropriate images, grooming, abuse, or exploitation",
    },
    {
      id: 5,
      title: "Violence or Harmful Acts",
      description:
        "Depictions of physical harm, abuse, glorification of violent acts, or self-harm",
    },
    {
      id: 6,
      title: "Misinformation or Fake News",
      description:
        "Spreading false or misleading information that could cause harm to individuals or communities",
    },
    {
      id: 7,
      title: "Hate Speech or Discrimination",
      description:
        "Content promoting hate or discrimination based on race, gender, ethnicity, religion, sexual orientation, or disability",
    },
    {
      id: 8,
      title: "Self-Harm or Suicide Promotion",
      description:
        "Content encouraging self-harm, suicide, eating disorders, or other harmful behaviors",
    },
    {
      id: 9,
      title: "Copyright or Intellectual Property Violation",
      description:
        "Content that infringes on intellectual property rights, such as unlicensed media, images, or music",
    },
    {
      id: 10,
      title: "Illegal Activities",
      description:
        "Content promoting illegal activities, including drug use, human trafficking, or weapons sales",
    },
    {
      id: 11,
      title: "Impersonation",
      description:
        "Accounts or content pretending to be someone else, including public figures or organizations",
    },
    {
      id: 12,
      title: "Other",
      description: "Please specify your reason for reporting this content",
    },
  ];

  const handleOptionSelect = (data) => {
    setSelectedOption(data);
  };

  const onPressReport = () => {
    setReportUserDetails({
      reportFor: selectedOption?.title,
      reportDescription: selectedOption?.description,
    });

    router.push("/ReportReviewScreen");
  };

  return (
    <ViewWrapper>
      <View style={{ width: "90%" }}>
        <GoBackNavigation header="Report group" isDeepLink={true} />
        <Text
          style={{
            fontSize: 16,
            lineHeight: 21,
            fontFamily: fontFamilies.medium,
            color: globalColors.neutralWhite,
            marginTop: "10%",
            marginBottom: "10%",
          }}
        >
          What do you want to report?
        </Text>

        <ScrollView
          style={{ height: "60%" }}
          contentContainerStyle={{ paddingBottom: "20%" }}
        >
          {reportOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={{
                borderRadius: 8,
                borderStyle: "solid",
                borderColor: "#282b32",
                borderWidth: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
                marginTop: index === 0 ? 0 : 16,
                backgroundColor:
                  selectedOption?.id === index
                    ? globalColors.neutral1
                    : "transparent",
              }}
              onPress={() => handleOptionSelect(option)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 257 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      lineHeight: 20,
                      fontFamily: fontFamilies.regular,
                      color: globalColors.neutralWhite,
                    }}
                  >
                    {option.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 20,
                      fontFamily: fontFamilies.regular,
                      color: globalColors.neutral9,
                      marginTop: 8,
                    }}
                  >
                    {option.description}
                  </Text>
                </View>
              </View>

              <View>
                {selectedOption?.id === index ? (
                  <CheckCircleIcon />
                ) : (
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: globalColors.neutralWhite,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            padding: "4%",
            alignSelf: "center",
            borderRadius: 10,
            marginTop: "8%",
            borderWidth: 1,
            borderColor: globalColors.neutral3,
          }}
        >
          <InfoIcon />
          <Text style={{ color: globalColors.neutral4, left: "15%" }}>
            Note: You will be automatically removed from the group and the
            associated Sub-groups.
          </Text>
        </View>

        <Button1 title="Report" onPress={onPressReport} />
      </View>
    </ViewWrapper>
  );
};

export default ReportGroupScreen;
