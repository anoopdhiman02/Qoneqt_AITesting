import { SafeAreaView, StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

interface ViewWrapperProps {
  children: React.ReactNode;
  onPress?: () => void;
}

const ViewWrapper = ({ children, onPress }: ViewWrapperProps) => {
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
          }}
          colors={["#020015", "#492E98"]}
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
