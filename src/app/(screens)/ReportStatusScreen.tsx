import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import React from "react";
import ViewWrapper from "@/components/ViewWrapper";
import NormalButton, { ButtonType } from "@/components/NormalButton";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import Button1 from "@/components/buttons/Button1";
import { router } from "expo-router";
const { width } = Dimensions.get("window");
const ReportStatusScreen = ({ label, onPress }: ButtonType) => {
  return (
    <ViewWrapper>
      <View style={styles.container}>
        <Image
          source={require("@/assets/image/welcomeImage.png")}
          style={styles.image}
        />
        <Text style={styles.title}>Thank you, we’ve received your report</Text>
        <Text style={styles.subtitle}>
          Your report helps us improve our processes and keeps Qoneqt safe for
          everyone.
        </Text>
        <Button1
          title="Go to home"
          onPress={() => router.replace("/DashboardScreen")}
          containerStyle={{marginHorizontal: '2.5%'}}
        />
      </View>
    </ViewWrapper>
  );
};

export default ReportStatusScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: "25%",
    width: "95%",
    height: "90%",
    alignItems: "center",
  },
  image: {
    width: (width * 90) / 100,
    height: (width * 80) / 100,
  },
  title: {
    color: globalColors.neutralWhite,
    fontSize: 28,
    marginTop: "8%",
    textAlign: "center",
    fontFamily: fontFamilies.bold,
    width: "95%",
  },
  subtitle: {
    color: globalColors.neutral8,
    fontSize: 16,
    textAlign: "center",
    width: "95%",
    marginTop: "5%",
  },
});
