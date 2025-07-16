import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalColors } from "@/assets/GlobalColors";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  //@ts-ignore
  subContainer: (isSelected: any) => ({
    // width: "40%",
    paddingHorizontal:"5%",
    paddingVertical: 5  ,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    borderBottomColor: isSelected
      ? globalColors.warmPinkShade20
      : "transparent",
    borderBottomWidth: isSelected ? 2.5 : 0,
    flexDirection: "row",
    borderColor: isSelected ? globalColors.warmPink : "transparent",
    borderBottomEndRadius: 1,
  }),
  text: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default styles;
