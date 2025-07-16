import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import ViewWrapper from "@/components/ViewWrapper";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import {
  AppIcon,
  AppSmallIcon,
  ArrowRightIcon,
  ChannelsIcon,
  ChatIcon,
  FlashIcon,
  GroupIcon,
  SearchIcon,
} from "@/assets/DarkIcon";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import Button1 from "@/components/buttons/Button1";
import { router } from "expo-router";

const SupportFAQ = () => {
  const [searchMain, setSearchMain] = useState("");

  const data = [
    {
      id: 1,
      title: "Groups",
      description: "Create or join a group, Create a post...",
      icon: <GroupIcon />,
      screen: "FAQGroupsScreen",
    },
    // {
    //   id: 2,
    //   title: "Sub-Groups",
    //   description: "Create join, Join a channel.... ",
    //   icon: <ChannelsIcon />,
    //   screen: "FAQChannelScreen",
    // },
    // {
    //   id: 3,
    //   title: "Perks",
    //   description: "Request perks, Gift amount, Transactions...",
    //   icon: <FlashIcon />,
    //   screen: "FAQGroupsScreen",
    // },
    // {
    //   id: 4,
    //   title: "Qoneqt Application",
    //   description: "App related other queries",
    //   icon: <AppSmallIcon />,
    //   // screen: "FAQGroupsScreen",
    // },
  ];

  const navigateToScreen = (screen) => {
    if (screen) {
      router.push(screen);
    }
  };

  return (
    <ViewWrapper>
      <GoBackNavigation header="Support & FAQs" isDeepLink={true} />
      <View style={{ width: "95%" }}>

        <ScrollView
          style={{ width: "100%", marginBottom: "10%" }}
          contentContainerStyle={{ alignItems: "center" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: "90%" }}>
            <View
              style={{
                flexDirection: "row",
                padding: "4%",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderColor: globalColors.warmPinkTint20,
                borderTopWidth: 1,
                borderStartWidth: 1,
                borderEndWidth: 1,
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  marginRight: "8%",
                  backgroundColor: globalColors.neutral2,
                  padding: "3%",
                  borderRadius: 10,
                }}
              >
                <AppIcon />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: globalColors.neutralWhite,
                    fontSize: 18,
                    fontFamily: fontFamilies.semiBold,
                  }}
                >
                  Explore Qoneqt !
                </Text>
                <Text
                  style={{
                    color: globalColors.neutral5,
                    fontSize: 13,
                    fontFamily: fontFamilies.semiBold,
                  }}
                >
                  Let us guide you through the application with a step-by-step
                  walkthrough.
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 20,
                fontFamily: fontFamilies.semiBold,
                marginTop: 20,
              }}
            >
              Frequently asked questions
            </Text>
            <Text
              style={{
                color: globalColors.neutral5,
                fontSize: 16,
                fontFamily: fontFamilies.semiBold,
                marginTop: 5,
              }}
            >
              Select a category and find the help you need
            </Text>
            {data.map((option) => (
              <TouchableOpacity
                onPress={() => navigateToScreen(option.screen)}
                key={option.id}
                style={{
                  width: "100%",
                  backgroundColor: globalColors.slateBlueShade80,
                  padding: "5%",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginTop: "5%",
                  borderRadius: 10,
                  borderColor: globalColors.neutral4,
                  borderWidth: 0.5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      padding: "2%",
                      backgroundColor: globalColors.neutral3,
                      width: "15%",
                      borderRadius: 10,
                      marginRight: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {option.icon}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{ color: globalColors.neutralWhite, fontSize: 14 }}
                    >
                      {option.title}
                    </Text>
                    <Text style={{ color: globalColors.neutral5 }}>
                      {option.description}
                    </Text>
                  </View>
                </View>
                <ArrowRightIcon style={{ alignSelf: "center" }} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </ViewWrapper>
  );
};

export default SupportFAQ;
