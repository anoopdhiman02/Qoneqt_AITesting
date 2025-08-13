import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import { router } from "expo-router";
import GoBackNavigation from "../../components/Header/GoBackNavigation";
import { CheckCircleIcon, InfoIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import Button1 from "@/components/buttons/Button1";

const ReportUser = () => {
  const [selectedOption, setSelectedOption] = useState(null);

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

  const handlePress = (index) => {
    setSelectedOption(index);
    // router.push("/ReportReviewScreen");
  };

  const ReportOption = ({ option, index, isSelected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isSelected ? globalColors.neutral4 : globalColors.neutral7,
        backgroundColor: isSelected
          ? globalColors.neutral2
          : globalColors.neutral1,
        overflow: "hidden",
        marginTop: index === 0 ? 0 : 8,
      }}
      activeOpacity={0.7}
    >
      <View
        style={{
          flexDirection: "row",
          padding: 16,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            marginRight: isSelected ? 40 : 0,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: fontFamilies.medium,
              color: globalColors.neutralWhite,
            }}
          >
            {option.title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral9,
              lineHeight: 20,
            }}
          >
            {option.description}
          </Text>
        </View>

        {isSelected && (
          <View
            style={{
              position: "absolute",
              right: 16,
              alignSelf: "center",
            }}
          >
            <CheckCircleIcon />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ViewWrapper>
      <GoBackNavigation header="Report Member" isDeepLink={true} />

      <ScrollView
        style={{
          width: "90%",
        }}
      >
        {/* Description Section */}
        <View
          style={{
            marginVertical: 24,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: fontFamilies.medium,
              color: globalColors.neutralWhite,
            }}
          >
            What do you want to reportoooo?
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral9,
              lineHeight: 20,
            }}
          >
            Your report is anonymous, except if you're reporting an intellectual
            property infringement. If someone is in immediate danger, call the
            local emergency services - don't wait.
          </Text>
        </View>

        {/* Report Options List */}
        <ScrollView
          style={{
            marginBottom: "5%",
          }}
        >
          {reportOptions.map((option, index) => (
            <ReportOption
              key={index}
              option={option}
              index={index}
              isSelected={selectedOption === index}
              onPress={() => handlePress(index)}
            />
          ))}
        </ScrollView>

        {/* Warning Box */}
        <View
          style={{
            flexDirection: "row",
            padding: "3%",
            backgroundColor: globalColors.neutral1,
            borderRadius: 12,
            alignItems: "center",
            borderColor: globalColors.neutral4,
            borderWidth: 0.5,
          }}
        >
          <InfoIcon
            style={{
              marginRight: 12,
            }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutralWhite,
              lineHeight: 20,
            }}
          >
            You will be automatically removed from the group and the associated
            Sub-groups
          </Text>
        </View>

        {/* Report Button */}
        <View
          style={{
            paddingBottom: 20,
          }}
        >
          <Button1
            title="Submit Report"
            onPress={() => router.push("/ReportReviewScreen")}
            containerStyle={{marginHorizontal: '2.5%'}}
            // onPress={() => router.push("/ReportStatusScreen")}
          />
        </View>
      </ScrollView>
    </ViewWrapper>
  );
};

export default ReportUser;
