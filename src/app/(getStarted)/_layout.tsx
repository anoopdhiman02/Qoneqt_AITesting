import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const _layout = () => {
  useScreenTracking("GetStartedLayout");
  const notificationListener: any = useRef();
  const responseListener: any = useRef();

  useEffect(() => {
    // Handle notification received in foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Foreground Notification:", notification);
      });

    // Handle notification click (background & killed state)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification Clicked:", response);
        const data = response.notification.request.content.data;
        if (data?.screen) {
          // router.push(data.screen); // Navigate to the specified screen
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    ></Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
