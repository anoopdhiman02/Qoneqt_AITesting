import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { WalletIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";

export const NotificationHeaderComponent = () => {
  return (
    <TouchableOpacity
      onPress={() => console.log("Complete the paid group setup!")}
      style={{
        borderRadius: 8,
        backgroundColor: "rgba(27, 18, 77, 0.05)",
        borderStyle: "solid",
        borderColor: "#633de9",
        borderWidth: 1,
        overflow: "hidden",
        flexDirection: "row",
        padding: "3%",
        marginVertical: "2%",
      }}
    >
      <WalletIcon style={{ marginTop: "7%" }} />
      <View
        style={{
          width: "70%",
          flexDirection: "column",
          alignItems: "flex-start",
          marginLeft: "5%",
        }}
      >
        <Text
          style={{
            alignSelf: "stretch",
            fontSize: 16,
            lineHeight: 21,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutralWhite,
            textShadowColor: "rgba(0, 0, 0, 0.25)",
            textShadowOffset: { width: 0, height: 4 },
            textShadowRadius: 4,
          }}
        >
          Complete the paid group setup!
        </Text>
        <Text
          style={{
            alignSelf: "stretch",
            fontSize: 12,
            lineHeight: 16,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutralWhite,
            marginTop: 4,
          }}
        >
          You left your paid group half-way! Visit our FAQ for a quick guidance.
        </Text>
      </View>
    </TouchableOpacity>
  );
};
