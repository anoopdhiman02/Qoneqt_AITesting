import { View, Text } from "react-native";
import React from "react";
import { globalColors } from "@/assets/GlobalColors";

const NoFeedComponent = () => {
  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10%",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          lineHeight: 28,
          fontFamily: "Nunito-Regular",
          color: globalColors.neutral7,
          textAlign: "center",
        }}
      >
        No feed
      </Text>
    </View>
  );
};

export default NoFeedComponent;
