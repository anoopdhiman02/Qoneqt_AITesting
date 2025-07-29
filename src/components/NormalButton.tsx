import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { globalColors } from "@/assets/GlobalColors";

export interface ButtonType {
  label: String;
  onPress?: () => void;
}

const NormalButton = ({ label, onPress }: ButtonType) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: "90%",
        height: 50,
        alignSelf: "center",
        marginBottom: 20,
        borderRadius: 10,
        marginTop: "18%",
        overflow: "hidden",
      }}
    >
      <LinearGradient
        start={{ x: 5, y: 3 }}
        end={{ x: -3, y: 6 }}
        colors={["#2B0A6E", "#8954F6", "#2B0A6E"]}
        style={{
          height: 50,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: globalColors.neutralWhite }}>
          {label ? label : "Next"}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default NormalButton;

const styles = StyleSheet.create({});
