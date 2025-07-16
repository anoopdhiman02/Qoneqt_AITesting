import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import ViewWrapper from "@/components/ViewWrapper";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ArrowUpIcon, ArrowDownIcon } from "@/assets/DarkIcon";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const PrivacyPolicyScreen = () => {
  useScreenTracking("PrivacyPolicyScreen");
  const [expandedItem, setExpandedItem] = useState(null);

  const Data = [
    {
      id: 1,
      title: "A. Account Information",
      content: `A.1 Core Data:

The data which you provide for Registration is Name, Mobile no and otp will be required or You can directly sign up with your LinkedIn account. As Qoneqt is an authenticated user platform verification is mandatory whereby user provides additional data of email id, Date of Birth, Gender , Nationality , Face verification & email verification.

A.2 Non-Core Data:

In the profile section users provide self-information related to Address and interest to make the profile complete. For payment purposes third party applications like PayPal, etc. also collect data related to their respective platforms.
`,
    },
    {
      id: 2,
      title: "B. Data from Other Sources",
      content: `Active user’s data regarding posts, comments, articles and videos will not be the part of data collection. However, if someone reports the content to be inappropriate, platform’s discretion on removal of data will be retained. 
      Data can also be collected from third party applications and sources to enrich the experience on platform.`,
    },
    {
      id: 3,
      title: "C. Logging and Security Information",
      content: `For the security of users, data of your logging information with IP addresses will also be collected to avoid misuse of accounts.`,
    },
    {
      id: 4,
      title: "D. Cookies Policy",
      content: `Cookie data (device IDs) is collected to identify with respect to user’s login activities. Only one cookie is used regarding the login credential for users and one for server.`,
    },
    {
      id: 5,
      title: "E. Data Usage",
      content: `All the mentioned data is collected to enrich the experience of users and in no way the Company will sell or outsource the Core Data of platform to any third party
All the core data except encrypted email Id, password, city, country, date of birth, Id no and mobile number are deleted from online server.`,
    },
    {
      id: 6,
      title: "F. Customer Support",
      content: `We will analyses the data only if it is reported by the Group members or inappropriate. The word “inappropriate” refers to any illegal activity declared by a country in their limit, however, discretion of inappropriate content will rest with the platform and the company.`,
    },
    {
      id: 7,
      title: "G. Information Sharing",
      content: `Users can share the platform information through individual marketing, invites and posting content on other third party websites and/or platforms.`,
    },
    {
      id: 8,
      title: "H. Legal Disclosures",
      content: `There is also a possibility of data being required by legal authorities to investigate and detect inappropriate activities on platform. The decision to share the data will be at the discretion of platform and the company.`,
    },
    {
      id: 9,
      title: "I. Changes to Privacy Policy",
      content: `The policies are subject to change time to time and the discretion of changing it rests with the platform and the company.
By access to website/mobile application you are agreeing to the given policies and bound by them.The policies are subject to change time to time and the discretion of changing it rests with the platform and the company.
By access to website/mobile application you are agreeing to the given policies and bound by them.`,
    },
    {
      id: 10,
      title: "J. Protecting Your Security",
      content: `Please note that we may share your personal details with fraud prevention or credit reference agency for conducting anti-fraud checks. Please note that in this process no credit check is performed, and your credit rating remains unaffected.`,
    },
    {
      id: 11,
      title: "K. Disclosures of Your Information",
      content: `We use your personal information to:
 a) provide the services you request;
 b) to resolve disputes & troubleshoot problems;
 c) promote a safe service;
 d) measure consumer interest in our products and services;
 e) inform you about online and offline offers, products, services, and updates;
 f) request optional online surveys
 Please note that we will provide you the ability to opt-out of such uses`,
    },
  ];

  const toggleItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <ViewWrapper>
      <GoBackNavigation header="Privacy Policy" isDeepLink={true} />
      <ScrollView style={{ width: "100%", padding: "3%" }}>
        <Text
          style={{
            color: globalColors.neutral9,
            lineHeight: 24,
            textAlign: "left",
            fontSize: 16,
            marginVertical: "3.5%",
            paddingHorizontal: "1%",
          }}
        >
          The Privacy Policy aims at safe guarding the confidentiality of our
          customers and site visitors (“you”, “your”, “yours”). We hereby
          declare that your details will not be disclosed to any third party
          unless legally required. Please go through the below mentioned Privacy
          Policy points carefully. By accessing our website, you acknowledge
          reading and understanding the policies, and hence agree to be bound by
          the terms stated below.
        </Text>
        <Text
          style={{
            color: globalColors.neutralWhite,
            lineHeight: 28,
            textAlign: "justify",
            fontSize: 20,
            fontFamily: fontFamilies.bold,
            marginVertical: "2%",
            alignSelf: "flex-start",
            marginLeft: "5%",
          }}
        >
          Collection of Data
        </Text>
        <View style={{ width: "100%", marginBottom: "20%" }}>
          {Data.map((item) => (
            <View key={item.id}>
              <TouchableOpacity
                onPress={() => toggleItem(item.id)}
                style={{
                  flexDirection: "row",
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: globalColors.neutral4,
                  padding: "4.5%",
                  marginTop: "5%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: globalColors.neutral10,
                    flex: 1,
                    fontSize: 14,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  {item.title}
                </Text>
                {expandedItem === item.id ? (
                  <ArrowDownIcon style={{ marginLeft: 10 }} />
                ) : (
                  <ArrowUpIcon style={{ marginLeft: 10 }} />
                )}
              </TouchableOpacity>
              {expandedItem === item.id && (
                <View
                  style={{
                    backgroundColor: globalColors.slateBlueShade80,
                    padding: "5%",
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      color: globalColors.neutral9,
                      fontSize: 14,
                      letterSpacing: 0.5,
                      lineHeight: 21,
                    }}
                  >
                    {item.content}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </ViewWrapper>
  );
};

export default PrivacyPolicyScreen;
