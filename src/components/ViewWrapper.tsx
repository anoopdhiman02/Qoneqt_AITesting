import { SafeAreaView, StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ViewWrapperProps {
  children: React.ReactNode;
  onPress?: () => void;
  isBottomTab?: boolean;
}

const ViewWrapper = ({ children, onPress, isBottomTab }: ViewWrapperProps) => {
  const insets = useSafeAreaInsets();
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          
        }}
      >
        <LinearGradient
          start={{ x: 0.1, y: 0.5 }}
          end={{ x: -0.1, y: -2 }}
          style={{
            flex: 1,
            width: "100%",
            paddingTop: "10%",
            alignItems: "center",
            paddingBottom: isBottomTab ? 0 : (Platform.OS === "ios" ? 10 : insets.bottom)+20,
          }}
          // colors={["#020015", "#492E98"]}
          colors={["#0f0721", "#0f0721"]}
        >
          {children}
        </LinearGradient>
        <StatusBar style="light" />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ViewWrapper;

const styles = StyleSheet.create({});
