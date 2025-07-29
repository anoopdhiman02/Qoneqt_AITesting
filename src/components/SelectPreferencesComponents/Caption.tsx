import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";

const Caption = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        Select categories of your preferences.
      </Text>
      <Text style={styles.subtitleText}>
        We will customize your feed according to the preferences you've chosen.
      </Text>
    </View>
  );
};

export default Caption;

const styles = StyleSheet.create({
  container: {
    marginTop: "5%",
    paddingLeft: "2%",
    width: "95%",
  },
  titleText: {
    fontSize: 30,
    fontFamily: fontFamilies.bold,
    color: globalColors.neutralWhite,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
    marginTop: 10,
  },
});
