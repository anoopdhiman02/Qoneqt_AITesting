import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const Layout = () => {
  useScreenTracking("AuthLayout");
  return (
    <Stack
      // initialRouteName="(loginScreen)/LoginScreen"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {/* <Stack.Screen name="(loginScreen)/LoginScreen" />
      <Stack.Screen name="(verifyOtp)/VerifyOtpScreen" /> */}
    </Stack>
  );
};

export default Layout;

const styles = StyleSheet.create({});
