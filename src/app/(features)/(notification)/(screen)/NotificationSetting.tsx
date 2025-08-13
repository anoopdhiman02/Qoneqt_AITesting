import { View, Text, Switch, BackHandler } from "react-native";
import React, { useEffect, useState } from "react";
import ViewWrapper from "@/components/ViewWrapper";
import {
  MailIcon,
  GroupIcon,
  ChatIcon,
  PostNotificationIcon,
  PushNotification,
} from "@/assets/DarkIcon";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import { router } from "expo-router";

const NotificationSetting = () => {
  useScreenTracking("NotificationSetting");
  const [isEnabled, setIsEnabled] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const toggleSwitch = (index) => {
    const newIsEnabled = [...isEnabled];
    newIsEnabled[index] = !newIsEnabled[index];
    setIsEnabled(newIsEnabled);
  };

  const Lists = [
    {
      icon: <PushNotification />,
      title: "Push Notification",
    },
    {
      icon: <MailIcon />,
      title: "Email Notifications",
    },
    {
      icon: <PostNotificationIcon />,
      title: "Post Notifications",
    },
    {
      icon: <GroupIcon />,
      title: "Group Notifications",
    },
    {
      icon: <ChatIcon />,
      title: "Message Notifications",
    },
  ];

  useEffect(()=>{
    const backHandler = BackHandler.addEventListener(
                  "hardwareBackPress",
                  () => {
                    if (router.canGoBack()) {
                      router.back();
                    }
                    else{
                      router.replace("/DashboardScreen");
                    }
                    return true;
                  }
                );
    return () => {
      backHandler.remove();
    };
  },[])
  
  return (
    <ViewWrapper>
      <GoBackNavigation header="Notification" isDeepLink={true} />
      <View style={{ width: "100%", padding: "5%" }}>
        {Lists.map((item, index) => (
          <View
            key={index}
            style={{
              alignSelf: "stretch",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 20,
              borderRadius: 8,
              backgroundColor: globalColors.slateBlueShade80,
              borderColor: globalColors.neutral2,
              borderWidth: 1,
              padding: "4.5%",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {item.icon}
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 21,
                  fontFamily: fontFamilies.semiBold,
                  color: globalColors.neutralWhite,
                  marginLeft: 10,
                }}
              >
                {item.title}
              </Text>
            </View>
            <Switch
              trackColor={{
                false: globalColors.neutral5,
                true: globalColors.darkOrchidShade40,
              }}
              thumbColor={
                isEnabled[index]
                  ? globalColors.neutral8
                  : globalColors.neutral10
              }
              ios_backgroundColor={globalColors.neutral3}
              onValueChange={() => toggleSwitch(index)}
              value={isEnabled[index]}
            />
          </View>
        ))}
      </View>
    </ViewWrapper>
  );
};

export default NotificationSetting;
