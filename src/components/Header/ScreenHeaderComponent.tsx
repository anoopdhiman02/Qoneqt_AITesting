import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { fontFamilies } from "../../assets/fonts";
import { globalColors } from "@/assets/GlobalColors";

export interface PropsType {
  header: string;
  title: string;
}

const ScreenHeaderComponent = ({ header, title }: PropsType) => {
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        marginTop: "5%",
        // marginBottom: "-5%",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          lineHeight: 34,
          fontFamily: fontFamilies.semiBold,
          color: globalColors.neutralWhite,
          textAlign: "center",
        }}
      >
        {header}
      </Text>
      <Text
        style={{
          fontSize: 17,
          lineHeight: 18,
          fontFamily: fontFamilies.regular,
          color: globalColors.neutral8,
          marginTop: "4%",
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default ScreenHeaderComponent;

const styles = StyleSheet.create({});
