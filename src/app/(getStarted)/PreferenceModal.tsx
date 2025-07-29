import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { globalColors } from "@/assets/GlobalColors";
import ViewWrapper from "@/components/ViewWrapper";
import NormalButton from "@/components/NormalButton";

const { width } = Dimensions.get("window");

const PreferenceModal = () => {
  const onPressContinueHandler = () => {
    console.log("Explore groups Pres");
    router.replace("/DashboardScreen");
  };

  return (
    <ViewWrapper>
      <View style={styles.container}>
        <Image
          source={require("@/assets/image/welcomeImage.png")}
          style={styles.image}
        />
        <Text style={styles.title}>You are all set!</Text>
        <Text style={styles.subtitle}>
          Thanks for helping us out to craft the feed you are looking for!
        </Text>
        <NormalButton label={"Explore Feed"} onPress={onPressContinueHandler} />
      </View>
    </ViewWrapper>
  );
};

export default PreferenceModal;

const styles = StyleSheet.create({
  container: {
    width: "95%",
    alignItems: "center",
    marginTop: "25%",
  },
  image: {
    width: (width * 90) / 100,
    height: (width * 80) / 100,
  },
  title: {
    color: globalColors.neutralWhite,
    fontSize: 24,
    marginTop: "8%",
    textAlign: "center",
  },
  subtitle: {
    color: globalColors.neutralWhite,
    fontSize: 18,
    textAlign: "center",
    width: "95%",
    marginTop: "5%",
  },
});
